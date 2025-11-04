import {
  BackspaceOutlined as ClearIcon,
  Search as SearchIcon,
} from '@mui/icons-material'
import {
  CircularProgress,
  FormControl,
  FormHelperText,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
} from '@mui/material'
import { debounce } from 'lodash'
import { useCallback, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { changeSearchQuery } from '../actions/userInterface'
import { RootState } from '../reducers'
import { UserInterfaceStateType } from '../reducers/userInterface'
import { SHORTCUTS } from '../utils/keyboard'
import TooltipWithShortcut from './TooltipWithShortcut'

export const SearchField = ({
  inputRef,
  noteCountsWithSearchMatchesString,
}: {
  inputRef: React.Ref<HTMLInputElement>
  noteCountsWithSearchMatchesString: string | null
}) => {
  const dispatch = useDispatch()
  const { searchQuery } = useSelector<RootState, UserInterfaceStateType>(
    (state) => state.userInterface,
  )
  const [displayedSearchQuery, setDisplayedSearchQuery] = useState(searchQuery)

  const debouncedSearchQueryUpdate = useMemo(
    () =>
      debounce((searchQueryValue) => {
        dispatch(changeSearchQuery(searchQueryValue))
      }, 200),
    [dispatch, changeSearchQuery],
  )

  const onChangeSearchQuery = useCallback(
    ({ target: { value } }: { target: { value: string } }): void => {
      setDisplayedSearchQuery(value)
      debouncedSearchQueryUpdate(value)
    },
    [dispatch],
  )
  const handleClearSearchText = useCallback(
    (): void => onChangeSearchQuery({ target: { value: '' } }),
    [onChangeSearchQuery],
  )

  let adornment = <SearchIcon />
  if (displayedSearchQuery !== searchQuery) {
    adornment = <CircularProgress color='inherit' disableShrink size='1.2em' />
  } else if (displayedSearchQuery.length > 0) {
    adornment = (
      <IconButton
        aria-label='clear text search filter'
        onClick={handleClearSearchText}
        edge='end'
      >
        <ClearIcon />
      </IconButton>
    )
  }

  return (
    <TooltipWithShortcut
      title=''
      shortcut={SHORTCUTS.SEARCH}
      adjustVerticalDistance={-30}
      disableFocusListener
    >
      <FormControl variant='standard' sx={{ width: '100%' }}>
        <InputLabel>Search</InputLabel>
        <Input
          onChange={onChangeSearchQuery}
          value={displayedSearchQuery}
          inputRef={inputRef}
          endAdornment={
            <InputAdornment position='end'>{adornment}</InputAdornment>
          }
        />
        <FormHelperText sx={{ textAlign: 'right' }}>
          {noteCountsWithSearchMatchesString || <>&nbsp;</>}
        </FormHelperText>
      </FormControl>
    </TooltipWithShortcut>
  )
}
