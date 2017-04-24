import { gql, graphql } from 'react-apollo';
import AddLink from '../components/AddLink';

const ADD_LINK_MUTATION = gql`
  mutation submitLink($url: String!){
    submitLink(url: $url) {
      _id
      createdAt
      url
      tags {
        _id
        name
        color
      }
    }
  }
`;

const withAddLinkMutation = graphql(ADD_LINK_MUTATION, {
  props: ({ mutate }) => ({
    addLink: (url) => mutate({ variables: { url } }).then(({ data }) => data.submitLink)
  })
});

export default withAddLinkMutation(AddLink);
