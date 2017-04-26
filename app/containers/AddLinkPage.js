import React from 'react';
import { gql, graphql } from 'react-apollo';
import AddLink from '../components/AddLink';

class AddLinkPage extends React.Component {
  handleSubmit = ({ url }) => {
    console.log("ARGUMENTS", arguments);
    this.props.addLink(url)
      .then(({ _id }) => this.props.history.push(`/links/${_id}`));
  };

  render() {
    return <AddLink onSubmit={this.handleSubmit} />;
  }
}

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
    addLink: (url) => mutate({ variables: { url } })
      .then(({ data }) => data.submitLink)
  })
});

export default withAddLinkMutation(AddLinkPage);
