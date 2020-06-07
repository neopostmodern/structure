import React from 'react'
import { useDispatch } from 'react-redux'
import { push } from 'connected-react-router'
import styled from 'styled-components'

import { TagType } from '../types'

export const BaseTag = styled.div`
  padding: 0.2em 0.4em 0.1em;
  margin-right: 0.5rem; // $tag-margin;
  cursor: pointer;
  background-color: #ddd;
`

interface TagProps {
  tag: TagType
}

const Tag: React.FC<
  TagProps &
    React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLDivElement>,
      HTMLDivElement
    >
> = ({ tag, onClick, ...props }) => {
  const dispatch = useDispatch()
  return (
    <BaseTag
      key={tag._id}
      style={{ backgroundColor: tag.color }}
      onClick={
        onClick ||
        ((): void => {
          dispatch(push(`/tags/${tag._id}`))
        })
      }
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    >
      {tag.name}
    </BaseTag>
  )
}

export default Tag
