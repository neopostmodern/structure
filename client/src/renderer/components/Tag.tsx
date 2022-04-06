import { Chip, ChipProps, SxProps } from '@mui/material';
import React from 'react';
import { useDispatch } from 'react-redux';
import { push } from 'redux-first-history';
import styled from 'styled-components';
import { TagType } from '../types';
import colorTools from '../utils/colorTools';

const TagChip = styled(Chip)`
  overflow-x: hidden;
  text-overflow: ellipsis;
`;

interface TagProps {
  tag: TagType;
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
      sx={{ backgroundColor: tag.color, ...sx }}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    />
  );
};

export default Tag;
