import { Hono } from "hono";
import { anthropic } from "@ai-sdk/anthropic";
import {
  type UIMessage,
  convertToCoreMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  streamText,
  validateUIMessages,
} from "ai";
import type { PortableTextBlock } from "@portabletext/types";
import { type SanityDocument, createClient } from "@sanity/client";

const model = anthropic("claude-sonnet-4-20250514");

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || "",
  dataset: process.env.SANITY_DATASET || "",
  apiVersion: "2025-09-15",
  useCdn: false,
  perspective: "drafts",
  token: process.env.SANITY_READ_TOKEN,
});

const SANITY_PRODUCT_NAMES = [
  "Sanity Studio",
  "Sanity",
  "Content Lake",
  "GROQ",
];

// Simple in-memory cache for documents (in production, use Redis or similar)
const documentCache = new Map<string, { document: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Clean up expired cache entries
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of documentCache.entries()) {
    if (now - value.timestamp > CACHE_TTL) {
      documentCache.delete(key);
    }
  }
}, 60000); // Run every minute

export const aiRoutes = new Hono();

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

type ChatBody = {
  messages: UIMessage[];
  documentId?: string;
  title?: string;
};

// Define your custom message type with data part schemas
export type CorrectionUIMessage = UIMessage<
  never, // metadata type
  {
    correction: {
      id: string;
      key: string;
      before: string;
      after: string;
      context: string;
      explanation: string;
      status: "found" | "processing" | "completed";
    };
    notification: {
      message: string;
      level: "info" | "warning" | "error";
    };
  }
>;

