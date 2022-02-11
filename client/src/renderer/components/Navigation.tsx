import { Add, ArrowBack, ArrowForward } from '@mui/icons-material';
import { IconButton } from '@mui/material';
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
      <TitleLink to="/">Structure</TitleLink>
      <HistoryTools>
        <IconButton
          onClick={() => dispatch(goBack())}
          disabled={lengthOfPast <= 0}
        >
          <ArrowBack />
        </IconButton>
        <LastVisitedNotes />
        <IconButton
          onClick={() => dispatch(goForward())}
          disabled={lengthOfFuture <= 0}
        >
          <ArrowForward />
        </IconButton>
      </HistoryTools>
      <IconButton component={Link} to="/notes/add">
        <Add style={{ fontSize: '3rem' }} />
      </IconButton>
    </TitleLine>
  );
};

export default Navigation;
