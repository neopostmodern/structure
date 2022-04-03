import { LoadingButton, LoadingButtonProps } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  ListItemIcon,
  MenuItem,
} from '@mui/material';
import { PropsWithChildren, ReactNode, useState } from 'react';

interface TriggerWithConfirmationBaseProps {
  startIcon: ReactNode | undefined;
  onClick: () => void;
  confirmationQuestion: string;
  confirmationButtonLabel: string;
}
interface ButtonWithConfirmationProps extends TriggerWithConfirmationBaseProps {
  variant: 'button';
  buttonProps: Omit<LoadingButtonProps, keyof TriggerWithConfirmationBaseProps>;
}
interface MenuItemWithConfirmationProps
  extends TriggerWithConfirmationBaseProps {
  variant: 'menuitem';
}

type TriggerWithConfirmationProps = PropsWithChildren<
  MenuItemWithConfirmationProps | ButtonWithConfirmationProps
>;

const TriggerWithConfirmation = (props: TriggerWithConfirmationProps) => {
  const {
    confirmationQuestion,
    confirmationButtonLabel,
    onClick,
    startIcon,
    variant,
    children,
  } = props;
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleTriggerClick = () => setDialogOpen(true);
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  return (
    <>
      {variant === 'button' ? (
        <LoadingButton
          onClick={handleTriggerClick}
          startIcon={startIcon}
          {...props.buttonProps}
        >
          {children}
        </LoadingButton>
      ) : (
        <MenuItem onClick={handleTriggerClick}>
          {startIcon && <ListItemIcon>{startIcon}</ListItemIcon>}
          {children}
        </MenuItem>
      )}

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

export default TriggerWithConfirmation;
