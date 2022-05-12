import { Launch, Share } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { openInDefaultBrowser, shareUrl } from '../../utils/openWith';
import { TextField } from '../CommonStyles';

interface UrlFieldProps {
  name: string;
}

const UrlField: React.FC<UrlFieldProps> = ({ name }) => {
  const { watch, register, getValues, formState } = useFormContext();

  return (
    <>
      <div style={{ display: 'flex' }}>
        <TextField type="text" {...register(name)} />
        <Tooltip title="Open in default browser">
          <IconButton
            style={{ marginLeft: '1rem' }}
            onClick={(): void => {
              openInDefaultBrowser(watch(name));
            }}
          >
            <Launch />
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
      </div>
      {formState.errors[name] && (
        <div style={{ color: 'red', fontSize: '80%' }}>
          {formState.errors[name]}
        </div>
      )}
    </>
  );
};

export default UrlField;
