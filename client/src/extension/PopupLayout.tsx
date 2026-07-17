import { Box, CircularProgress } from '@mui/material'
import { FC, PropsWithChildren, ReactNode } from 'react'
import styled from 'styled-components'
import Centered from '../renderer/components/Centered'
import { SmallGrayText } from '../renderer/components/util'

const Container = styled.div`
  width: 22rem;
  min-height: 6rem;
  box-sizing: border-box;
  padding: 1rem;
`

const TopBar = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 0.5rem;
`

// Deliberately bare: no Navigation, no drawer, no version marks - just enough
// chrome for a small popup (an optional top-right action, e.g. "Open in
// app") around whatever note-editing UI is reused from the main app.
const PopupLayout: FC<
  PropsWithChildren<{
    loading?: boolean
    loadingHint?: string
    topBarActions?: ReactNode
  }>
> = ({ children, loading = false, loadingHint, topBarActions }) => (
  <Container>
    {topBarActions && <TopBar>{topBarActions}</TopBar>}
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

export default PopupLayout
