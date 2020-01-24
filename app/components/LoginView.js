import React from 'react';

import Centered from './Centered';
import styles from './Layout.scss';

export default ({ openLoginModal }: { openLoginModal: () => void }) => (
  <>
    <b>
      A performance-at-interaction oriented and reasonably stylish bookmarking tool for
      (eventually) everything.
    </b>
    <Centered>
      <button type="button" onClick={openLoginModal} className={styles.loginButton}>Log in</button>
    </Centered>
    Read the documentation on
    {' '}
    <a href="https://bericht.neopostmodern.com/posts/how-to-structure">bericht.neopostmodern.com</a>
.
    {process.env.TARGET === 'web'
      ? (
        <>
          {' '}
Get it on
          {' '}
          <a href="https://github.com/neopostmodern/structure/releases/latest">GitHub</a>
!
        </>
      )
      : null}
  </>
);
