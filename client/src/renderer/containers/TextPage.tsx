import { useMutation, useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { FC, useCallback } from 'react';
import { useParams } from 'react-router';
import FatalApolloError from '../components/FatalApolloError';
import NetworkOperationsIndicator from '../components/NetworkOperationsIndicator';
import NotePageMenu from '../components/NotePageMenu';
import Tags from '../components/Tags';
import TextForm, { TextInForm } from '../components/TextForm';
import {
  TextQuery,
  UpdateTextMutation,
  UpdateTextMutationVariables,
} from '../generated/graphql';
import gracefulNetworkPolicy from '../utils/gracefulNetworkPolicy';
import { useIsDesktopLayout } from '../utils/mediaQueryHooks';
import {
  BASE_TAG_FRAGMENT,
  BASE_USER_FRAGMENT,
} from '../utils/sharedQueriesAndFragments';
import useDataState, { DataState } from '../utils/useDataState';
import ComplexLayout from './ComplexLayout';

const TEXT_QUERY = gql`
  query Text($textId: ID) {
    text(textId: $textId) {
      _id
      createdAt
      updatedAt
      changedAt
      archivedAt
      user {
        ...BaseUser
      }
      name
      description
      tags {
        ...BaseTag
      }
    }
  }
  ${BASE_USER_FRAGMENT}
  ${BASE_TAG_FRAGMENT}
`;

const UPDATE_TEXT_MUTATION = gql`
  mutation UpdateText($text: InputText!) {
    updateText(text: $text) {
      _id
      createdAt
      updatedAt
      changedAt
      archivedAt
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

const TextPage: FC = () => {
  const isDesktopLayout = useIsDesktopLayout();
  const { textId } = useParams();
  const textQuery = useDataState(
    useQuery<TextQuery>(TEXT_QUERY, {
      fetchPolicy: gracefulNetworkPolicy(),
      variables: { textId },
    })
  );
  const [updateText, updateTextMutation] = useMutation<
    UpdateTextMutation,
    UpdateTextMutationVariables
  >(UPDATE_TEXT_MUTATION);
  const handleSubmit = useCallback(
    (updatedText: TextInForm) => {
      updateText({ variables: { text: updatedText } }).catch((error) => {
        console.error('[TextPage.updateText]', error);
      });
    },
    [updateText]
  );

  if (textQuery.state === DataState.LOADING) {
    return <ComplexLayout loading />;
  }
  if (textQuery.state === DataState.ERROR) {
    return (
      <ComplexLayout>
        <FatalApolloError query={textQuery} />
      </ComplexLayout>
    );
  }

  const { text } = textQuery.data;
  const tagsComponent = (
    <Tags tags={text.tags} size="medium" noteId={text._id} withShortcuts />
  );

  return (
    <ComplexLayout
      primaryActions={isDesktopLayout && tagsComponent}
      secondaryActions={<NotePageMenu note={text} />}
    >
      <NetworkOperationsIndicator
        query={textQuery}
        mutation={updateTextMutation}
      />
      <TextForm
        text={text}
        onSubmit={handleSubmit}
        tagsComponent={!isDesktopLayout && tagsComponent}
      />
    </ComplexLayout>
  );
};

export default TextPage;
