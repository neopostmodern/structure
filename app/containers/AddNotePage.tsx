import React from 'react'
import gql from 'graphql-tag'
import { useHistory } from 'react-router'
import { useMutation } from '@apollo/client'

import AddLinkForm from '../components/AddLinkForm'
import { TextButton } from '../components/CommonStyles'
import { AddTextMutation } from '../generated/AddTextMutation'
import {
  AddLinkMutation,
  AddLinkMutationVariables,
} from '../generated/AddLinkMutation'
import { NotesForList } from '../generated/NotesForList'
import { NOTES_QUERY } from './NotesPage/NotesPage'

const ADD_LINK_FRAGMENT = gql`
  fragment AddLinkFragement on Link {
    _id
    createdAt
    url
    tags {
      _id
      name
      color
    }
  }
`
const ADD_LINK_MUTATION = gql`
  mutation AddLinkMutation($url: String!) {
    submitLink(url: $url) {
      ...AddLinkFragement
    }
  }
  ${ADD_LINK_FRAGMENT}
`
const ADD_TEXT_MUTATION = gql`
  mutation AddTextMutation {
    createText {
      _id
      createdAt
      tags {
        _id
        name
        color
      }
    }
  }
`

const AddLinkPage: React.FC<{}> = () => {
  const history = useHistory()

  const [addLink] = useMutation<AddLinkMutation, AddLinkMutationVariables>(
    ADD_LINK_MUTATION,
    {
      onCompleted: ({ submitLink }) => {
        history.push(`/links/${submitLink._id}`)
      },
      update: (cache, { data: { submitLink } }) => {
        const { notes } = cache.readQuery<NotesForList>({ query: NOTES_QUERY })
        cache.writeQuery({
          query: NOTES_QUERY,
          data: { notes: [...notes, submitLink] },
        })
      },
    },
  )
  const [addText] = useMutation<AddTextMutation>(ADD_TEXT_MUTATION, {
    onCompleted: ({ createText }) => {
      history.push(`/texts/${createText._id}`)
    },
  })

  return (
    <div>
      <AddLinkForm
        onSubmit={(url): void => {
          addLink({ variables: { url } })
        }}
        onAbort={(): void => {
          history.push('/')
        }}
      />
      <TextButton type='button' onClick={addText}>
        Need just text?
      </TextButton>
    </div>
  )
}

export default AddLinkPage
