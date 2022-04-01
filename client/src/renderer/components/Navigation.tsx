import { Add, ArrowBack, ArrowForward } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { goBack, goForward } from 'redux-first-history';
import styled from 'styled-components';
import { RootState } from '../reducers';
import { HistoryStateType } from '../reducers/history';
import { breakPointMobile } from '../styles/constants';
import LastVisitedNotes from './LastVisitedNotes';

const TitleLine = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const TitleLink = styled(Link)`
  font-size: 2.5rem;
  font-weight: bold;
  color: inherit;

  &:not(:hover) {
    text-decoration: none;
  }

  @media (max-width: ${breakPointMobile}) {
    font-size: 15vw;
  }
`;

const HistoryTools = styled.div`
  align-self: center;
  display: flex;
`;

const Navigation = () => {
  const dispatch = useDispatch();
  const { lengthOfPast, lengthOfFuture } = useSelector<
    RootState,
    HistoryStateType
  >((state) => state.history);

  return (
    <TitleLine>
      <Tooltip title="Back to homepage">
        <TitleLink to="/">Structure</TitleLink>
      </Tooltip>
      <HistoryTools>
        <Tooltip title="Navigate back">
          <IconButton
            onClick={() => dispatch(goBack())}
            disabled={lengthOfPast <= 0}
          >
            <ArrowBack />
          </IconButton>
        </Tooltip>
        <LastVisitedNotes />
        <Tooltip title="Navigate forward">
          <IconButton
            onClick={() => dispatch(goForward())}
            disabled={lengthOfFuture <= 0}
          >
            <ArrowForward />
          </IconButton>
        </Tooltip>
      </HistoryTools>
      <Tooltip title="Add new note">
        <IconButton component={Link} to="/notes/add">
          <Add style={{ fontSize: '3rem' }} />
        </IconButton>
      </Tooltip>
    </TitleLine>
  );
};

export default Navigation;
