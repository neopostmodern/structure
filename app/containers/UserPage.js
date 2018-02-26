import React from 'react';
import { Link } from 'react-router-dom';

import menuStyles from '../styles/menu.scss';

class UserPage extends React.Component {
  render() {
    return (
      <div>
        <div className={menuStyles.menu}>
          <Link to="/tags">
            My tags
          </Link>,&nbsp;
          <a onClick={() => alert('This feature is not yet available')} className={menuStyles.disabled}>
            Export my data
          </a>
          {process.ENV.TARGET === 'web'
            ? (
              <React.Fragment>
                ,&nbsp;
                <a href={`${BACKEND_URL}/logout`}>
                  Logout
                </a>
              </React.Fragment>
            )
            : null}
        </div>
      </div>
    );
  }
}

export default UserPage;

