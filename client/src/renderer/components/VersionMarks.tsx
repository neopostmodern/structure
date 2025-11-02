import { Box, Button } from '@mui/material'
import React from 'react'
import styled from 'styled-components'
import config from '../config'
import { Loadable } from '../utils/types'
import { NetworkIndicatorContainer } from './NetworkOperationsIndicator'

const VersionMarksContainer = styled.div<{ warning?: boolean }>`
  padding: 1rem;
  margin: 1rem 0 2rem;

  color: whitesmoke;
  background-color: ${({ warning }): string => (warning ? 'darkred' : 'gray')};

  a {
    color: inherit;
    text-decoration: underline;
  }
`

const Headline = styled.h2`
  font-size: 150%;
  margin-top: 0;
  margin-bottom: 0.2em;
`

interface VersionMarksProps {
  versions: Loadable<{
    minimum?: string | null
    current: string
  }>
  currentPackageVersion: string
}

const VersionMarks: React.FC<VersionMarksProps> = ({
  versions,
  currentPackageVersion,
}) => {
  if (versions === 'loading') {
    return (
      <NetworkIndicatorContainer align='left'>
        Checking for new versions...
      </NetworkIndicatorContainer>
    )
  }

  const updateButtonProps =
    __BUILD_TARGET__ === 'electron_renderer'
      ? {
          href: config.releaseUrl,
          target: '_blank',
          rel: 'noopener noreferrer',
        }
      : {
          onClick: () => {
            window.location.reload()
          },
        }

  if (versions.minimum) {
    return (
      <VersionMarksContainer warning>
        <Headline>Your Structure is obsolete.</Headline>
        <small>
          You are using Structure {currentPackageVersion}, but{' '}
          {versions.minimum} is required on the server.
          <br />
          Functionality is no longer guaranteed. You can continue to use the
          sofware as is at your own risk, but it is strongly recommended to
          update as soon as possible.
          <Box display='flex' justifyContent='flex-end'>
            <Button
              variant='outlined'
              {...updateButtonProps}
              sx={{ textDecoration: 'none !important' }}
            >
              {__BUILD_TARGET__ === 'electron_renderer' ? 'Update' : 'Reload'}{' '}
              now
            </Button>
          </Box>
        </small>
      </VersionMarksContainer>
    )
  }

  if (versions.current !== currentPackageVersion) {
    return (
      <VersionMarksContainer>
        <Headline>Your Structure is outdated.</Headline>
        <small>
          You are using Structure {currentPackageVersion}, but{' '}
          {versions.current} is recommended by the server.
          <br />
          You are probably safe for now but try to update soon.
          <Box display='flex' justifyContent='flex-end'>
            <Button
              variant='outlined'
              {...updateButtonProps}
              sx={{ textDecoration: 'none !important' }}
            >
              {__BUILD_TARGET__ === 'electron_renderer' ? 'Update' : 'Reload'}{' '}
              now
            </Button>
          </Box>
        </small>
      </VersionMarksContainer>
    )
  }

  return null
}

export default VersionMarks
