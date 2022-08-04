import { useMutation, useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import React, { useCallback } from 'react';
import { useParams } from 'react-router';
import FatalApolloError from '../components/FatalApolloError';
import LinkForm from '../components/LinkForm';
import NetworkOperationsIndicator from '../components/NetworkOperationsIndicator';
import NotePageMenu from '../components/NotePageMenu';
import Tags from '../components/Tags';
import { LinkQuery, LinkQueryVariables } from '../generated/LinkQuery';
import {
  UpdateLinkMutation,
  UpdateLinkMutationVariables,
} from '../generated/UpdateLinkMutation';
import gracefulNetworkPolicy from '../utils/gracefulNetworkPolicy';
import { useIsDesktopLayout } from '../utils/mediaQueryHooks';
import useDataState, { DataState } from '../utils/useDataState';
import ComplexLayout from './ComplexLayout';

const LINK_QUERY = gql`
  query LinkQuery($linkId: ID) {
    link(linkId: $linkId) {
      _id
      createdAt
      updatedAt
      archivedAt
      url
      name
      description
      domain
      tags {
        _id
        name
        color
      }
    }
  }
`;

const UPDATE_LINK_MUTATION = gql`
  mutation UpdateLinkMutation($link: InputLink!) {
    updateLink(link: $link) {
      _id
      createdAt
      updatedAt
      url
      domain
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

const LinkPage: React.FC = () => {
  const isDesktopLayout = useIsDesktopLayout();

  const { linkId } = useParams();
  const linkQuery = useDataState(
    useQuery<LinkQuery, LinkQueryVariables>(LINK_QUERY, {
      fetchPolicy: gracefulNetworkPolicy(),
      variables: { linkId },
    })
  );

  const [updateLink, updateLinkMutation] = useMutation<
    UpdateLinkMutation,
    UpdateLinkMutationVariables
  >(UPDATE_LINK_MUTATION);
  const handleSubmit = useCallback(
    (updatedLink): void => {
      updateLink({ variables: { link: updatedLink } }).catch((error) => {
        console.error('[LinkPage.updateLink]', error);
      });
    },
    [updateLink]
  );

  if (linkQuery.state === DataState.LOADING) {
    return <ComplexLayout loading />;
  }
  if (linkQuery.state === DataState.ERROR) {
    return (
      <ComplexLayout>
        <FatalApolloError query={linkQuery} />
      </ComplexLayout>
    );
  }

  const { link } = linkQuery.data;
  const tagsComponent = (
    <Tags tags={link.tags} size="medium" withShortcuts noteId={link._id} />
  );

  return (
    <ComplexLayout
      primaryActions={isDesktopLayout && tagsComponent}
      secondaryActions={<NotePageMenu note={link} />}
    >
      <NetworkOperationsIndicator
        query={linkQuery}
        mutation={updateLinkMutation}
      />
      <LinkForm
        link={link}
        onSubmit={handleSubmit}
        tagsComponent={!isDesktopLayout && tagsComponent}
      />
    </ComplexLayout>
  );
};

export default LinkPage;
