import { Link as MaterialLink, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { UserQuery } from '../generated/graphql';
import { dateToShortISO8601 } from '../utils/textHelpers';

const UserInfo = ({
  user,
}: {
  user: NonNullable<UserQuery['currentUser']>;
}) => {
  return (
    <>
      <Typography variant="h2">{user.name}</Typography>
      Registered {dateToShortISO8601(user.createdAt)}
      <br />
      Authenticated via {user.authenticationProvider || 'unknown'}
      <br />
      <MaterialLink component={Link} to="/tags">
        Manage my tags
      </MaterialLink>
    </>
  );
};

export default UserInfo;
