import { useMutation, useQuery } from '@apollo/client';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { Button } from '@mui/material';
import gql from 'graphql-tag';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import { push } from 'redux-first-history';
import { Menu } from '../components/Menu';
import Tags from '../components/Tags';
import TextForm from '../components/TextForm';
import {
  DeleteTextMutation,
  DeleteTextMutationVariables,
} from '../generated/DeleteTextMutation';
import { TextQuery } from '../generated/TextQuery';
import {
  UpdateTextMutation,
  UpdateTextMutationVariables,
} from '../generated/UpdateTextMutation';
import gracefulNetworkPolicy from '../utils/gracefulNetworkPolicy';
import ComplexLayout from './ComplexLayout';

const TEXT_QUERY = gql`
  query TextQuery($textId: ID) {
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
  mutation UpdateTextMutation($text: InputText!) {
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
  mutation DeleteTextMutation($textId: ID!) {
    deleteText(textId: $textId) {
      _id
    }
  }
`;

const TextPage: React.FC<{}> = () => {
  const { textId } = useParams();
  const dispatch = useDispatch();
  const { loading, data } = useQuery<TextQuery>(TEXT_QUERY, {
    fetchPolicy: gracefulNetworkPolicy(),
    variables: { textId },
  });
  const [updateText] = useMutation<
    UpdateTextMutation,
    UpdateTextMutationVariables
  >(UPDATE_TEXT_MUTATION);

  const [deleteText] = useMutation<
    DeleteTextMutation,
    DeleteTextMutationVariables
  >(DELETE_TEXT_MUTATION);

  const handleDeleteText = () => {
    deleteText({ variables: { textId: data.text._id } }).then((result) => {
      dispatch(push('/'));
      return result;
    });
  };

  if (loading && !data) {
    return <ComplexLayout loading />;
  }
  const { text } = data;
  return (
    <ComplexLayout
      primaryActions={
        <Tags tags={text.tags} size="medium" noteId={text._id} withShortcuts />
      }
      secondaryActions={
        <Menu>
          <Button
            startIcon={<DeleteIcon />}
            size="huge"
            type="button"
            onClick={handleDeleteText}
          >
            Delete note
          </Button>
        </Menu>
      }
    >
      <TextForm
        text={text}
        onSubmit={(updatedText) =>
          updateText({ variables: { text: updatedText } })
        }
      />
    </ComplexLayout>
  );
};

export default TextPage;
