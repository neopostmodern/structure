import {
  BackspaceOutlined as ClearIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import {
  CircularProgress,
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
} from '@mui/material';
import { debounce } from 'lodash';
import { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../reducers';
import { UserInterfaceStateType } from '../reducers/userInterface';
import { changeSearchQuery } from '../actions/userInterface';

const SearchTest = () => {
  const { searchQuery } = useSelector<RootState, UserInterfaceStateType>(
    (state) => state.userInterface,
  );

  const [displayedSearchQuery, setDisplayedSearchQuery] = useState(searchQuery);

  const dispatch = useDispatch();
  const debouncedSearchQueryUpdate = useMemo(
    () =>
      debounce((searchQueryValue) => {
        console.log('debounced change', searchQueryValue);
        dispatch(changeSearchQuery(searchQueryValue));
      }, 200),
    [dispatch, changeSearchQuery],
  );

  const onChangeSearchQuery = useCallback(
    ({ target: { value } }: { target: { value: string } }): void => {
      console.log('change', value);
      setDisplayedSearchQuery(value);
      debouncedSearchQueryUpdate(value);
    },
    [dispatch],
  );
  const handleClearSearchText = useCallback(
    (): void => onChangeSearchQuery({ target: { value: '' } }),
    [onChangeSearchQuery],
  );

  let adornment = <SearchIcon />;
  if (displayedSearchQuery !== searchQuery) {
    adornment = <CircularProgress color="inherit" disableShrink size="1.2em" />;
  } else if (displayedSearchQuery.length > 0) {
    adornment = (
      <IconButton
        aria-label="clear text search filter"
        onClick={handleClearSearchText}
        edge="end"
      >
        <ClearIcon />
      </IconButton>
    );
  }

  return (
    <FormControl variant="standard" sx={{ width: '100%' }}>
      <InputLabel>Search</InputLabel>
      <Input
        onChange={onChangeSearchQuery}
        value={displayedSearchQuery}
        endAdornment={
          <InputAdornment position="end">{adornment}</InputAdornment>
        }
      />
    </FormControl>
  );
};

export default SearchTest;
