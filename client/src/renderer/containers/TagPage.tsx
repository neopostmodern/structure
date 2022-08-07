import { useMutation, useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import React, { useCallback } from 'react';
import { useParams } from 'react-router';
import FatalApolloError from '../components/FatalApolloError';
import NetworkOperationsIndicator from '../components/NetworkOperationsIndicator';
import NotesList from '../components/NotesList';
import TagForm from '../components/TagForm';
import {
  TagWithNotesQuery,
  TagWithNotesQueryVariables,
} from '../generated/TagWithNotesQuery';
import {
  UpdateTagMutation,
  UpdateTagMutationVariables,
} from '../generated/UpdateTagMutation';
import gracefulNetworkPolicy from '../utils/gracefulNetworkPolicy';
import useDataState, { DataState } from '../utils/useDataState';
import ComplexLayout from './ComplexLayout';

const TAG_QUERY = gql`
  query TagWithNotesQuery($tagId: ID!) {
    tag(tagId: $tagId) {
      _id
      updatedAt
      name
      color

      notes {
        ... on INote {
          type
          _id
          name
          createdAt
          archivedAt
          description
          tags {
            _id
            name
            color
          }
        }
        ... on Link {
          url
          domain
        }
      }
    }
  }
`;
const UPDATE_TAG_MUTATION = gql`
  mutation UpdateTagMutation($tag: InputTag!) {
    updateTag(tag: $tag) {
      _id
      updatedAt
      name
      color

      notes {
        ... on INote {
          type
          _id
          name
          createdAt
          archivedAt
          description
          tags {
            _id
            name
            color
          }
        }
        ... on Link {
          url
          domain
        }
      }
    }
  }
`;

const TagPage: React.FC<{}> = () => {
  const { tagId } = useParams();

  const tagQuery = useDataState(
    useQuery<TagWithNotesQuery, TagWithNotesQueryVariables>(TAG_QUERY, {
      variables: { tagId },
      fetchPolicy: gracefulNetworkPolicy(),
    })
  );
  const [updateTag, updateTagMutation] = useMutation<
    UpdateTagMutation,
    UpdateTagMutationVariables
  >(UPDATE_TAG_MUTATION);
  const handleSubmit = useCallback(
    (updatedTag): void => {
      updateTag({
        variables: { tag: updatedTag },
      }).catch((error) => {
        console.error('[TagPage.updateTag]', error);
      });
    },
    [updateTag]
  );

  if (tagQuery.state === DataState.LOADING) {
    return <ComplexLayout loading />;
  }
  if (tagQuery.state === DataState.ERROR) {
    return (
      <ComplexLayout>
        <FatalApolloError query={tagQuery} />
      </ComplexLayout>
    );
  }

  return (
    <ComplexLayout>
      <NetworkOperationsIndicator
        query={tagQuery}
        mutation={updateTagMutation}
      />
      <TagForm tag={tagQuery.data.tag} onSubmit={handleSubmit} />

      <NotesList notes={tagQuery.data.tag.notes} />
    </ComplexLayout>
  );
};

export default TagPage;
