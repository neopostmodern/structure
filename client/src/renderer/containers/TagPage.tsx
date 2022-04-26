import { useMutation, useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import React from 'react';
import { useParams } from 'react-router';
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

  return (
    <ComplexLayout loading={tagQuery.state === DataState.LOADING}>
      <NetworkOperationsIndicator
        query={tagQuery}
        mutation={updateTagMutation}
      />
      {tagQuery.state === DataState.DATA && (
        <>
          <TagForm
            tag={tagQuery.data.tag}
            onSubmit={(updatedTag): void => {
              updateTag({
                variables: { tag: updatedTag },
              });
            }}
          />

          <NotesList notes={tagQuery.data.tag.notes} />
        </>
      )}
    </ComplexLayout>
  );
};

export default TagPage;
