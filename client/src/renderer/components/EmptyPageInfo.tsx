import { SvgIconComponent } from '@mui/icons-material'
import { Stack, Typography } from '@mui/material'
import { FC, PropsWithChildren } from 'react'
import styled from 'styled-components'
import Centered from './Centered'

const Title = styled.div`
  font-size: 130%;
`

const EmptyPageInfo: FC<
  PropsWithChildren<{
    icon: SvgIconComponent
    title?: string
    subtitle?: JSX.Element | string
    actions?: JSX.Element
  }>
> = ({ children, title, subtitle, icon: Icon, actions }) => {
  return (
    <Centered>
      <Stack alignItems='center' gap={2}>
        <Icon color='disabled' style={{ fontSize: '5rem' }} />
        {title && <Title>{title}</Title>}
        {subtitle && (
          <Typography variant='subtitle2' color='GrayText'>
            {subtitle}
          </Typography>
        )}
        {children}
        {actions && (
          <Stack direction='row' alignItems='center' gap={2}>
            {actions}
          </Stack>
        )}
      </Stack>
    </Centered>
  )
}

export default EmptyPageInfo
