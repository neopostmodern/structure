import { useMutation, useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import React from 'react';
import { useParams } from 'react-router';
import NotePageMenu from '../components/NotePageMenu';
import Tags from '../components/Tags';
import TextForm from '../components/TextForm';
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

const TextPage: React.FC<{}> = () => {
  const { textId } = useParams();
  const { loading, data } = useQuery<TextQuery>(TEXT_QUERY, {
    fetchPolicy: gracefulNetworkPolicy(),
    variables: { textId },
  });
  const [updateText] = useMutation<
    UpdateTextMutation,
    UpdateTextMutationVariables
  >(UPDATE_TEXT_MUTATION);

  if (loading && !data) {
    return <ComplexLayout loading />;
  }
  if (!data) {
    throw Error('[TextPage] Illegal state: no data');
  }
  const { text } = data;
  return (
    <ComplexLayout
      primaryActions={
        <Tags tags={text.tags} size="medium" noteId={text._id} withShortcuts />
      }
      secondaryActions={<NotePageMenu note={text} />}
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
