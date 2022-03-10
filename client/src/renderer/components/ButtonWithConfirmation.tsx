import { LoadingButton, LoadingButtonProps } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from '@mui/material';
import { useState } from 'react';

const ButtonWithConfirmation = ({
  confirmationQuestion,
  confirmationButtonLabel,
  onClick,
  children,
  ...buttonProps
}: LoadingButtonProps & {
  confirmationQuestion: string;
  confirmationButtonLabel: string;
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  return (
    <>
      <LoadingButton onClick={() => setDialogOpen(true)} {...buttonProps}>
        {children}
      </LoadingButton>

      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {confirmationQuestion}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={() => {
              onClick();
              handleCloseDialog();
            }}
            autoFocus
          >
            {confirmationButtonLabel}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ButtonWithConfirmation;
