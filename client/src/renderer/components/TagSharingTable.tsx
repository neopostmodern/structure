import { gql, useMutation } from '@apollo/client';
import {
  Edit,
  LocalOffer,
  Person,
  Share,
  Visibility,
} from '@mui/icons-material';
import {
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from '@mui/material';
import { MouseEvent, useCallback, useState } from 'react';
import styled from 'styled-components';
import type {
  TagsQuery,
  UpdatePermissionOnTagMutation,
  UpdatePermissionOnTagMutationVariables,
} from '../generated/graphql';
import useUserId from '../hooks/useUserId';
import ErrorSnackbar from './ErrorSnackbar';
import { FORM_SUBHEADER_STYLES } from './formComponents';
import TagSharingDelete from './TagSharingDelete';

const PermissionsTable = styled.table`
  thead {
    ${FORM_SUBHEADER_STYLES}
  }
  tbody td:not(:last-of-type) {
    border-right: transparent 0.75em solid;
  }
  tbody tr:not(:last-of-type) td {
    border-bottom: transparent 1em solid;
  }
`;

type TagType = TagsQuery['tags'][number];

const permissionsObjectToGrantedLabels = (
  permissions:
    | {
        [mode: string]: boolean;
      }
    | {
        __typename?: string;
      }
): Array<string> =>
  Object.entries(permissions)
    .filter(([mode, granted]) => mode !== '__typename' && granted)
    .map(([mode]) => mode);

const UPDATE_PERMISSION_ON_TAG_MUTATION = gql`
  mutation UpdatePermissionOnTag(
    $tagId: ID!
    $userId: ID!
    $resource: String!
    $mode: String!
    $granted: Boolean!
  ) {
    updatePermissionOnTag(
      tagId: $tagId
      userId: $userId
      resource: $resource
      mode: $mode
      granted: $granted
    ) {
      _id
      updatedAt
      permissions {
        user {
          _id
        }
        tag {
          read
          write
          use
          share
        }
        notes {
          read
          write
        }
      }
    }
  }
`;

const TagSharingTable = ({
  tag,
  readOnly = false,
}: {
  tag: TagType;
  readOnly?: boolean;
}) => {
  const userId = useUserId();

  const [updatePermissionOnTag, updatePermissionOnTagMutation] = useMutation<
    UpdatePermissionOnTagMutation,
    UpdatePermissionOnTagMutationVariables
  >(UPDATE_PERMISSION_ON_TAG_MUTATION);
  const [mutationActiveOnUserId, setMutationActiveOnUserId] = useState<
    string | null
  >();

  const handlePermissionsChange = useCallback(
    (event: MouseEvent<HTMLElement>, newPermissions: Array<string>) => {
      const { resource, userId } = (
        event.currentTarget.parentNode! as HTMLDivElement
      ).dataset;
      const mode = (event.currentTarget as HTMLButtonElement).value;
      const granted = newPermissions.includes(mode);

      (async () => {
        try {
          setMutationActiveOnUserId(userId);
          await updatePermissionOnTag({
            variables: {
              tagId: tag._id,
              userId: userId!,
              resource: resource!,
              mode,
              granted,
            },
          });
        } catch (error) {
          console.error('[TagSharingTable.handlePermissionsChange]', error);
        } finally {
          setMutationActiveOnUserId(null);
        }
      })();
    },
    [setMutationActiveOnUserId, updatePermissionOnTag]
  );

  if (!tag.permissions || tag.permissions.length === 1) {
    return <div>This tag is not shared with anybody yet</div>;
  }

  return (
    <>
      <ErrorSnackbar
        error={updatePermissionOnTagMutation.error}
        actionDescription="Update tag permission"
      />
      <PermissionsTable>
        <thead>
          <tr>
            <td></td>
            <td>Tag</td>
            <td>Tagged notes</td>
          </tr>
        </thead>
        <tbody>
          {tag.permissions.map((permission) => (
            <tr key={permission.user._id}>
              <td>
                {permission.user.name}{' '}
                {tag.user._id === permission.user._id && (
                  <Tooltip title="Creator">
                    <Person style={{ verticalAlign: 'bottom' }} />
                  </Tooltip>
                )}
              </td>
              <td>
                <ToggleButtonGroup
                  value={permissionsObjectToGrantedLabels(permission.tag)}
                  onChange={handlePermissionsChange}
                  data-resource="tag"
                  data-user-id={permission.user._id}
                  size="small"
                >
                  <ToggleButton value="read" disabled>
                    <Tooltip title="See tag">
                      <Visibility />
                    </Tooltip>
                  </ToggleButton>
                  <ToggleButton value="write" disabled={readOnly}>
                    <Tooltip title="Edit tag">
                      <Edit />
                    </Tooltip>
                  </ToggleButton>
                  <ToggleButton value="use" disabled={readOnly}>
                    <Tooltip title="Use tag">
                      <LocalOffer />
                    </Tooltip>
                  </ToggleButton>
                  <ToggleButton value="share" disabled={readOnly}>
                    <Tooltip title="Share tag">
                      <Share />
                    </Tooltip>
                  </ToggleButton>
                </ToggleButtonGroup>
              </td>
              <td>
                <ToggleButtonGroup
                  value={permissionsObjectToGrantedLabels(permission.notes)}
                  onChange={handlePermissionsChange}
                  data-resource="notes"
                  data-user-id={permission.user._id}
                  size="small"
                >
                  <ToggleButton value="read" disabled>
                    <Tooltip title="See tagged notes">
                      <Visibility />
                    </Tooltip>
                  </ToggleButton>
                  <ToggleButton value="write" disabled={readOnly}>
                    <Tooltip title="Edit tagged notes">
                      <Edit />
                    </Tooltip>
                  </ToggleButton>
                </ToggleButtonGroup>
              </td>
              <td>
                {mutationActiveOnUserId === permission.user._id ? (
                  <CircularProgress size="1.2em" disableShrink />
                ) : (
                  tag.user._id !== permission.user._id &&
                  (!readOnly || userId === permission.user._id) && (
                    <TagSharingDelete
                      tagId={tag._id}
                      userId={permission.user._id}
                    />
                  )
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </PermissionsTable>
    </>
  );
};

export default TagSharingTable;
