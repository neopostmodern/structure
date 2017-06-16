// @flow

import React from 'react';
import { gql, graphql, compose } from 'react-apollo';
import AddLink from '../components/AddLink';

import buttonStyles from '../styles/button.scss';

class AddLinkPage extends React.Component {
  props: {
    addLink: (url: string) => { _id: string },
    addText: () => { _id: string },

    history: {
      push: (path: string) => void
    }
  }

  handleSubmitLink = ({ url }) => {
    // todo: handle errors
    this.props.addLink(url)
      .then(({ _id }) => this.props.history.push(`/links/${_id}`));
  };
  handleCreateText = () => {
    // todo: handle errors
    this.props.addText()
      .then(({ _id }) => this.props.history.push(`/texts/${_id}`));
  };

  render() {
    return (
      <div>
        <AddLink onSubmit={this.handleSubmitLink} />
        <button className={buttonStyles.textButton} onClick={this.handleCreateText}>
          Need just text?
        </button>
      </div>
    );
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
const ADD_TEXT_MUTATION = gql`
  mutation createText {
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
`;

const withAddLinkMutation = graphql(ADD_LINK_MUTATION, {
  props: ({ mutate }) => ({
    addLink: (url) => mutate({ variables: { url } })
      .then(({ data }) => data.submitLink)
  })
});
const withAddTextMutation = graphql(ADD_TEXT_MUTATION, {
  props: ({ mutate }) => ({
    addText: () => mutate({})
      .then(({ data }) => data.createText)
  })
});

export default compose(withAddLinkMutation, withAddTextMutation)(AddLinkPage);
