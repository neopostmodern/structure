import isEqual from 'lodash/isEqual'
import pick from 'lodash/pick'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import type { NotesForListQuery } from '../generated/graphql'
import useHasPermission from '../hooks/useHasPermission'
import useSyncForm from '../hooks/useSyncForm'
import { OptionalReactComponent } from '../utils/types'
import useSaveOnUnmount from '../utils/useSaveOnUnmount'
import { NameInput } from './formComponents'
import Gap from './Gap'
import MarkedTextarea from './MarkedTextarea'

type NoteType = NotesForListQuery['notes'][number]

const textFormFields: Array<keyof NoteType> = [
  '_id',
  'updatedAt',
  'name',
  'description',
]
export type TextInForm = Pick<NoteType, (typeof textFormFields)[number]>

interface TextFormProps {
  text: NoteType
  onSubmit: (text: TextInForm) => void
  tagsComponent?: OptionalReactComponent
}

const TextForm: React.FC<TextFormProps> = ({
  text,
  onSubmit,
  tagsComponent,
}) => {
  const defaultValues = pick(text, textFormFields) as TextInForm
  const formProps = useForm<TextInForm>({
    defaultValues,
    mode: 'onBlur',
    resolver: (formValues) => {
      if (!isEqual(formValues, defaultValues)) {
        onSubmit(formValues)
      }
      return { values: formValues, errors: {} }
    },
  })
  const { register, reset, handleSubmit } = formProps

  useSyncForm(reset, defaultValues, text)

  useSaveOnUnmount({ onSubmit, defaultValues }, formProps)

  const onlyReadPermission = !useHasPermission(text, 'notes', 'write')

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <FormProvider {...formProps}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <NameInput
          type='text'
          label='Title'
          {...register('name', { required: true })}
          inputProps={{ readOnly: onlyReadPermission }}
        />

        {tagsComponent && (
          <>
            <Gap vertical={1} />
            {tagsComponent}
          </>
        )}
        <Gap vertical={2} />

        <MarkedTextarea name='description' readOnly={onlyReadPermission} />
      </form>
    </FormProvider>
  )
}

export default TextForm
