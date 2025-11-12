# Learn Dashboard

This is an example [Sanity App SDK](https://www.sanity.io/app-sdk) application built for [Sanity Learn](https://www.sanity.io/learn).

It is offered as a working example of a complex application, But without warranty. Use it to reference coding patterns, but do not expect to find it immediately useful for your use case as-is.

Take the Sanity Learn course on how to [Build content apps with Sanity App SDK](https://www.sanity.io/learn/course/build-content-apps-with-sanity-app-sdk).

## Structure

A [pnpm](https://pnpm.io/) monorepo with:

- `/apps/dashboard` - Sanity App SDK application
  -- Uses [Sanity UI](https://www.sanity.io/ui) for styling
  -- Uses [React Router](https://reactrouter.com/) for navigation
- `/apps/stats` - [Hono](https://hono.dev/) server
  -- Proxies statistics from [Fathom Analytics API](https://usefathom.com/docs/api-reference/introduction)
