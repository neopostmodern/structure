import { gql, graphql } from 'react-apollo';

const ADD_TAG_MUTATION = gql`
  mutation addTagByNameToNote($noteId: ID!, $name: String!){
    addTagByNameToNote(noteId: $noteId, name: $name) {
      _id
      tags {
        _id
        name
        color
      }
    }
  }
`;
const REMOVE_TAG_MUTATION = gql`
  mutation removeTagByIdFromNote($noteId: ID!, $tagId: ID!){
    removeTagByIdFromNote(noteId: $noteId, tagId: $tagId) {
      _id
      tags {
        _id
        name
        color
      }
    }
  }
`;

export const withAddTagMutation = graphql(ADD_TAG_MUTATION, {
  props: ({ mutate }) => ({
    addTagByNameToNote: (noteId, name) => mutate({ variables: { noteId, name } })
  })
});
export const withRemoveTagMutation = graphql(REMOVE_TAG_MUTATION, {
  props: ({ mutate }) => ({
    removeTagByIdFromNote: (noteId, tagId) => mutate({ variables: { noteId, tagId } })
  })
});
