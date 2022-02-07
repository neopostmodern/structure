import { Chip, SxProps } from '@mui/material';
import React from 'react';
import { useDispatch } from 'react-redux';
import { push } from 'redux-first-history';
import { TagType } from '../types';
import colorTools from '../utils/colorTools';

interface TagProps {
  tag: TagType;
  sx: SxProps;
}

const Tag: React.FC<
  TagProps &
    React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLDivElement>,
      HTMLDivElement
    >
> = ({ tag, onClick, sx, ...props }) => {
  const dispatch = useDispatch();
  return (
    <Chip
      key={tag._id}
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
