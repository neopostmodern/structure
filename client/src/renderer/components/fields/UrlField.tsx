import { Button } from '@mui/material';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { TextField } from '../CommonStyles';

interface UrlFieldProps {
  name: string;
}

const UrlField: React.FC<UrlFieldProps> = ({ name }) => {
  const { watch, register } = useFormContext();

  return (
    <div style={{ display: 'flex' }}>
      <TextField type="text" {...register(name)} />
      <Button
        variant="outlined"
        size="small"
        style={{ marginLeft: '1rem' }}
        onClick={(): void => {
          window.open(watch(name), '_blank', 'noopener, noreferrer');
        }}
      >
        Open
      </Button>
    </div>
  );
};

export default UrlField;
