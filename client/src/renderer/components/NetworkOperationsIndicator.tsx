import { MutationResult } from '@apollo/client';
import { Box, Typography } from '@mui/material';
import { PropsWithChildren, useEffect, useState } from 'react';
import { DataState, PolicedData } from '../utils/useDataState';
import ErrorSnackbar from './ErrorSnackbar';

enum NetworkPhase {
  IDLE,
  IN_PROGRESS,
  NOTIFY_COMPLETE,
}

const DISPLAY_BACKGROUND_LOAD_NOTIFICATION_LENGTH = 700;
const DISPLAY_SAVED_NOTIFICATION_LENGTH = 1000;

export const NetworkIndicatorContainer = ({
  children,
  align = 'right',
}: PropsWithChildren<{ align?: 'left' | 'right' }>) => (
  <Box sx={{ position: 'relative' }}>
    <Box sx={{ position: 'absolute', bottom: 0, [align]: 0 }}>
      <Typography variant="caption">{children}</Typography>
    </Box>
  </Box>
);

const NetworkOperationsIndicator = ({
  query,
  mutation,
}: {
  query?: PolicedData<any>;
  mutation?: MutationResult;
}) => {
  const [backgroundLoadingState, setBackgroundLoadingState] =
    useState<NetworkPhase>(NetworkPhase.IDLE);
  const [savingState, setSavingState] = useState<NetworkPhase>(
    NetworkPhase.IDLE
  );

  const isLoadingBackground =
    query?.state === DataState.DATA && query?.loadingBackground;
  const isSaving = mutation?.loading;
  const isError = mutation?.error;

  useEffect(() => {
    if (isSaving) {
      if (savingState === NetworkPhase.IDLE) {
        setSavingState(NetworkPhase.IN_PROGRESS);
      }
    } else if (isLoadingBackground) {
      if (backgroundLoadingState === NetworkPhase.IDLE) {
        setBackgroundLoadingState(NetworkPhase.IN_PROGRESS);
      }
    } else {
      if (savingState === NetworkPhase.IN_PROGRESS) {
        setSavingState(NetworkPhase.NOTIFY_COMPLETE);
        setTimeout(() => {
          setSavingState(NetworkPhase.IDLE);
        }, DISPLAY_SAVED_NOTIFICATION_LENGTH);
      }
      if (backgroundLoadingState === NetworkPhase.IN_PROGRESS) {
        setBackgroundLoadingState(NetworkPhase.NOTIFY_COMPLETE);
        setTimeout(() => {
          setBackgroundLoadingState(NetworkPhase.IDLE);
        }, DISPLAY_BACKGROUND_LOAD_NOTIFICATION_LENGTH);
      }
    }
  }, [savingState, setSavingState, isSaving, isLoadingBackground]);

  let message;
  if (isError) {
    message = 'Save failed!';
  } else if (savingState === NetworkPhase.IN_PROGRESS) {
    message = 'Saving...';
  } else if (savingState === NetworkPhase.NOTIFY_COMPLETE) {
    message = 'Saved.';
  } else if (backgroundLoadingState === NetworkPhase.IN_PROGRESS) {
    message = 'Refreshing...';
  } else if (backgroundLoadingState === NetworkPhase.NOTIFY_COMPLETE) {
    message = 'Up to date.';
  }

  return (
    <>
      <NetworkIndicatorContainer>{message}</NetworkIndicatorContainer>
      <ErrorSnackbar error={mutation?.error} actionDescription="save" />
    </>
  );
};

export default NetworkOperationsIndicator;
