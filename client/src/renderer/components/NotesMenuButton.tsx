import { Check } from '@mui/icons-material'
import {
  Badge,
  Button,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material'
import { MouseEvent, useCallback, useState } from 'react'
import styled from 'styled-components'
import { useIsMobileLayout } from '../utils/mediaQueryHooks'

const DesktopButton = styled(Button)`
  max-width: 100%;
`
const ButtonLabel = styled.div`
  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

type NotesMenuButtonProps<T> = {
  options: Array<T>
  optionToName: (option: T) => string
  onSelectOption: (option: T) => void
  value: T
  defaultValue?: T
} & ({ icon: JSX.Element } | { icons: Array<JSX.Element> })

const NotesMenuButton = <T,>({
  options,
  optionToName,
  onSelectOption,
  value,
  defaultValue,
  ...optionalProps
}: NotesMenuButtonProps<T>) => {
  const isMobileLayout = useIsMobileLayout()

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  const handleClose = useCallback(() => {
    setAnchorEl(null)
  }, [setAnchorEl])
  const handleMenuItemClick = useCallback(
    (event: MouseEvent<HTMLLIElement>) => {
      const option = event.currentTarget.dataset.value as T
      onSelectOption(option)
    },
    [onSelectOption],
  )

  const valueIndex = options.indexOf(value)
  const buttonIcon =
    'icons' in optionalProps
      ? optionalProps.icons[valueIndex]
      : optionalProps.icon

  return (
    <>
      {isMobileLayout ? (
        <Badge
          variant='dot'
          color='primary'
          overlap='circular'
          invisible={defaultValue ? value === defaultValue : true}
        >
          <IconButton onClick={(event) => setAnchorEl(event.currentTarget)}>
            {buttonIcon}
          </IconButton>
        </Badge>
      ) : (
        <DesktopButton
          startIcon={buttonIcon}
          onClick={(event) => setAnchorEl(event.currentTarget)}
          size='huge'
        >
          <ButtonLabel>{optionToName(value)}</ButtonLabel>
        </DesktopButton>
      )}
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClick={() => {
          handleClose()
        }}
        onClose={handleClose}
      >
        {Object.values(options).map((option: T, optionIndex) => (
          <MenuItem
            key={option as string}
            onClick={handleMenuItemClick}
            data-value={option}
          >
            {option === value && (
              <ListItemIcon>
                <Check />
              </ListItemIcon>
            )}
            <ListItemText inset={option !== value}>
              {optionToName(option)}
            </ListItemText>
            {'icons' in optionalProps && (
              <ListItemIcon sx={{ marginLeft: 2 }}>
                {optionalProps.icons[optionIndex]}
              </ListItemIcon>
            )}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

export default NotesMenuButton
