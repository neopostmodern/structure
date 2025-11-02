import { LoadingButton } from '@mui/lab'
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  ListItemIcon,
  MenuItem,
  Modal,
} from '@mui/material'
import { PropsWithChildren, ReactNode, useState } from 'react'

type TriggerWithConfirmationProps = PropsWithChildren<{
  startIcon: ReactNode | undefined
  onClick: () => void
  confirmationQuestion: string
  confirmationButtonLabel: string
  variant: 'button' | 'menuitem'
  loading: boolean
  modalInterstitial?: boolean
}>

const TriggerWithConfirmation = ({
  confirmationQuestion,
  confirmationButtonLabel,
  onClick,
  startIcon,
  variant,
  loading,
  modalInterstitial,
  children,
}: TriggerWithConfirmationProps) => {
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleTriggerClick = () => setDialogOpen(true)
  const handleCloseDialog = () => {
    setDialogOpen(false)
  }

  return (
    <>
      {modalInterstitial && (
        <Modal open={loading}>
          <Box
            display='flex'
            justifyContent='center'
            alignItems='center'
            height='100vh'
          >
            <CircularProgress disableShrink />
          </Box>
        </Modal>
      )}

      {variant === 'button' ? (
        <LoadingButton
          onClick={handleTriggerClick}
          startIcon={startIcon}
          loading={loading}
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
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            {confirmationQuestion}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={() => {
              onClick()
              handleCloseDialog()
            }}
            autoFocus
          >
            {confirmationButtonLabel}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default TriggerWithConfirmation
