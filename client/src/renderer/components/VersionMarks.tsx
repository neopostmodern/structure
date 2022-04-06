import React from 'react';
import styled from 'styled-components';
import config from '../config';

const VersionMarksContainer = styled.div<{ warning?: boolean }>`
  padding: 1rem;
  margin: 1rem 0 2rem;

  color: whitesmoke;
  background-color: ${({ warning }): string => (warning ? 'darkred' : 'gray')};

  a {
    color: inherit;
    text-decoration: underline;
  }
`;

const Headline = styled.h2`
  font-size: 150%;
  margin-bottom: 0.2em;
`;

interface VersionMarksProps {
  versions:
    | 'loading'
    | {
        minimum: number;
        recommended?: number;
      };
}

const VersionMarks: React.FC<VersionMarksProps> = ({ versions }) => {
  if (versions === 'loading') {
    return <i>Checking for new versions...</i>;
  }

  const { minimum, recommended } = versions;

  if (minimum > config.apiVersion) {
    return (
      <VersionMarksContainer warning>
        <Headline>Your Structure is obsolete.</Headline>
        <small>
          This Structure uses API version {config.apiVersion}, but {minimum} is
          required on the server.
          <br />
          Functionality is no longer guaranteed, use at your own risk or{' '}
          <a href={config.releaseUrl} target="_blank" rel="noopener noreferrer">
            update now
          </a>
          .
        </small>
      </VersionMarksContainer>
    );
  }

  if (recommended && recommended > config.apiVersion) {
    return (
      <VersionMarksContainer>
        <Headline>Your Structure is outdated.</Headline>
        <small>
          This Structure uses API version {config.apiVersion}, but {recommended}{' '}
          is recommended by the server.
          <br />
          You are probably safe for now but try to{' '}
          <a href={config.releaseUrl} target="_blank" rel="noopener noreferrer">
            update soon
          </a>
          .
        </small>
      </VersionMarksContainer>
    );
  }

  return null;
};

export default VersionMarks;
