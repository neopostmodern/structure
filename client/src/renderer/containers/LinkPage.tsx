import { useMutation, useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import React from 'react';
import { useParams } from 'react-router';
import LinkForm from '../components/LinkForm';
import NotePageMenu from '../components/NotePageMenu';
import Tags from '../components/Tags';
import { LinkQuery, LinkQueryVariables } from '../generated/LinkQuery';
import {
  UpdateLinkMutation,
  UpdateLinkMutationVariables,
} from '../generated/UpdateLinkMutation';
import gracefulNetworkPolicy from '../utils/gracefulNetworkPolicy';
import { useIsDesktopLayout } from '../utils/mediaQueryHooks';
import ComplexLayout from './ComplexLayout';

const LINK_QUERY = gql`
  query LinkQuery($linkId: ID) {
    link(linkId: $linkId) {
      _id
      createdAt
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

const LinkPage: React.FC<{}> = () => {
  const isDesktopLayout = useIsDesktopLayout();

  const { linkId } = useParams();
  const linkQuery = useQuery<LinkQuery, LinkQueryVariables>(LINK_QUERY, {
    fetchPolicy: gracefulNetworkPolicy(),
    variables: { linkId },
  });

  const [updateLink] = useMutation<
    UpdateLinkMutation,
    UpdateLinkMutationVariables
  >(UPDATE_LINK_MUTATION);

  if (linkQuery.loading && !linkQuery.data) {
    return <ComplexLayout loading />;
  }

  if (!linkQuery.data) {
    throw Error('[LinkPage] Illegal state: no data');
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
      <LinkForm
        link={link}
        onSubmit={(updatedLink): void => {
          updateLink({ variables: { link: updatedLink } });
        }}
        tagsComponent={!isDesktopLayout && tagsComponent}
      />
    </ComplexLayout>
  );
};

export default LinkPage;
