import { ApolloError } from '@apollo/client';
import { Alert, Button, Snackbar, Portal } from '@mui/material';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { breakPointMobile } from '../styles/constants';
import mediaQueryObjectToCss from '../utils/mediaQueryObjectToCss';

const StyledSnackbar = styled(Snackbar)`
  @media (max-width: ${breakPointMobile}) {
    ${({ theme }) =>
      mediaQueryObjectToCss(
        theme.mixins.toolbar,
        (toolbarRule) =>
          `bottom: calc(${toolbarRule.minHeight}px + ${theme.spacing(
            2
          )} + env(safe-area-inset-bottom));`
      )}
  }
`;

const ErrorSnackbar = ({
  error,
  actionDescription,
  retry = undefined,
  autoHideDuration = null,
}: {
  error: ApolloError | undefined;
  actionDescription: string;
  retry?: () => void;
  autoHideDuration?: number | null;
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
    <Portal>
      <StyledSnackbar
        open={open}
        onClose={handleClose}
        autoHideDuration={autoHideDuration}
      >
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
      </StyledSnackbar>
    </Portal>
  );
};

export default ErrorSnackbar;
