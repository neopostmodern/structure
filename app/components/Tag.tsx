import React from 'react'
import { useDispatch } from 'react-redux'
import { push } from 'connected-react-router'
import styled from 'styled-components'

import { TagType } from '../types'
import colorTools from '../utils/colorTools'
import { TagObject } from '../reducers/links'

export const tagMargin = '0.5rem'
export const BaseTag = styled.div<{ tag?: TagObject }>`
  padding: 0.2em 0.4em 0.1em;
  margin-right: ${tagMargin};
  cursor: pointer;
  background-color: ${({ tag }): string => tag?.color || '#ddd'};
`

export const AddNewTag = styled(BaseTag)`
  background-color: white;
  border: 1px solid black;
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
      tag={tag}
      onClick={
        onClick ||
        ((): void => {
          dispatch(push(`/tags/${tag._id}`))
        })
      }
      ref={colorTools}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    >
      {tag.name}
    </BaseTag>
  )
}

export default Tag
