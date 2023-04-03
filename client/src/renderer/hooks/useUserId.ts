import { useContext } from 'react';
import UserIdContext from '../utils/UserIdContext';

const useUserId = () => useContext(UserIdContext);

export default useUserId;
