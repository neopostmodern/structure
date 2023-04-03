import {
  Edit,
  LocalOffer,
  Person,
  Share,
  Visibility,
} from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import styled from 'styled-components';
import { TagsQuery } from '../generated/graphql';

const VerticalSpaceCell = styled.td`
  width: 1em;
`;

type TagType = TagsQuery['tags'][number];

const TagSharingTable = ({ tag }: { tag: TagType }) => {
  if (!tag.permissions || tag.permissions.length === 1) {
    return 'This tag is not shared with anybody yet';
  }

  return (
    <table>
      <tbody>
        {tag.permissions.map((permission) => (
          <tr key={permission.user._id}>
            <td>{permission.user.name}</td>
            <VerticalSpaceCell />
            <td>
              {tag.user._id === permission.user._id && (
                <Tooltip title="Creator">
                  <Person />
                </Tooltip>
              )}
            </td>
            <td>
              {permission.tag.read && (
                <Tooltip title="See tag">
                  <Visibility />
                </Tooltip>
              )}
            </td>
            <td>
              {permission.tag.write && (
                <Tooltip title="Edit tag">
                  <Edit />
                </Tooltip>
              )}
            </td>
            <td>
              {permission.tag.use && (
                <Tooltip title="Use tag">
                  <LocalOffer />
                </Tooltip>
              )}
            </td>
            <td>
              {permission.tag.share && (
                <Tooltip title="Share tag">
                  <Share />
                </Tooltip>
              )}
            </td>
            <VerticalSpaceCell />
            <td>
              {permission.notes.read && (
                <Tooltip title="See tagged notes">
                  <Visibility />
                </Tooltip>
              )}
            </td>
            <td>
              {permission.notes.write && (
                <Tooltip title="Edit tagged notes">
                  <Edit />
                </Tooltip>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TagSharingTable;
