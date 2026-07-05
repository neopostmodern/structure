import { CircularProgress } from '@mui/material'
import { FC, PropsWithChildren, ReactNode } from 'react'
import styled from 'styled-components'
import Centered from '../renderer/components/Centered'

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
  PropsWithChildren<{ loading?: boolean; topBarActions?: ReactNode }>
> = ({ children, loading = false, topBarActions }) => (
  <Container>
    {topBarActions && <TopBar>{topBarActions}</TopBar>}
    {loading ? (
      <Centered height='6rem'>
        <CircularProgress color='inherit' disableShrink />
      </Centered>
    ) : (
      children
    )}
  </Container>
)

export default PopupLayout
