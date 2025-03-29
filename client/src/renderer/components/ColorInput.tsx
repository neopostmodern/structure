import { useLazyQuery } from '@apollo/client';
import { Close, Colorize } from '@mui/icons-material';
import {
  Box,
  Chip,
  Dialog,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import styled from 'styled-components';
import { TAGS_QUERY } from '../containers/TagsPage';
import type { TagsQuery } from '../generated/graphql';
import useColorTagGroups from '../hooks/useColorTagGroups';
import colorTools from '../utils/colorTools';
import { useIsMobileLayout } from '../utils/mediaQueryHooks';
import useDataState from '../utils/useDataState';
import { StructureTextField } from './formComponents';
import Gap from './Gap';

const ColorIndicator = styled.div<{ color: string }>`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: ${({ theme }) => theme.shape.borderRadius}px;
  background-color: ${({ color }) => color};
`;

const StyledListItemText = styled(ListItemText)`
  .MuiListItemText-primary {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const ColorBlockInput = styled(StructureTextField).attrs({ fullWidth: false })`
  margin-bottom: 2rem;

  .MuiInputBase-root {
    color: inherit;

    &::before,
    &::after {
      border-bottom-color: currentColor !important;
    }
  }

  .MuiInputBase-input {
    width: 10rem;
    height: 10rem;
    padding: 0;

    text-align: center;
    color: inherit;
  }

  .MuiInputAdornment-root,
  .MuiButtonBase-root {
    color: inherit !important;
  }
  .MuiInputAdornment-positionEnd {
    position: absolute;
    top: ${({ theme }) => theme.spacing(3)};
    right: ${({ theme }) => theme.spacing(2)};
  }
`;

const ColorInput = ({
  color,
  name,
  tagName,
}: {
  color: string;
  name: string;
  tagName: string;
}) => {
  const [fetchTagsQuery, tagsQuery] = useDataState(
    useLazyQuery<TagsQuery>(TAGS_QUERY, { fetchPolicy: 'cache-only' })
  );
  const colorTagGroups = useColorTagGroups(tagsQuery);

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
    fetchTagsQuery();
  };

  const handleClose = () => {
    setOpen(false);
  };

  const { register, setValue, trigger } = useFormContext();
  const { ref: registerRef, ...registerProps } = register('color');

  const isMobileLayout = useIsMobileLayout();

  return (
    <>
      <ColorBlockInput
        ref={(ref) => {
          registerRef(ref);
          colorTools(ref);
        }}
        {...registerProps}
        type="text"
        style={{ backgroundColor: color }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="color picker"
                onClick={handleClickOpen}
                edge="end"
              >
                <Colorize />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Dialog fullScreen={isMobileLayout} open={open} onClose={handleClose}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          padding={2}
        >
          <Typography variant="h6">
            Pick an existing color for{' '}
            <Chip variant="outlined" label={tagName} />
          </Typography>
          <Gap horizontal={2} />
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <Close />
          </IconButton>
        </Box>
        <List>
          {Object.entries(colorTagGroups)
            .sort(([_, tagsA], [__, tagsB]) =>
              Math.sign(tagsB.length - tagsA.length)
            )
            .map(([color, tags]) => (
              <ListItem key={color} disablePadding>
                <ListItemButton
                  onClick={() => {
                    setValue(name, color);
                    trigger(name);
                    handleClose();
                  }}
                >
                  <ListItemIcon>
                    <ColorIndicator color={color} />
                  </ListItemIcon>
                  <StyledListItemText
                    primary={tags.slice(0, 8).map(({ _id, name }) => (
                      <Chip
                        key={_id}
                        variant="outlined"
                        size="small"
                        label={name}
                        sx={{ marginRight: 1, cursor: 'pointer' }}
                      />
                    ))}
                    secondary={`${tags.length} tags`}
                  />
                </ListItemButton>
              </ListItem>
            ))}
        </List>
      </Dialog>
    </>
  );
};

export default ColorInput;
