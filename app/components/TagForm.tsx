import React from 'react'
import styled from 'styled-components'
import { useForm } from 'react-hook-form'
import { TagType } from '../types'
import { NameInput } from './formComponents'

const ColorBlockInput = styled.input`
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
  const { register, handleSubmit } = useForm<TagType>({
    defaultValues: tag,
  })

  return (
    <form onSubmit={handleSubmit((data) => onSubmit(data))}>
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
