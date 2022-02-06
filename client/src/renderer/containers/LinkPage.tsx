import { useMutation, useQuery } from '@apollo/client';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { Button } from '@mui/material';
import gql from 'graphql-tag';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import { push } from 'redux-first-history';
import LinkForm from '../components/LinkForm';
import { Menu } from '../components/Menu';
import Tags from '../components/Tags';
import {
  DeleteLinkMutation,
  DeleteLinkMutationVariables,
} from '../generated/DeleteLinkMutation';
import { LinkQuery, LinkQueryVariables } from '../generated/LinkQuery';
import { NotesForList } from '../generated/NotesForList';
import {
  UpdateLinkMutation,
  UpdateLinkMutationVariables,
} from '../generated/UpdateLinkMutation';
import gracefulNetworkPolicy from '../utils/gracefulNetworkPolicy';
import ComplexLayout from './ComplexLayout';
import { NOTES_QUERY } from './NotesPage/NotesPage';

const LINK_QUERY = gql`
  query LinkQuery($linkId: ID) {
    link(linkId: $linkId) {
      _id
      createdAt
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
const DELETE_LINK_MUTATION = gql`
  mutation DeleteLinkMutation($linkId: ID!) {
    deleteLink(linkId: $linkId) {
      _id
    }
  }
`;

const LinkPage: React.FC<{}> = () => {
  const { linkId } = useParams();
  const dispatch = useDispatch();
  const linkQuery = useQuery<LinkQuery, LinkQueryVariables>(LINK_QUERY, {
    fetchPolicy: gracefulNetworkPolicy(),
    variables: { linkId },
  });

  const [updateLink] = useMutation<
    UpdateLinkMutation,
    UpdateLinkMutationVariables
  >(UPDATE_LINK_MUTATION);

  const [deleteLink] = useMutation<
    DeleteLinkMutation,
    DeleteLinkMutationVariables
  >(DELETE_LINK_MUTATION, {
    onCompleted: () => {
      dispatch(push('/'));
    },
    update(cache, { data: { deleteLink: deleteLinkData } }) {
      const { notes } = cache.readQuery<NotesForList>({ query: NOTES_QUERY });
      cache.writeQuery({
        query: NOTES_QUERY,
        data: { notes: notes.filter(({ _id }) => _id !== deleteLinkData._id) },
      });
    },
  });

  if (linkQuery.loading && !linkQuery.data) {
    return <ComplexLayout loading />;
  }

  const { link } = linkQuery.data;

  return (
    <ComplexLayout
      primaryActions={<Tags tags={link.tags} withShortcuts noteId={link._id} />}
      secondaryActions={
        <Menu>
          <Button
            size="huge"
            startIcon={<DeleteIcon />}
            onClick={(): void => {
              deleteLink({ variables: { linkId: link._id } });
            }}
          >
            Delete note
          </Button>
        </Menu>
      }
    >
      <LinkForm
        link={link}
        onSubmit={(updatedLink): void => {
          updateLink({ variables: { link: updatedLink } });
        }}
      />
    </ComplexLayout>
  );
};

export default LinkPage;
