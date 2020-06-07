import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useMutation, useQuery } from '@apollo/client'
import ClassNames from 'classnames'
import gql from 'graphql-tag'

import styles from './TagsPage.scss'
import { TagType } from '../types'
import colorTools, { ColorCache } from '../utils/colorTools'
import { changeTagsLayout, TagsLayout } from '../actions/userInterface'
import { TagsQuery } from '../generated/TagsQuery'
import { RootState } from '../reducers'
import { UpdateTag2, UpdateTag2Variables } from '../generated/UpdateTag2'
import Tag from '../components/Tag'
import { Menu } from '../components/Menu'

export const layoutToName = (layout: TagsLayout): string => {
  switch (layout) {
    case TagsLayout.CHAOS_LAYOUT:
      return 'Chaos layout'
    case TagsLayout.COLOR_LIST_LAYOUT:
      return 'Color list layout'
    case TagsLayout.COLOR_COLUMN_LAYOUT:
      return 'Color column layout'
    case TagsLayout.COLOR_WHEEL_LAYOUT:
      return 'Color wheel layout'
    default:
      console.error('Unknown layout', layout)
      return 'Unknown layout'
  }
}

const TAGS_QUERY = gql`
  query TagsQuery {
    tags {
      _id
      name
      color
    }
  }
`

const UPDATE_TAG_MUTATION = gql`
  mutation UpdateTag2($tag: InputTag!) {
    updateTag(tag: $tag) {
      _id
      name
      color

      notes {
        ... on INote {
          type
          _id
          createdAt
          description
          tags {
            _id
            name
            color
          }
        }
        ... on Link {
          url
          domain
          name
        }
      }
    }
  }
`

const TagsPage: React.FC<{}> = () => {
  const dispatch = useDispatch()
  const layout = useSelector<RootState, TagsLayout>(
    (state) => state.userInterface.tagsLayout,
  )
  const tagsQuery = useQuery<TagsQuery>(TAGS_QUERY)

  const [updateTag] = useMutation<UpdateTag2, UpdateTag2Variables>(
    UPDATE_TAG_MUTATION,
  )

  const [draggedTag, setDraggedTag] = useState<TagType>()
  const [droppableColor, setDroppableColor] = useState<string>()

  const selectNextLayout = (): void => {
    const layouts = Object.keys(TagsLayout)
    const nextLayoutIndex = (layouts.indexOf(layout) + 1) % layouts.length
    dispatch(changeTagsLayout(TagsLayout[layouts[nextLayoutIndex]]))
  }

  const renderChaosLayout = (): JSX.Element => {
    return (
      <div className={styles.tagContainer}>
        {tagsQuery.data.tags.map((tag) => (
          <Tag key={tag._id} tag={tag} ref={colorTools} />
        ))}
      </div>
    )
  }

  const renderColorListLayout = (horizontal = false): JSX.Element => {
    const colorTagGroups = {}

    tagsQuery.data.tags.forEach((tag) => {
      if (!colorTagGroups[tag.color]) {
        colorTagGroups[tag.color] = []
      }
      colorTagGroups[tag.color].push(tag)
    })

    const colors = Object.keys(colorTagGroups)
      .map((color) => ({ color, h: ColorCache[color].hsl[0] }))
      .sort((color1, color2) => color2.h - color1.h)
      .map((color) => color.color)

    return (
      <div className={horizontal ? styles.columnsContainer : null}>
        {colors.map((color) => (
          <div
            className={ClassNames(styles.tagContainer, {
              [styles.tagContainerDroppable]: color === droppableColor,
            })}
            onDragOver={(event): void => {
              event.preventDefault()
              setDroppableColor(color)
            }}
            onDragLeave={(event): void => {
              event.preventDefault()
              setDroppableColor(null)
            }}
            onDrop={(): void => {
              const recoloredTag = {
                ...draggedTag,
                color: droppableColor,
              }
              updateTag({ variables: { tag: recoloredTag } })
              setDroppableColor(null)
            }}
            key={color}
          >
            {colorTagGroups[color].map((tag) => (
              <Tag
                key={tag._id}
                tag={tag}
                ref={colorTools}
                draggable
                onDragStart={(event): void => {
                  // eslint-disable-next-line no-param-reassign
                  event.dataTransfer.dropEffect = 'copy'
                  setDraggedTag(tag)
                }}
              />
            ))}
          </div>
        ))}
      </div>
    )
  }

  const renderTags = (): JSX.Element => {
    switch (layout) {
      case TagsLayout.CHAOS_LAYOUT:
        return renderChaosLayout()
      case TagsLayout.COLOR_LIST_LAYOUT:
        return renderColorListLayout()
      case TagsLayout.COLOR_COLUMN_LAYOUT:
        return renderColorListLayout(true)
      default:
        return <i>Unsupported layout.</i>
    }
  }

  let content
  if (!tagsQuery.loading) {
    content = (
      <>
        <Menu>
          <a onClick={selectNextLayout}>{layoutToName(layout)}</a>
        </Menu>
        {renderTags()}
      </>
    )
  } else {
    content = <i>Loading...</i>
  }
  return <div>{content}</div>
}

export default TagsPage
