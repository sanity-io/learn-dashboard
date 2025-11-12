import { DocumentHandle, useDocument } from '@sanity/sdk-react'
import { Avatar, Code, Flex, Text } from '@sanity/ui'

type UserCardProps = {
  handle: DocumentHandle
}

function padStart(value: number, length: number) {
  return value.toString().padStart(length, '0')
}

export function UserCard({ handle }: UserCardProps) {
  const { data } = useDocument({ ...handle })
  const name = handle.documentId
    .replace('progress.', '')
    .replace('project_', '')
  const lessons = Array.isArray(data?.lessons) ? data.lessons : []
  const exams = Array.isArray(data?.exams) ? data.exams : []

  const taskCount = lessons.length
  const taskLabel = taskCount === 1 ? 'Task' : 'Tasks'
  const examCount = exams.filter((exam) => exam.pass).length
  const examLabel = examCount === 1 ? 'Exam passed' : 'Exams passed'

  return (
    <Flex align="center" gap={2}>
      <Avatar size={1} initials={name.slice(0, 2)} />
      <Code>{padStart(taskCount, 3)}</Code>
      <Text muted size={1}>
        {taskLabel}
      </Text>
      {examCount > 0 && (
        <>
          <Text muted size={1}>
            •
          </Text>
          <Code>{examCount}</Code>
          <Text muted size={1}>
            {examLabel}
          </Text>
        </>
      )}
    </Flex>
  )
}
