import { useMediaQuery } from '@mui/material'
import { breakpointDesktop, breakPointMobile } from '../styles/constants'

export const useIsMobileLayout = () =>
  useMediaQuery(`(max-width: ${breakPointMobile})`)

export const useIsDesktopLayout = () =>
  useMediaQuery(`(min-width: ${breakpointDesktop}rem)`)
