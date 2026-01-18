import { gql } from 'graphql-tag'

export const PROFILE_QUERY = gql`
  query Profile($currentVersion: String!) {
    currentUser {
      _id
      name
    }
    versions(currentVersion: $currentVersion) {
      current
      minimum
    }
  }
`

export const BASE_USER_FRAGMENT = gql`
  fragment BaseUser on User {
    _id
    name
  }
`

export const BASE_TAG_FRAGMENT = gql`
  fragment BaseTag on Tag {
    _id
    createdAt
    updatedAt
    changedAt

    name
    color

    user {
      _id
      name
    }

    permissions {
      user {
        _id
        name
      }
      tag {
        read
        write
        use
        share
      }
      notes {
        read
        write
      }
    }
  }
`

export const BASE_NOTE_FRAGMENT = gql`
  fragment BaseNote on Note {
    _id
    url
    domain
    name
    createdAt
    updatedAt
    changedAt
    archivedAt
    deletedAt

    description
    tags {
      _id
    }
    user {
      ...BaseUser
    }
  }
  ${BASE_USER_FRAGMENT}
`
export const ADD_NOTE_MUTATION = gql`
  ${BASE_NOTE_FRAGMENT}
  mutation AddNote($url: String, $title: String, $description: String) {
    createNote(url: $url, title: $title, description: $description) {
      ...BaseNote
    }
  }
`

export const ADD_TAG_BY_NAME_TO_NOTE_MUTATION = gql`
  mutation AddTagByNameToNote($noteId: ID!, $tagName: String!) {
    addTagByNameToNote(noteId: $noteId, name: $tagName) {
      _id
      updatedAt
      tags {
        ...BaseTag
        noteCount
        notes {
          _id
        }
      }
    }
  }
  ${BASE_TAG_FRAGMENT}
`
