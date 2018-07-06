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
          </a>,&nbsp;
          <a onClick={() => alert('This feature is not yet available')} className={menuStyles.disabled}>
            Delete my account
          </a>
        </div>
        <div style={{marginTop: '2rem'}}>
          Structure {VERSION}<br/>
          Data is stored on the backend server <i>{BACKEND_URL}</i><br />
          <br />
          Structure uses (amongst other things) Electron, React, Redux, Redux-Forms, Apollo/GraphQL, Lunchtype22/Lunchtype25<br />
          Written in JSX (stage-0, flow) and SCSS transpiled and bundled by Babel and Webpack<br />
          The backend uses express, mongoose, passport.js on node.js with mongoDB<br />
          <br />
          Find the Structure source code <a href="https://github.com/neopostmodern/structure" target="_blank" rel="noopener noreferrer">on GitHub</a>
        </div>
      </div>
    );
  }
}

export default UserPage;

