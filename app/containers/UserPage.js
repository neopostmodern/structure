import React from 'react';
import { Link } from 'react-router-dom';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';

import menuStyles from '../styles/menu.scss';
import userPageStyles from './UserPage.scss';

// todo: create universal loading/not-loading type and inherit?
type credentialsLoadingType = {
  loading: true
};
type credentialsType = {
  loading: false,
  credentials: {
    bookmarklet: string
  }
};

class UserPage extends React.Component {
  props: {
    requestNewCredential: (purpose: string) => void,
    revokeCredential: (purpose: string) => void,
  } & credentialsLoadingType | credentialsType;

  static bookmarkletCode(token) {
    return `javascript:void(open('http://localhost:3001/bookmarklet?token=${token}&url='+encodeURIComponent(location.href)))`;
  }

  requestNewCredential(purpose) {
    this.props.requestNewCredential(purpose);
  }

  revokeCredential(purpose) {
    this.props.revokeCredential(purpose);
  }

  renderRequestOrRevoke(credentials, purpose) {
    if (credentials[purpose]) {
      return (
        <button type="button" onClick={this.revokeCredential.bind(this, 'bookmarklet')}>
          Revoke token
        </button>
      );
    }

    return (
      <button type="button" onClick={this.requestNewCredential.bind(this, 'bookmarklet')}>
        Request token
      </button>
    );
  }

  renderCredentials() {
    if (this.props.loading) {
      return (
        <i>
          Loading...
        </i>
      );
    }

    const { credentials } = this.props.user;
    return (
      <div className={userPageStyles.credentials}>
        <div className={userPageStyles.credentials__purpose}>
          Bookmarklet
        </div>
        <div className={userPageStyles.credentials__value}>
          {credentials.bookmarklet
            ? <input type="text" readOnly={true} value={UserPage.bookmarkletCode(credentials.bookmarklet)} />
            : <i>No token yet.</i>}
        </div>
        <div className={userPageStyles['credentials__request-revoke']}>
          {this.renderRequestOrRevoke(credentials, 'bookmarklet')}
        </div>
      </div>
    );
  }

  render() {
    console.log(this.props, this.props.loading, this.props.user);

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
          <h2>Credentials</h2>
          {this.renderCredentials()}
          <h2>About</h2>
          You are using Structure {VERSION}<br/>
          Your data is stored on the backend server <i>{BACKEND_URL}</i><br />
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

// todo: create common fragment for credentials
const USER_QUERY = gql`
  query user {
    currentUser { 
      _id
      
      credentials {
        bookmarklet
      }
    }
  }
`;
const REQUEST_NEW_CREDENTIAL_MUTATION = gql`
  mutation RequestNewCredential($purpose: String!) {
    requestNewCredential(purpose: $purpose) {
      _id

      credentials {
        bookmarklet
      }
    }
  }
`;
const REVOKE_CREDENTIAL_MUTATION = gql`
  mutation RevokeCredential($purpose: String!) {
    revokeCredential(purpose: $purpose) {
      _id

      credentials {
        bookmarklet
      }
    }
  }
`;
const withData = graphql(USER_QUERY, {
  options: ({ match }) => ({
    fetchPolicy: 'cache-and-network',
    variables: { tagId: match.params.tagId }
  }),
  props: ({ data: { loading, currentUser, refetch } }) => ({
    loading,
    currentUser,
    user: currentUser,
    refetch
  }),
});
const withRequestNewCredential = graphql(REQUEST_NEW_CREDENTIAL_MUTATION, {
  props: ({ mutate }) => ({
    requestNewCredential: (purpose) => mutate({ variables: { purpose } })
  })
});
const withRevokeCredential = graphql(REVOKE_CREDENTIAL_MUTATION, {
  props: ({ mutate }) => ({
    revokeCredential: (purpose) => mutate({ variables: { purpose } })
  })
});

export default compose(withData, withRequestNewCredential, withRevokeCredential)(UserPage);
