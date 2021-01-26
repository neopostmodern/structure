import React from 'react'
import gql from 'graphql-tag'
import { useHistory, useLocation } from 'react-router'
import { useMutation } from '@apollo/client'

import AddLinkForm from '../components/AddLinkForm'
import { TextButton } from '../components/CommonStyles'
import { AddTextMutation } from '../generated/AddTextMutation'
import {
  AddLinkMutation,
  AddLinkMutationVariables,
} from '../generated/AddLinkMutation'
import { NotesForList } from '../generated/NotesForList'
import { NOTE_IMPLICIT_FRAGMENT, NOTES_QUERY } from './NotesPage/NotesPage'

const ADD_LINK_MUTATION = gql`
  mutation AddLinkMutation($url: String!) {
    submitLink(url: $url) {
      ${NOTE_IMPLICIT_FRAGMENT}
    }
  }
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

const AddLinkPage: React.FC<never> = () => {
  const history = useHistory()

  const [addLink] = useMutation<AddLinkMutation, AddLinkMutationVariables>(
    ADD_LINK_MUTATION,
    {
      onCompleted: ({ submitLink }) => {
        history.push(`/links/${submitLink._id}`)
      },
      onError: (error) => {
        console.error(error)
      },
      update: (cache, { data: { submitLink } }) => {
        const cacheValue = cache.readQuery<NotesForList>({ query: NOTES_QUERY })

        if (!cacheValue) {
          return
        }

        const { notes } = cacheValue
        cache.writeQuery({
          query: NOTES_QUERY,
          data: { notes: [...notes, { ...submitLink, type: 'LINK' }] },
        })
      },
    },
  )
  const [addText] = useMutation<AddTextMutation>(ADD_TEXT_MUTATION, {
    onCompleted: ({ createText }) => {
      history.push(`/texts/${createText._id}`)
    },
  })
  const urlSearchParams = new URLSearchParams(useLocation().search)

  return (
    <div>
      <AddLinkForm
        defaultValue={urlSearchParams.get('url')}
        autoSubmit={urlSearchParams.has('autoSubmit')}
        onSubmit={(url): void => addLink({ variables: { url } })}
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
