import {
  BackspaceOutlined as ClearIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import {
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
} from '@mui/material';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../reducers';
import { UserInterfaceStateType } from '../reducers/userInterface';
import { changeSearchQuery } from '../actions/userInterface';

const SearchTest = () => {
  const { searchQuery } = useSelector<RootState, UserInterfaceStateType>(
    (state) => state.userInterface,
  );

  const dispatch = useDispatch();

  const onChangeSearchQuery = useCallback(
    (value: string): void => {
      dispatch(changeSearchQuery(value));
    },
    [dispatch],
  );
  const handleClearSearchText = useCallback(
    (): void => onChangeSearchQuery(''),
    [onChangeSearchQuery],
  );

  return (
    <FormControl variant="standard" sx={{ width: '100%' }}>
      <InputLabel>Search</InputLabel>
      <Input
        onChange={({ target: { value } }): void => {
          onChangeSearchQuery(value);
        }}
        value={searchQuery}
        endAdornment={
          <InputAdornment position="end">
            {searchQuery.length > 0 ? (
              <IconButton
                aria-label="clear text search filter"
                onClick={handleClearSearchText}
                edge="end"
              >
                <ClearIcon />
              </IconButton>
            ) : (
              <SearchIcon />
            )}
          </InputAdornment>
        }
      />
    </FormControl>
  );
};

export default SearchTest;
