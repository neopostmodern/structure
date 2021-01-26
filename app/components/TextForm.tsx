import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import MarkedTextarea from './MarkedTextarea'
import { NameInput } from './formComponents'
import { NoteObject } from '../reducers/links'

interface TextFormProps {
  text: NoteObject
  onSubmit: (text: NoteObject) => void
}

const TextForm: React.FC<TextFormProps> = ({ text, onSubmit }) => {
  const formProps = useForm<NoteObject>({
    defaultValues: text,
    mode: 'onBlur',
    resolver: (formValues) => {
      // todo: validate
      onSubmit({ _id: text._id, ...formValues })
      return { values: formValues, errors: {} }
    },
  })
  const { register, handleSubmit } = formProps

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <FormProvider {...formProps}>
      <form onSubmit={handleSubmit((data) => onSubmit(data))}>
        <NameInput name='name' type='text' ref={register({ required: true })} />

        <MarkedTextarea name='description' />
      </form>
    </FormProvider>
  )
}

export default TextForm
