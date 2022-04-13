import { ApolloError, NetworkStatus } from '@apollo/client';
import { SyncProblem } from '@mui/icons-material';
import { Button } from '@mui/material';
import React from 'react';
import styled, { css } from 'styled-components';
import { OFFLINE_CACHE_MISS } from '../utils/useDataState';
import Gap from './Gap';

const ErrorContainer = styled.div<{ variant?: 'fullpage' | 'outlined' }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  ${({ variant = 'fullpage', theme }) => {
    if (variant === 'fullpage') {
      return css`
        height: 70vh;
      `;
    }
    if (variant === 'outlined') {
      return css`
        border: 1px solid gray;
        border-radius: ${theme.shape.borderRadius}px;
        padding: 2rem;
      `;
    }
    throw Error(
      `[FatalApolloError - ErrorContainer] Unknown variant: ${variant}`
    );
  }}
`;

const ErrorTitle = styled.div`
  font-size: 1.5rem;
`;

const ErrorInformation = styled.div`
  width: 100%;
  align-self: flex-start;
  color: gray;
  margin-top: 5em;
`;

const ErrorInformationSmall = styled.div`
  width: 45ch;
  color: gray;
`;

const FullErrorMessage = styled.pre`
  max-width: 100%;
  overflow-x: auto;
`;

type NetworkErrorProps =
  | {
      error: ApolloError | undefined; // todo: could be more generic?
      refetch: () => void;
    }
  | {
      query: {
        error: ApolloError;
        refetch: () => void;
        networkStatus: NetworkStatus;
      };
    };

const FatalApolloError: React.FC<NetworkErrorProps> = (props) => {
  const { error, refetch, ...optionalProps } =
    'query' in props ? props.query : props;
  if (!error) {
    return (
      <ErrorContainer>
        <h1>Unknown error.</h1>
        <ErrorInformation>
          An error was reported but no error was supplied.
        </ErrorInformation>
      </ErrorContainer>
    );
  }

  const reloadButton = (
    <Button
      variant="outlined"
      onClick={() => {
        refetch();
      }}
      autoFocus
    >
      Reload
    </Button>
  );

  if (error.extraInfo === OFFLINE_CACHE_MISS) {
    return (
      <ErrorContainer variant="outlined">
        <ErrorTitle>Requested data is not available offline.</ErrorTitle>
        <Gap vertical={1} />
        <SyncProblem sx={{ fontSize: '4rem', color: 'gray' }} />
        <Gap vertical={0.5} />
        <ErrorInformationSmall>
          You're offline but the requested data is not available in the cache.
          Please retry once you're connected again.
        </ErrorInformationSmall>
        <Gap vertical={1} />
        {reloadButton}
      </ErrorContainer>
    );
  }

  let fullErrorMessage;
  try {
    fullErrorMessage = (
      <FullErrorMessage>{JSON.stringify(error, null, 2)}</FullErrorMessage>
    );
  } catch (e) {
    fullErrorMessage = (
      <div>Complete error message couldn&apos;t be displayed.</div>
    );
  }
  return (
    <ErrorContainer>
      <ErrorTitle>
        {'networkStatus' in optionalProps &&
        optionalProps.networkStatus === NetworkStatus.error
          ? 'Network'
          : 'Unknown'}{' '}
        error.
      </ErrorTitle>
      {reloadButton}
      <ErrorInformation>
        <h3>Further information</h3>
        <div>{error.message}</div>
        {fullErrorMessage}
      </ErrorInformation>
    </ErrorContainer>
  );
};

export default FatalApolloError;
