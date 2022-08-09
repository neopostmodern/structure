import { FC } from 'react';
import { useLocation } from 'react-router';
import Centered from '../components/Centered';
import ComplexLayout from './ComplexLayout';

const MissingPage: FC = () => {
  const location = useLocation();
  return (
    <ComplexLayout>
      <Centered>No idea where to find {location.pathname}</Centered>
    </ComplexLayout>
  );
};

export default MissingPage;
