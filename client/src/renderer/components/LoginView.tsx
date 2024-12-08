import { Button } from '@mui/material';
import React from 'react';
import Centered from './Centered';

interface LoginViewProps {
  openLoginModal: () => void;
}

const LoginView: React.FC<LoginViewProps> = ({ openLoginModal }) => (
  <>
    <b>
      A performance-at-interaction oriented and reasonably stylish bookmarking
      tool for (eventually) everything.
    </b>
    <Centered>
      <Button
        variant="outlined"
        onClick={openLoginModal}
        sx={{ fontSize: '2rem' }}
      >
        Log in
      </Button>
    </Centered>
    Read the documentation on{' '}
    <a href="https://bericht.neopostmodern.com/posts/how-to-structure">
      bericht.neopostmodern.com
    </a>
    .
    {__BUILD_TARGET__ === 'web' ? (
      <>
        {' '}
        Get it on{' '}
        <a href="https://github.com/neopostmodern/structure/releases/latest">
          GitHub
        </a>
        !
      </>
    ) : null}
  </>
);

export default LoginView;
