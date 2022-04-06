import { useMutation } from '@apollo/client';
import { Button } from '@mui/material';
import gql from 'graphql-tag';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router';
import { push, replace } from 'redux-first-history';
import AddLinkForm from '../components/AddLinkForm';
import {
  AddLinkMutation,
  AddLinkMutationVariables,
} from '../generated/AddLinkMutation';
import { AddTextMutation } from '../generated/AddTextMutation';
import { NotesForList } from '../generated/NotesForList';
import ComplexLayout from './ComplexLayout';
import { BASE_NOTE_FRAGMENT, NOTES_QUERY } from './NotesPage/NotesPage';

const ADD_LINK_MUTATION = gql`
  ${BASE_NOTE_FRAGMENT}
  mutation AddLinkMutation($url: String!) {
    submitLink(url: $url) {
      ...BaseNote
    }
  }
`;
const ADD_TEXT_MUTATION = gql`
  ${BASE_NOTE_FRAGMENT}
  mutation AddTextMutation {
    createText {
      ...BaseNote
    }
  }
`;

const AddLinkPage: React.FC<{}> = () => {
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
    update: (cache, { data: { submitLink } }) => {
      const cacheValue = cache.readQuery<NotesForList>({
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
  const [addText, addTextMutation] = useMutation<AddTextMutation>(
    ADD_TEXT_MUTATION,
    {
      onCompleted: ({ createText }) => {
        dispatch(replace(`/texts/${createText._id}`));
      },
      update: (cache, { data: { createText } }) => {
        const cacheValue = cache.readQuery<NotesForList>({
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
    }
  );
  const urlSearchParams = new URLSearchParams(useLocation().search);

  return (
    <ComplexLayout
      loading={
        (addLinkMutation.loading || addTextMutation.loading) && 'Creating note'
      }
    >
      <AddLinkForm
        defaultValue={urlSearchParams.get('url') || undefined}
        autoSubmit={urlSearchParams.has('autoSubmit')}
        onSubmit={(url): void => {
          addLink({ variables: { url } });
        }}
        onAbort={(): void => {
          dispatch(push('/'));
        }}
      />
      <Button
        variant="outlined"
        onClick={() => {
          addText();
        }}
        style={{ marginTop: '1rem' }}
      >
        Create text-only note
      </Button>
    </ComplexLayout>
  );
};

export default AddLinkPage;
