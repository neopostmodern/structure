import { useMutation, useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { FC, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import { goBack } from 'redux-first-history';
import DeleteTagTrigger from '../components/DeleteTagTrigger';
import EntityMetadata from '../components/EntityMetadata';
import ErrorSnackbar from '../components/ErrorSnackbar';
import FatalApolloError from '../components/FatalApolloError';
import { Menu } from '../components/Menu';
import NetworkOperationsIndicator from '../components/NetworkOperationsIndicator';
import NotesList from '../components/NotesList';
import TagForm, { TagInForm } from '../components/TagForm';
import {
  DeleteTagMutation,
  DeleteTagMutationVariables,
  TagsQuery,
  TagWithNotesQuery,
  TagWithNotesQueryVariables,
  UpdateTagMutation,
  UpdateTagMutationVariables,
} from '../generated/graphql';
import gracefulNetworkPolicy from '../utils/gracefulNetworkPolicy';
import {
  BASE_NOTE_FRAGMENT,
  BASE_TAG_FRAGMENT,
  BASE_USER_FRAGMENT,
} from '../utils/sharedQueriesAndFragments';
import useDataState, { DataState } from '../utils/useDataState';
import ComplexLayout from './ComplexLayout';
import { TAGS_QUERY } from './TagsPage';

// todo: the query is very heavy, it should leverage caching, at least on the inner tag query
const TAG_QUERY = gql`
  query TagWithNotes($tagId: ID!) {
    tag(tagId: $tagId) {
      ...BaseTag

      user {
        ...BaseUser
      }

      notes {
        ...BaseNote
        ... on INote {
          tags {
            ...BaseTag
          }
        }
      }
    }
  }

  ${BASE_TAG_FRAGMENT}
  ${BASE_NOTE_FRAGMENT}
  ${BASE_USER_FRAGMENT}
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
const DELETE_TAG_MUTATION = gql`
  mutation DeleteTag($tagId: ID!) {
    permanentlyDeleteTag(tagId: $tagId) {
      _id
      notes {
        ... on INote {
          _id
          tags {
            _id
          }
        }
      }
    }
  }
`;

const TagPage: FC = () => {
  const dispatch = useDispatch();
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
  const [deleteTag, deleteTagMutation] = useMutation<
    DeleteTagMutation,
    DeleteTagMutationVariables
  >(DELETE_TAG_MUTATION);

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
  const handleDeleteTag = useCallback((): void => {
    deleteTag({
      variables: { tagId },
      onCompleted: () => {
        dispatch(goBack());
      },
      update: (cache, { data }) => {
        if (!data) {
          return;
        }
        const { permanentlyDeleteTag } = data;

        const cacheValue = cache.readQuery<TagsQuery>({
          query: TAGS_QUERY,
        });

        if (!cacheValue) {
          return;
        }

        cache.writeQuery({
          query: TAGS_QUERY,
          data: {
            tags: cacheValue.tags.filter(
              (tag) => tag._id !== permanentlyDeleteTag._id
            ),
          },
        });
      },
    }).catch((error) => {
      console.error('[TagPage.deleteTag]', error);
    });
  }, [tagId]);

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
    <ComplexLayout
      secondaryActions={
        <Menu>
          <EntityMetadata entity={tagQuery.data.tag} />
          <DeleteTagTrigger
            tag={tagQuery.data.tag}
            loading={deleteTagMutation.loading}
            deleteNote={handleDeleteTag}
          />
        </Menu>
      }
    >
      <ErrorSnackbar
        error={deleteTagMutation.error}
        actionDescription="delete tag"
        retry={handleDeleteTag}
      />

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
