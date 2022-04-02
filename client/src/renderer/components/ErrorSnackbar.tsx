import { ApolloError } from '@apollo/client';
import { Alert, Button, Snackbar } from '@mui/material';
import { useEffect, useState } from 'react';

const ErrorSnackbar = ({
  error,
  actionDescription,
  retry = undefined,
}: {
  error: ApolloError | undefined;
  actionDescription: string;
  retry?: () => void;
}) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (error) {
      console.error(error);
      setOpen(true);
    }
    if (!error) {
      setOpen(false);
    }
  }, [error]);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Snackbar open={open} onClose={handleClose}>
      <Alert
        onClose={handleClose}
        severity="error"
        sx={{ width: '100%' }}
        action={
          retry ? (
            <Button
              onClick={() => {
                retry();
              }}
            >
              Retry
            </Button>
          ) : undefined
        }
      >
        Failed to {actionDescription}
        <br />
        <small>{error?.message}</small>
      </Alert>
    </Snackbar>
  );
};

export default ErrorSnackbar;
