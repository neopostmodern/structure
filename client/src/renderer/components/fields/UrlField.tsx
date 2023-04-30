import { ContentCopy, Launch, Share } from '@mui/icons-material';
import { Box, IconButton, Tooltip } from '@mui/material';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import useIsOnline from '../../hooks/useIsOnline';
import { openInDefaultBrowser, shareUrl } from '../../utils/openWith';
import { StructureTextField } from '../formComponents';

interface UrlFieldProps {
  name: string;
  readOnly?: boolean;
}

const UrlField: React.FC<UrlFieldProps> = ({
  name,
  readOnly: forceReadOnly = false,
}) => {
  const { watch, register, getValues, formState } = useFormContext();

  const isOnline = useIsOnline();
  const readOnly = !isOnline || forceReadOnly;

  return (
    <>
      <Box display="flex" alignItems="end">
        <StructureTextField
          type="text"
          label="URL"
          InputProps={{ readOnly }}
          {...register(name)}
        />
        <Tooltip title="Copy URL">
          <IconButton
            style={{ marginLeft: '1rem' }}
            onClick={() => {
              navigator.clipboard.writeText(getValues(name));
            }}
          >
            <ContentCopy />
          </IconButton>
        </Tooltip>
        {navigator.share && (
          <Tooltip title="Share URL">
            <IconButton
              onClick={() => {
                shareUrl(getValues(name), getValues('name'));
              }}
            >
              <Share />
            </IconButton>
          </Tooltip>
        )}
        <Tooltip title="Open in default browser">
          <IconButton
            onClick={(): void => {
              openInDefaultBrowser(watch(name));
            }}
          >
            <Launch />
          </IconButton>
        </Tooltip>
      </Box>
      {formState.errors[name] && (
        <div style={{ color: 'red', fontSize: '80%' }}>
          {formState.errors[name]}
        </div>
      )}
    </>
  );
};

export default UrlField;
