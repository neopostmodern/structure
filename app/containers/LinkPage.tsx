import React from 'react'
import { useHistory, useParams } from 'react-router'
import gql from 'graphql-tag'
import { useMutation, useQuery } from '@apollo/client'
import styled from 'styled-components'

import Tags from '../components/Tags'
import LinkForm from '../components/LinkForm'

import { InlineButton } from '../components/CommonStyles'
import { LinkQuery, LinkQueryVariables } from '../generated/LinkQuery'
import {
  DeleteLinkMutation,
  DeleteLinkMutationVariables,
} from '../generated/DeleteLinkMutation'
import {
  UpdateLinkMutation,
  UpdateLinkMutationVariables,
} from '../generated/UpdateLinkMutation'
import { breakPointMobile } from '../styles/constants'

const LINK_QUERY = gql`
  query LinkQuery($linkId: ID) {
    link(linkId: $linkId) {
      _id
      createdAt
      url
      name
      description
      domain
      tags {
        _id
        name
        color
      }
    }
  }
`

const UPDATE_LINK_MUTATION = gql`
  mutation UpdateLinkMutation($link: InputLink!) {
    updateLink(link: $link) {
      _id
      createdAt
      url
      domain
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
const DELETE_LINK_MUTATION = gql`
  mutation DeleteLinkMutation($linkId: ID!) {
    deleteLink(linkId: $linkId) {
      _id
    }
  }
`

const LinkPageContainer = styled.div`
  margin-top: 1rem;

  @media (min-width: ${breakPointMobile}) {
    margin-top: 3rem;
  }
`

const LinkPage: React.FC<{}> = () => {
  const { linkId } = useParams()
  const history = useHistory()
  const linkQuery = useQuery<LinkQuery, LinkQueryVariables>(LINK_QUERY, {
    fetchPolicy: 'cache-and-network',
    variables: { linkId },
  })

  const [updateLink] = useMutation<
    UpdateLinkMutation,
    UpdateLinkMutationVariables
  >(UPDATE_LINK_MUTATION)

  const [deleteLink] = useMutation<
    DeleteLinkMutation,
    DeleteLinkMutationVariables
  >(DELETE_LINK_MUTATION, {
    onCompleted: () => {
      history.push('/')
    },
  })

  if (linkQuery.loading) {
    return <i>Loading...</i>
  }

  const { link } = linkQuery.data

  return (
    <LinkPageContainer>
      <LinkForm
        link={link}
        onSubmit={(updatedLink) => {
          console.log(updatedLink)
          updateLink({ variables: { link: updatedLink } })
        }}
      />
      <div style={{ marginTop: 30 }}>
        <Tags tags={link.tags} withShortcuts noteId={link._id} />
      </div>
      <div style={{ display: 'flex', marginTop: 50 }}>
        <InlineButton
          type='button'
          style={{ marginLeft: 'auto' }}
          onClick={(): void => {
            deleteLink({ variables: { linkId: link._id } })
          }}
        >
          Delete
        </InlineButton>
      </div>
    </LinkPageContainer>
  )
}

export default LinkPage
