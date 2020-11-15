import React from 'react'
import { FormContext, useForm } from 'react-hook-form'

import MarkedTextarea from './MarkedTextarea'
import { NameInput } from './formComponents'
import { NoteObject } from '../reducers/links'

interface TextFormProps {
  // todo: typings
  text: NoteObject
  onSubmit: (text: NoteObject) => void
}

const TextForm: React.FC<TextFormProps> = ({ text, onSubmit }) => {
  const formProps = useForm<NoteObject>({
    defaultValues: text,
  })
  const { register, watch, handleSubmit } = formProps

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <FormContext {...formProps}>
      <form onSubmit={handleSubmit((data) => onSubmit(data))}>
        <NameInput name='name' type='text' ref={register({ required: true })} />

        <MarkedTextarea
          name='description'
          inputRef={register}
          displayValue={watch('description')}
        />
      </form>
    </FormContext>
  )
}

export default TextForm
