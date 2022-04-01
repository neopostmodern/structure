import { useMutation, useQuery } from '@apollo/client';
import { Delete as DeleteIcon } from '@mui/icons-material';
import gql from 'graphql-tag';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import { push } from 'redux-first-history';
import ButtonWithConfirmation from '../components/ButtonWithConfirmation';
import { Menu } from '../components/Menu';
import Tags from '../components/Tags';
import TextForm from '../components/TextForm';
import {
  DeleteTextMutation,
  DeleteTextMutationVariables,
} from '../generated/DeleteTextMutation';
import { NotesForList } from '../generated/NotesForList';
import { TextQuery } from '../generated/TextQuery';
import {
  UpdateTextMutation,
  UpdateTextMutationVariables,
} from '../generated/UpdateTextMutation';
import gracefulNetworkPolicy from '../utils/gracefulNetworkPolicy';
import ComplexLayout from './ComplexLayout';
import { NOTES_QUERY } from './NotesPage/NotesPage';

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

  const [deleteText, deleteTextMutation] = useMutation<
    DeleteTextMutation,
    DeleteTextMutationVariables
  >(DELETE_TEXT_MUTATION, {
    onCompleted: () => {
      dispatch(push('/'));
    },
    update(cache, { data: { deleteText: deleteTextData } }) {
      const { notes } = cache.readQuery<NotesForList>({ query: NOTES_QUERY });
      cache.writeQuery({
        query: NOTES_QUERY,
        data: { notes: notes.filter(({ _id }) => _id !== deleteTextData._id) },
      });
    },
  });

  const handleDeleteText = () => {
    deleteText({
      variables: { textId: data.text._id },
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
          <ButtonWithConfirmation
            startIcon={<DeleteIcon />}
            size="huge"
            type="button"
            onClick={handleDeleteText}
            loading={deleteTextMutation.loading}
            confirmationQuestion={`Are you sure you want to delete the note "${text.name}"?`}
            confirmationButtonLabel="Delete"
          >
            Delete note
          </ButtonWithConfirmation>
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
