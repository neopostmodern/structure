import React from 'react';
import { Link } from 'react-router-dom';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import menuStyles from '../styles/menu.scss';
import userPageStyles from './UserPage.scss';
import { setBackendUrl } from '../actions/configuration';
import { bookmarkletCode, rssFeedUrl } from '../../util/linkGenerator';

// todo: create universal loading/not-loading type and inherit?
type credentialsLoadingType = {
  loading: true
};
type credentialsType = {
  loading: false,
  credentials: {
    bookmarklet: string,
    rss: string
  }
};

type configurationType = {
  backendUrl: string,
  backendUrlDefault: string
};

type UserPageProps = {
  requestNewCredential: (purpose: string) => void,
  revokeCredential: (purpose: string) => void
} | credentialsLoadingType | credentialsType | configurationType;

class UserPage extends React.Component<UserPageProps> {
  constructor() {
    super();

    this.setBackendUrl = this.setBackendUrl.bind(this);
  }

  requestNewCredential(purpose) {
    this.props.requestNewCredential(purpose);
  }

  revokeCredential(purpose) {
    this.props.revokeCredential(purpose);
  }

  setBackendUrl() {
    this.props.setBackendUrl(document.getElementById('configuration__backend-url').value);
  }

  renderRequestOrRevoke(credentials, purpose) {
    if (credentials[purpose]) {
      return (
        <button type="button" onClick={this.revokeCredential.bind(this, purpose)}>
          Revoke token
        </button>
      );
    }

    return (
      <button type="button" onClick={this.requestNewCredential.bind(this, purpose)}>
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
      <>
        <div className={userPageStyles['settings-table']}>
          <div className={userPageStyles['settings-table__purpose']}>
          Bookmarklet
          </div>
          <div className={userPageStyles['settings-table__value']}>
            {credentials.bookmarklet
              ? <input type="text" readOnly value={bookmarkletCode(this.props.backendUrl, credentials.bookmarklet)} />
              : <i>No token yet.</i>}
          </div>
          <div className={userPageStyles['settings-table__action']}>
            {this.renderRequestOrRevoke(credentials, 'bookmarklet')}
          </div>
        </div>
        <div className={userPageStyles['settings-table']}>
          <div className={userPageStyles['settings-table__purpose']}>
          RSS-Feed
          </div>
          <div className={userPageStyles['settings-table__value']}>
            {credentials.rss
              ? <input type="text" readOnly value={rssFeedUrl(this.props.backendUrl, credentials.rss)} />
              : <i>No token yet.</i>}
          </div>
          <div className={userPageStyles['settings-table__action']}>
            {this.renderRequestOrRevoke(credentials, 'rss')}
          </div>
        </div>
      </>
    );
  }

  render() {
    const { backendUrl, backendUrlDefault } = this.props;

    return (
      <div>
        <div className={menuStyles.menu}>
          <Link to="/tags">
            My tags
          </Link>
,&nbsp;
          <a onClick={() => alert('This feature is not yet available')} className={menuStyles.disabled}>
            Export my data
          </a>
,&nbsp;
          <a onClick={() => alert('This feature is not yet available')} className={menuStyles.disabled}>
            Delete my account
          </a>
        </div>
        <div style={{ marginTop: '2rem' }}>
          <h2>Credentials</h2>
          {this.renderCredentials()}

          <h2>Configuration</h2>
          <div className={userPageStyles['settings-table']}>
            <div className={userPageStyles['settings-table__purpose']}>
              Server
            </div>
            <div className={userPageStyles['settings-table__value']}>
              <input id="configuration__backend-url" type="text" defaultValue={backendUrl} placeholder={backendUrlDefault} />
            </div>
            <div className={userPageStyles['settings-table__action']}>
              <button type="button" onClick={this.setBackendUrl}>
                Update
              </button>
            </div>
          </div>
          <div className={userPageStyles['settings-table__comment']}>
            The backend server is in charge of storing your data (username, notes, tags, et cetera).
            You must trust this server (and/or the operator of it), since your data is only
            encrypted during the transport to the server, not on the server. This means the operator
            of the server can (theoretically) read and/or modify all your data.
            <br />
            Modifying the backend server URL causes a restart.
            {' '}
            <b>Setting an invalid value might make it impossible to restart the app.</b>
            {' '}
            Data is not migrated automatically when switching backend servers.
            <br />
            Default:
            {' '}
            {backendUrlDefault}
          </div>

          <h2>About</h2>
          You are using Structure
          {' '}
          {VERSION}
          <br />
          <br />
          Structure uses (amongst other things) Electron, React, Redux, Redux-Forms, Apollo/GraphQL,
          Lunchtype22/
          <wbr />
          Lunchtype25
          <br />
          Written in JSX (stage-0, flow) and SCSS transpiled and bundled by Babel and Webpack
          <br />
          The backend uses express, mongoose, passport.js on node.js (rollup + Babel) with mongoDB
          <br />
          <br />
          Find the Structure source code
          {' '}
          <a href="https://github.com/neopostmodern/structure" target="_blank" rel="noopener noreferrer">on GitHub</a>
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
        rss
      }
    }
  }
`;
const REQUEST_NEW_CREDENTIAL_MUTATION = gql`
  mutation RequestNewCredential($purpose: String!) {
    requestNewCredential(purpose: $purpose) {
      _id

      credentials {
        rss
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
        rss
        bookmarklet
      }
    }
  }
`;
const withData = graphql(USER_QUERY, {
  options: () => ({
    fetchPolicy: 'cache-and-network'
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

export default compose(
  withData,
  withRequestNewCredential,
  withRevokeCredential,
  connect(
    ({ configuration: { backendUrl, backendUrlDefault } }) => ({ backendUrl, backendUrlDefault }),
    (dispatch) => bindActionCreators({ setBackendUrl }, dispatch)
  )
)(UserPage);
