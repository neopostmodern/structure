import { gql, graphql } from 'react-apollo';

const ADD_TAG_MUTATION = gql`
  mutation addTagByNameToLink($linkId: ID!, $name: String!){
    addTagByNameToLink(linkId: $linkId, name: $name) {
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
  mutation removeTagByIdFromLink($linkId: ID!, $tagId: ID!){
    removeTagByIdFromLink(linkId: $linkId, tagId: $tagId) {
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
    addTagByNameToLink: (linkId, name) => mutate({ variables: { linkId, name } })
  })
});
export const withRemoveTagMutation = graphql(REMOVE_TAG_MUTATION, {
  props: ({ mutate }) => ({
    removeTagByIdFromLink: (linkId, tagId) => mutate({ variables: { linkId, tagId } })
  })
});
