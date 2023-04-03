import { Share } from '@mui/icons-material';
import { Chip, ChipProps, SxProps } from '@mui/material';
import React from 'react';
import { useDispatch } from 'react-redux';
import { push } from 'redux-first-history';
import styled from 'styled-components';
import useUserId from '../hooks/useUserId';
import colorTools from '../utils/colorTools';
import { DisplayOnlyTag } from '../utils/types';
import UserAvatar from './UserAvatar';

const TagChip = styled(Chip)`
  overflow-x: hidden;
  text-overflow: ellipsis;
`;

interface TagProps {
  tag: DisplayOnlyTag;
  size?: 'small' | 'medium';
  sx?: SxProps;
}

const Tag: React.FC<TagProps & ChipProps> = ({
  tag,
  onClick,
  sx = {},
  size = 'small',
  ...props
}) => {
  const dispatch = useDispatch();
  const userId = useUserId();

  return (
    <TagChip
      key={tag._id}
      size={size}
      onClick={
        onClick ||
        ((): void => {
          dispatch(push(`/tags/${tag._id}`));
        })
      }
      ref={colorTools as any}
      label={tag.name}
      avatar={tag.user._id !== userId ? <UserAvatar user={tag.user} /> : null}
      icon={
        tag.user._id === userId && tag.permissions.length > 1 ? (
          <Share color="inherit" />
        ) : null
      }
      sx={{ backgroundColor: tag.color, ...sx }}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    />
  );
};

export default Tag;
