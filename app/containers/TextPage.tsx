import React from 'react'
import { useHistory, useParams } from 'react-router'
import { useMutation, useQuery } from '@apollo/client'
import gql from 'graphql-tag'

import Tags from '../components/Tags'
import TextForm from '../components/TextForm'
import { TextQuery } from '../generated/TextQuery'
import {
  UpdateTextMutation,
  UpdateTextMutationVariables,
} from '../generated/UpdateTextMutation'
import {
  DeleteTextMutation,
  DeleteTextMutationVariables,
} from '../generated/DeleteTextMutation'
import { InlineButton } from '../components/CommonStyles'

const TEXT_QUERY = gql`
  query TextQuery($textId: ID) {
    text(textId: $textId) {
      _id
      createdAt
      name
      description
      tags {
        _id
        name
        color
      }
    }
  }
`

const UPDATE_TEXT_MUTATION = gql`
  mutation UpdateTextMutation($text: InputText!) {
    updateText(text: $text) {
      _id
      createdAt
      name
      description
      tags {
        _id
        name
        color
      }
    }
  }
`

const DELETE_TEXT_MUTATION = gql`
  mutation DeleteTextMutation($textId: ID!) {
    deleteText(textId: $textId) {
      _id
    }
  }
`

const TextPage: React.FC<{}> = () => {
  const { textId } = useParams()
  const history = useHistory()
  const { loading, data } = useQuery<TextQuery>(TEXT_QUERY, {
    variables: { textId },
  })
  const [updateText] = useMutation<
    UpdateTextMutation,
    UpdateTextMutationVariables
  >(UPDATE_TEXT_MUTATION)

  const [deleteText] = useMutation<
    DeleteTextMutation,
    DeleteTextMutationVariables
  >(DELETE_TEXT_MUTATION)

  const handleDeleteText = () => {
    deleteText({ variables: { textId: data.text._id } }).then((result) => {
      history.push('/')
      return result
    })
  }

  if (loading) {
    return <i>Loading...</i>
  }
  const { text } = data
  return (
    <div style={{ marginTop: 50 }}>
      <TextForm
        text={text}
        onSubmit={(updatedText) =>
          updateText({ variables: { text: updatedText } })
        }
      />
      <div style={{ marginTop: 30 }}>
        <Tags tags={text.tags} noteId={text._id} withShortcuts />
      </div>
      <div style={{ display: 'flex', marginTop: 50 }}>
        <InlineButton
          type='button'
          style={{ marginLeft: 'auto' }}
          onClick={handleDeleteText}
        >
          Delete
        </InlineButton>
      </div>
    </div>
  )
}

export default TextPage
