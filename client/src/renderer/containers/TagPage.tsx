import { useMutation, useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import React from 'react';
import { useParams } from 'react-router';
import styled from 'styled-components';
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

const TagPageContainer = styled.div`
  margin-top: 5rem;
`;

const TagPage: React.FC<{}> = () => {
  const { tagId } = useParams();

  const tagQuery = useQuery<TagWithNotesQuery, TagWithNotesQueryVariables>(
    TAG_QUERY,
    {
      variables: { tagId },
    }
  );
  const [updateTag] = useMutation<
    UpdateTagMutation,
    UpdateTagMutationVariables
  >(UPDATE_TAG_MUTATION);

  if (tagQuery.loading) {
    return <i>Loading...</i>;
  }

  const { tag } = tagQuery.data;

  return (
    <TagPageContainer>
      <TagForm
        tag={tag}
        onSubmit={(updatedTag): void => {
          updateTag({
            variables: { tag: updatedTag },
          });
        }}
      />

      <NotesList notes={tag.notes} />
    </TagPageContainer>
  );
};

export default TagPage;
