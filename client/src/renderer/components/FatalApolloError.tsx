import { ApolloError, NetworkStatus } from '@apollo/client';
import { Button } from '@mui/material';
import React from 'react';
import styled from 'styled-components';

const ErrorContainer = styled.div`
  height: 70vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ErrorInformation = styled.div`
  width: 100%;
  align-self: flex-start;
  color: gray;
  margin-top: 5em;
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
      <h1>
        {'networkStatus' in optionalProps &&
        optionalProps.networkStatus === NetworkStatus.error
          ? 'Network'
          : 'Unknown'}{' '}
        error.
      </h1>
      <Button variant="outlined" onClick={refetch} autoFocus>
        Reload
      </Button>
      <ErrorInformation>
        <h3>Further information</h3>
        <div>{error.message}</div>
        {fullErrorMessage}
      </ErrorInformation>
    </ErrorContainer>
  );
};

export default FatalApolloError;
