import { DocumentHandle, useDocument, useEditDocument } from '@sanity/sdk-react'
import { Select } from '@sanity/ui'

import { COHORT_CATEGORIES } from './cohorts-wrapper'

type EditCategoryProps = {
  handle: DocumentHandle
}

export function EditCategory({ handle }: EditCategoryProps) {
  const { data: value } = useDocument<string | null>({
    ...handle,
    path: 'category',
  })
  const edit = useEditDocument({ ...handle, path: 'category' })
  const options = Object.entries(COHORT_CATEGORIES).filter(
    ([key]) => key !== 'all',
  )

  return (
    <Select value={value || ''} onChange={(e) => edit(e.currentTarget.value)}>
      <option value=""></option>
      {options.map(([key, value]) => (
        <option key={key} value={key}>
          {value}
        </option>
      ))}
    </Select>
  )
}
