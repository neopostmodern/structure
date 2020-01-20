// @flow
import React from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import { withAddTagMutation, withRemoveTagMutation } from '../wrappers/tags';
import Tags from '../components/Tags';
import TextForm from '../components/TextForm';


export class TextPage extends React.Component {
  deleteText = () => {
    this.props.deleteText(this.props.text._id)
      .then((result) => {
        this.props.history.push('/');
        return result;
      });
  };

  render() {
    const { loading, text } = this.props;
    if (loading) {
      return <i>Loading...</i>;
    }
    return (
      <div style={{ marginTop: 50 }}>
        <TextForm
          form={text._id}
          initialValues={text}
          onSubmit={this.props.updateText}
          onChange={this.props.updateText}
        />
        <div style={{ marginTop: 30 }}>
          <Tags
            tags={text.tags}
            withShortcuts
            onAddTag={this.props.addTagByNameToNote.bind(this, text._id)}
            onRemoveTag={this.props.removeTagByIdFromNote.bind(null, text._id)}
          />
        </div>
        <div style={{ display: 'flex', marginTop: 50 }}>
          <button type="button" style={{ marginLeft: 'auto' }} onClick={this.deleteText}>
          Delete
          </button>
        </div>
      </div>
    );
  }
}

const TEXT_QUERY = gql`
  query Text($textId: ID) {
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
`;

const UPDATE_TEXT_MUTATION = gql`
  mutation updateText($text: InputText!){
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
`;
const DELETE_TEXT_MUTATION = gql`
  mutation deleteText($textId: ID!){
    deleteText(textId: $textId) {
      _id
    }
  }
`;

const withData = graphql(TEXT_QUERY, {
  options: ({ match }) => ({
    fetchPolicy: 'cache-and-network',
    variables: { textId: match.params.textId }
  }),
  props: ({ data: { loading, text, refetch } }) => ({
    loading,
    text,
    refetch
  }),
});
const withUpdateText = graphql(UPDATE_TEXT_MUTATION, {
  props: ({ mutate }) => ({
    updateText: ({ _id, name, description }) => mutate({ variables: { text: { _id, name, description } } })
  })
});
const withDeleteText = graphql(DELETE_TEXT_MUTATION, {
  props: ({ mutate }) => ({
    deleteText: (_id) => mutate({ variables: { textId: _id } })
  })
});
export default compose(
  withData,
  withAddTagMutation,
  withRemoveTagMutation,
  withUpdateText,
  withDeleteText
)(TextPage);
