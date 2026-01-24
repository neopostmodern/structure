import isEqual from 'lodash/isEqual'
import pick from 'lodash/pick'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import type { NoteQuery } from '../generated/graphql'
import useHasPermission from '../hooks/useHasPermission'
import useSyncForm from '../hooks/useSyncForm'
import { isUrlValid } from '../utils/textHelpers'
import { OptionalReactComponent } from '../utils/types'
import useSaveOnUnmount from '../utils/useSaveOnUnmount'
import NoteNameField from './fields/NoteNameField'
import UrlField from './fields/UrlField'
import { FormSubheader } from './formComponents'
import Gap from './Gap'
import MarkedTextarea from './MarkedTextarea'

const noteFormFields: Array<keyof NoteQuery['note']> = [
  '_id',
  'updatedAt',
  'url',
  'name',
  'description',
  'archivedAt',
]
export type NoteInForm = Pick<
  NoteQuery['note'],
  (typeof noteFormFields)[number]
>

type NoteFormProps = {
  note: NoteQuery['note']
  onSubmit: (updatedNote: NoteInForm) => void
  tagsComponent?: OptionalReactComponent
}

const NoteForm: React.FC<NoteFormProps> = ({
  note,
  onSubmit,
  tagsComponent,
}) => {
  const defaultValues = pick(note, noteFormFields)
  const onlyReadPermission = !useHasPermission(note, 'notes', 'write')

  const formProps = useForm<NoteInForm>({
    defaultValues,
    mode: 'onBlur',
    resolver: (formValues) => {
      const errors: { [key: string]: string } = {}
      if (formValues.url && !isUrlValid(formValues.url)) {
        errors.url =
          'Not a valid URL – did you forget the protocol? (e.g. https://)'
      }
      if (
        Object.keys(errors).length === 0 &&
        !isEqual(formValues, defaultValues)
      ) {
        onSubmit(formValues)
      }
      return { values: formValues, errors }
    },
  })
  const { watch, handleSubmit, reset } = formProps

  useSyncForm(reset, defaultValues, note)
  useSaveOnUnmount({ onSubmit, defaultValues }, formProps)

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <FormProvider {...formProps}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <NoteNameField
          url={watch('url')}
          name='name'
          noteId={note._id}
          readOnly={onlyReadPermission}
        />
        <Gap vertical={0.5} />
        <UrlField name='url' readOnly={onlyReadPermission} />

        {tagsComponent && (
          <>
            <Gap vertical={1} />
            {tagsComponent}
          </>
        )}
        <Gap vertical={2} />

        <FormSubheader>Description / notes</FormSubheader>
        <MarkedTextarea name='description' readOnly={onlyReadPermission} />
      </form>
    </FormProvider>
  )
}

export default NoteForm
