import { useMutation, useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { FC, useCallback } from 'react';
import { useParams } from 'react-router';
import FatalApolloError from '../components/FatalApolloError';
import NetworkOperationsIndicator from '../components/NetworkOperationsIndicator';
import NotesList from '../components/NotesList';
import TagForm, { TagInForm } from '../components/TagForm';
import {
  TagWithNotesQuery,
  TagWithNotesQueryVariables,
  UpdateTagMutation,
  UpdateTagMutationVariables,
} from '../generated/graphql';
import gracefulNetworkPolicy from '../utils/gracefulNetworkPolicy';
import { BASE_TAG_FRAGMENT } from '../utils/sharedQueriesAndFragments';
import useDataState, { DataState } from '../utils/useDataState';
import ComplexLayout from './ComplexLayout';

const TAG_QUERY = gql`
  query TagWithNotes($tagId: ID!) {
    tag(tagId: $tagId) {
      ...BaseTag

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

  ${BASE_TAG_FRAGMENT}
`;
const UPDATE_TAG_MUTATION = gql`
  mutation UpdateTag($tag: InputTag!) {
    updateTag(tag: $tag) {
      ...BaseTag

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

  ${BASE_TAG_FRAGMENT}
`;

const TagPage: FC = () => {
  const { tagId } = useParams();

  if (!tagId) {
    throw Error('[TagPage] No tagId found in URL parameters.');
  }

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
    (updatedTag: TagInForm): void => {
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
