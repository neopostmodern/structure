import { Settings } from '@mui/icons-material'
import { Box, CircularProgress, IconButton } from '@mui/material'
import { FC, PropsWithChildren, ReactNode, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import Centered from '../renderer/components/Centered'
import { SmallGrayText } from '../renderer/components/util'
import { openSettings } from './actions/settings'

const Container = styled.div`
  width: 25rem;
  min-height: 6rem;
  box-sizing: border-box;
  padding: 1rem;
`

const TopBar = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 0.5rem;
`

const Title = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  align-self: baseline;
  margin-right: auto;
`

const PopupLayout: FC<
  PropsWithChildren<{
    loading?: boolean
    loadingHint?: string
    topBarActions?: ReactNode
    showConfigNav?: boolean
    showAppTitle?: boolean
  }>
> = ({
  children,
  loading = false,
  loadingHint,
  topBarActions,
  showConfigNav = true,
  showAppTitle = false,
}) => {
  const dispatch = useDispatch()
  const handleOpenSettings = useCallback(
    () => dispatch(openSettings()),
    [dispatch],
  )
  return (
    <Container>
      <TopBar>
        {showAppTitle && <Title>Structure</Title>}
        {topBarActions}
        {showConfigNav && (
          <IconButton onClick={handleOpenSettings}>
            <Settings />
          </IconButton>
        )}
      </TopBar>

      {loading ? (
        <Centered height='6rem'>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <CircularProgress color='inherit' disableShrink />
            <SmallGrayText>{loadingHint}</SmallGrayText>
          </Box>
        </Centered>
      ) : (
        children
      )}
    </Container>
  )
}

export default PopupLayout
