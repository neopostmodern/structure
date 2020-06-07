import React from 'react'
import { useForm } from 'react-hook-form'

import MarkedTextarea from './MarkedTextarea'
import { NameInput } from './formComponents'
import { NoteObject } from '../reducers/links'

interface TextFormProps {
  // todo: typings
  text: NoteObject
  onSubmit: (text: NoteObject) => void
}

const TextForm: React.FC<TextFormProps> = ({ text, onSubmit }) => {
  const { register, watch, handleSubmit } = useForm<NoteObject>({
    defaultValues: text,
  })

  return (
    <form onSubmit={handleSubmit((data) => onSubmit(data))}>
      <NameInput name='name' type='text' ref={register({ required: true })} />

      <MarkedTextarea
        name='description'
        inputRef={register}
        displayValue={watch('description')}
      />
    </form>
  )
}

export default TextForm
