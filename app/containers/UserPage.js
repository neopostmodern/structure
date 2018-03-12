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
        </div>
        <div style={{marginTop: '2rem'}}>
          Using Structure {VERSION}
        </div>
      </div>
    );
  }
}

export default UserPage;

