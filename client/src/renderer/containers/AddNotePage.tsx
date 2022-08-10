import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { FC, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router';
import { push, replace } from 'redux-first-history';
import AddNoteForm from '../components/AddNoteForm';
import {
  AddLinkMutation,
  AddLinkMutationVariables,
  AddTextMutation,
  AddTextMutationVariables,
  NotesForListQuery,
} from '../generated/graphql';
import { BASE_NOTE_FRAGMENT } from '../utils/sharedQueriesAndFragments';
import ComplexLayout from './ComplexLayout';
import { NOTES_QUERY } from './NotesPage/NotesPage';

const ADD_LINK_MUTATION = gql`
  ${BASE_NOTE_FRAGMENT}
  mutation AddLink($url: String!) {
    submitLink(url: $url) {
      ...BaseNote
    }
  }
`;
const ADD_TEXT_MUTATION = gql`
  ${BASE_NOTE_FRAGMENT}
  mutation AddText($title: String) {
    createText(title: $title) {
      ...BaseNote
    }
  }
`;

const AddLinkPage: FC = () => {
  const dispatch = useDispatch();

  const [addLink, addLinkMutation] = useMutation<
    AddLinkMutation,
    AddLinkMutationVariables
  >(ADD_LINK_MUTATION, {
    onCompleted: ({ submitLink }) => {
      dispatch(replace(`/links/${submitLink._id}`));
    },
    onError: (error) => {
      console.error(error);
    },
    update: (cache, { data }) => {
      if (!data) {
        return;
      }
      const { submitLink } = data;

      const cacheValue = cache.readQuery<NotesForListQuery>({
        query: NOTES_QUERY,
      });

      if (!cacheValue) {
        return;
      }

      const { notes } = cacheValue;
      cache.writeQuery({
        query: NOTES_QUERY,
        data: { notes: [...notes, { ...submitLink, type: 'LINK' }] },
      });
    },
  });
  const handleSubmitUrl = useCallback(
    (url: string): void => {
      addLink({ variables: { url } });
    },
    [addLink]
  );

  const [addText, addTextMutation] = useMutation<
    AddTextMutation,
    AddTextMutationVariables
  >(ADD_TEXT_MUTATION, {
    onCompleted: ({ createText }) => {
      dispatch(replace(`/texts/${createText._id}`));
    },
    update: (cache, { data }) => {
      if (!data) {
        return;
      }
      const { createText } = data;

      const cacheValue = cache.readQuery<NotesForListQuery>({
        query: NOTES_QUERY,
      });

      if (!cacheValue) {
        return;
      }

      const { notes } = cacheValue;
      cache.writeQuery({
        query: NOTES_QUERY,
        data: { notes: [...notes, { ...createText, type: 'TEXT' }] },
      });
    },
  });
  const handleSubmitText = useCallback(
    (title?: string) => {
      addText({ variables: { title } });
    },
    [addText]
  );

  const handleAbort = useCallback((): void => {
    dispatch(push('/'));
  }, [dispatch, push]);

  const urlSearchParams = new URLSearchParams(useLocation().search);

  return (
    <ComplexLayout
      loading={
        (addLinkMutation.loading || addTextMutation.loading) && 'Creating note'
      }
    >
      <AddNoteForm
        defaultValue={urlSearchParams.get('url') || undefined}
        autoSubmit={urlSearchParams.has('autoSubmit')}
        onSubmitUrl={handleSubmitUrl}
        onSubmitText={handleSubmitText}
        onAbort={handleAbort}
      />
    </ComplexLayout>
  );
};

export default AddLinkPage;