aiRoutes.post("/chat", async (c) => {
  try {
    const body: ChatBody = await c.req.json();

    let messages: UIMessage[] = [];
    let documentId = body.documentId;
    let title = body.title;

    try {
      messages = await validateUIMessages({ messages: body.messages });
    } catch (error) {
      console.error("Error validating messages:", error);
      return c.json({ error: "Invalid messages format" }, 400);
    }

    if (!documentId) {
      return c.json({ error: "Document ID is required" }, 400);
    } else if (!title) {
      return c.json({ error: "Title is required" }, 400);
    }

    // Check cache first
    let document = documentCache.get(documentId)?.document;

    if (!document) {
      // Fetch from Sanity if not in cache
      const DOCUMENT_QUERY = /* groq */ `*[_id == $documentId][0]{
        ...,
        content[] {
          ...,
          children[] {
            ...,
            _type in ["article", "lesson", "course", "track"] => @->{
              "text":title,
            }
          }
        }
      }`;
      document = await client.fetch(DOCUMENT_QUERY, { documentId });

      if (!document) {
        return c.json({ error: "Document not found" }, 404);
      }

      // Cache the document
      documentCache.set(documentId, {
        document,
        timestamp: Date.now(),
      });
    } else {
      console.log("Using cached document for:", documentId);
    }

    const systemPrompt = getSystemPrompt(title, document);

    // For spelling and grammar, use structured data parts
    if (title === "Spelling and grammar") {
      const stream = createUIMessageStream<CorrectionUIMessage>({
        execute: ({ writer }) => {
          // Send initial processing notification
          writer.write({
            type: "data-notification",
            data: {
              message: "Analyzing document for spelling and grammar issues...",
              level: "info",
            },
            transient: true,
          });

          const result = streamText({
            model,
            system: systemPrompt,
            messages: convertToCoreMessages(messages),
            onFinish: async (result) => {
              // Parse the AI response to extract corrections
              const corrections = parseCorrectionsFromResponse(result.text);

              // Send each correction as a data part
              corrections.forEach((correction, index) => {
                writer.write({
                  type: "data-correction",
                  id: `correction-${index}`,
                  data: {
                    id: `correction-${index}`,
                    key: correction.key,
                    before: correction.before,
                    after: correction.after,
                    context: correction.context,
                    explanation: correction.explanation,
                    status: "found",
                  },
                });
              });

              // Send completion notification
              writer.write({
                type: "data-notification",
                data: {
                  message:
                    corrections.length > 0
                      ? `Found ${corrections.length} issues to review`
                      : "No issues found - document looks good!",
                  level: "info",
                },
                transient: true,
              });
            },
          });

          writer.merge(result.toUIMessageStream());
        },
      });

      return createUIMessageStreamResponse({ stream });
    }

    // For other review types, use the original streaming approach
    const result = streamText({
      model,
      system: systemPrompt,
      messages: convertToCoreMessages(messages),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("AI route error:", error);

    return c.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      500,
    );
  }
});

function parseCorrectionsFromResponse(text: string) {
  const corrections: Array<{
    key: string;
    before: string;
    after: string;
    context: string;
    explanation: string;
  }> = [];
  const lines = text.split("\n");

  for (const line of lines) {
    // Look for the new format: block-key ||| before-word ||| after-word ||| full sentence context ||| explanation
    const newFormatMatch = line.match(/^([^|]+)\s*\|\|\|\s*(.+)$/);

    if (newFormatMatch) {
      const [, key, restOfLine] = newFormatMatch;
      const parts = restOfLine.split("|||").map((part) => part.trim());

      if (parts.length >= 4) {
        const before = parts[0];
        const after = parts[1];
        const context = parts[2];
        const explanation = parts[3];

        corrections.push({
          key: key.trim(),
          before: before.trim(),
          after: after.trim(),
          context: context.trim(),
          explanation: explanation.trim(),
        });
        continue;
      }
    }
  }

  return corrections;
}

type DocumentWithContent = SanityDocument & { content: PortableTextBlock[] };

function getSystemPrompt(title: string, document: DocumentWithContent): string {
  if (!document.content) {
    throw new Error("No content available");
  }

  // Convert Portable Text to plain text for better AI understanding
  const documentContent = document.content
    .filter((block) => block._type === "block")
    .map(
      (block) => `
      <block>
        <key>${block._key}</key>
        <style>${block.style}</style>
        <text>${blocksToText([block])}</text>
      </block>`,
    )
    .join("\n");

  const defaultPrompt = `You are a fantastic technical copywriter. You are answering questions on behalf of somebody who has authored educational content for Sanity, the content operating system.

You are currently helping with a document review. Here is the document being reviewed:

<type>${document._type || "unknown"}</type>
<title>${document.title || "Untitled"}</title>
<content-blocks>
  ${documentContent}
</content-blocks>`;

  switch (title) {
    case "Spelling and grammar":
      return `${defaultPrompt}

Please help the user by reviewing the spelling and grammar throughout this document. Reply with a numbered list of suggestions for improvement. 

Our spelling and grammar rules:
- Documents should be written in US English.
- Titles should be in sentence case.
- Titles do not need to end with a period or comma.
- We use the Oxford comma.
- The following product names are proper nouns: ${SANITY_PRODUCT_NAMES.join(", ")}.
- Course titles and product names do not need to be surrounded by quotes.
- Do not make suggestions about URLs or code blocks.

For each issue found, provide exactly one line in this format:
<block-key> ||| <before-word> ||| <after-word> ||| <full sentence context> ||| <explanation>

Example:
4c79ffa20104 ||| build script ||| Build script ||| You may need to remove --turbopack from the build script in package.json ||| "Build script" should be capitalized as it refers to a specific named script

IMPORTANT: 
- Only include the specific word or phrase that needs to change, not the entire sentence
- Each correction must be on its own line
- Do not use numbered lists or any other formatting

If you don't find any issues, just say "No issues found".`;
    case "Foreign concepts":
      return `${defaultPrompt}
      
      You may be prompted to review this content, checking for if any concepts have been introduced that have not already been explained. It could be that a concept has been explained in a prior lesson, but it is worth highlighting within the context of this lesson whether it needs a better explanation.`;
    case "Style guide":
      return `You are a fantastic technical copywriter. You are answering questions on behalf of somebody who has authored educational content for Sanity, the content operating system.`;
    default:
      return defaultPrompt;
  }
}

const defaults = { nonTextBehavior: "remove" };

function blocksToText(blocks: PortableTextBlock[], opts = {}) {
  const options = Object.assign({}, defaults, opts);
  return blocks
    .map((block) => {
      if (block._type !== "block" || !block.children) {
        return options.nonTextBehavior === "remove"
          ? ""
          : `[${block._type} block]`;
      }

      return block.children.map((child) => child.text).join("");
    })
    .join("\n\n");
}
