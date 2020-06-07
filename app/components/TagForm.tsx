import React from 'react'
import styled from 'styled-components'
import { useForm } from 'react-hook-form'
import { LinkType, TagType } from '../types'
import { NameInput } from './formComponents'
import { TextField } from './CommonStyles'

const ColorBlockInput = styled(TextField)`
  width: 10rem;
  height: 10rem;
  margin-bottom: 2rem;

  text-align: center;
  font-size: 0;
  cursor: pointer;

  &:focus {
    font-size: initial;
    cursor: initial;
  }
`

interface TagFormProps {
  tag: TagType
  onSubmit: (tag: TagType) => void
}

const TagForm: React.FC<TagFormProps> = ({ tag, onSubmit }) => {
  const submitTag = (updatedFormValues: TagType): void => {
    onSubmit({ _id: tag._id, ...updatedFormValues })
  }

  const { register, handleSubmit } = useForm<TagType>({
    defaultValues: tag,
    mode: 'onBlur',
    validationResolver: (formValues) => {
      // todo: validate
      submitTag(formValues)
      return { values: formValues, errors: {} }
    },
  })

  return (
    <form onSubmit={handleSubmit(submitTag)}>
      <ColorBlockInput
        name='color'
        ref={register}
        type='text'
        style={{ backgroundColor: tag.color }}
      />

      <NameInput name='name' type='text' ref={register({ required: true })} />
    </form>
  )
}

export default TagForm
