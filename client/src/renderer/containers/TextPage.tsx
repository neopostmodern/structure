import { useMutation, useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import React from 'react';
import { useParams } from 'react-router';
import FatalApolloError from '../components/FatalApolloError';
import NotePageMenu from '../components/NotePageMenu';
import Tags from '../components/Tags';
import TextForm from '../components/TextForm';
import { TextQuery } from '../generated/TextQuery';
import {
  UpdateTextMutation,
  UpdateTextMutationVariables,
} from '../generated/UpdateTextMutation';
import gracefulNetworkPolicy from '../utils/gracefulNetworkPolicy';
import { useIsDesktopLayout } from '../utils/mediaQueryHooks';
import useDataState, { DataState } from '../utils/useDataState';
import ComplexLayout from './ComplexLayout';

const TEXT_QUERY = gql`
  query TextQuery($textId: ID) {
    text(textId: $textId) {
      _id
      createdAt
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

const UPDATE_TEXT_MUTATION = gql`
  mutation UpdateTextMutation($text: InputText!) {
    updateText(text: $text) {
      _id
      createdAt
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

const TextPage: React.FC = () => {
  const isDesktopLayout = useIsDesktopLayout();
  const { textId } = useParams();
  const textQuery = useDataState(
    useQuery<TextQuery>(TEXT_QUERY, {
      fetchPolicy: gracefulNetworkPolicy(),
      variables: { textId },
    })
  );
  const [updateText] = useMutation<
    UpdateTextMutation,
    UpdateTextMutationVariables
  >(UPDATE_TEXT_MUTATION);

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
      <TextForm
        text={text}
        onSubmit={(updatedText) =>
          updateText({ variables: { text: updatedText } })
        }
        tagsComponent={!isDesktopLayout && tagsComponent}
      />
    </ComplexLayout>
  );
};

export default TextPage;
