// @flow
import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { requestLogin } from '../actions/userInterface';
import Centered from './Centered';
import config from '../config';

import styles from './Layout.scss';

type versionsLoadingType = {
  loading: true
};
type versionsReadyType = {
  loading: false,
  minimum: number,
  recommended?: number
};
type versionsInformationType = {
  refetch: () => void
} & (versionsLoadingType | versionsReadyType);
type LayoutProps = {
  path: string,

  requestLogin: () => void,
  user: {
    loggingIn: boolean,
    loading: boolean,
    name: ?string,
    refetch: () => void
  },
  versions: versionsInformationType
};

export class Layout extends Component<LayoutProps> {
  constructor() {
    super();

    this.openLoginModal = this.openLoginModal.bind(this);
  }

  componentDidUpdate(prevProps: LayoutProps) {
    if (this.props.user.loggingIn !== prevProps.user.loggingIn) {
      this.props.user.refetch();
    }
  }

  openLoginModal() {
    this.props.requestLogin();
  }

  render() {
    let headline = 'Structure';
    if (this.props.path !== '/') {
      headline = (
        <span>
          <Link to="/">/</Link>
          {this.props.path.substr(1)}
        </span>
      );
    }

    let content;
    let userIndicator;

    if (this.props.user.loggingIn) {
      content = <Centered text="Logging in..." />;
    } else if (this.props.user.loading) {
      content = <Centered text="Loading..." />;
    } else if (this.props.user.name) {
      content = this.props.children;
      userIndicator = (
        <Link to="/me" className={styles.username}>
          {this.props.user.name}
.
        </Link>
      );
    } else {
      content = (
        <Centered>
          <button onClick={this.openLoginModal} className={styles.loginButton}>Log in</button>
        </Centered>
      );
    }

    let versionMarks;
    if (this.props.versions.loading) {
      versionMarks = <i>Checking for new versions...</i>;
    } else if (this.props.versions.minimum > config.apiVersion) {
      versionMarks = (
        <div className={`${styles.version} ${styles.warning}`}>
          <div className={styles.headline}>Your Structure is obsolete.</div>
          <small>
          This Structure uses API version
            {' '}
            {config.apiVersion}
,
          but
            {' '}
            {this.props.versions.minimum}
            {' '}
is required on the server.
            <br />
          Functionality is no longer guaranteed,
          use at your own risk or
            {' '}
            <a href={config.releaseUrl} target="_blank" rel="noopener noferrer">update now</a>
.
          </small>
        </div>
      );
    } else if (this.props.versions.recommended > config.apiVersion) {
      versionMarks = (
        <div className={`${styles.version} ${styles.notice}`}>
          <div className={styles.headline}>Your Structure is outdated.</div>
          <small>
          This Structure uses API version
            {' '}
            {config.apiVersion}
,
          but
            {' '}
            {this.props.versions.recommended}
            {' '}
is recommended by the server.
            <br />
          You are probably safe for now but try to
            {' '}
            <a href={config.releaseUrl} target="_blank" rel="noopener noferrer">update soon</a>
.
          </small>
        </div>
      );
    }

    return (
      <div>
        <div className={styles.container}>
          <div style={{ display: 'flex' }}>
            <h2 className={styles.title}>{headline}</h2>
            <div style={{ marginLeft: 'auto' }}>
              {userIndicator}
            </div>
          </div>
          {versionMarks}
          {content}
        </div>
      </div>
    );
  }
}


const PROFILE_QUERY = gql`
  query CurrentUserForLayout {
    currentUser {
      _id
      name
    }
  }
`;
const VERSIONS_QUERY = gql`
  query Versions {
    versions {
      minimum
      recommended
    }
  }
`;

const withProfileData = graphql(PROFILE_QUERY, {
  options: {
    fetchPolicy: 'cache-and-network',
  },
  props: ({ data: { loading, currentUser, refetch }, ownProps }) => ({
    user: {
      ...ownProps.user,
      loading,
      name: currentUser && currentUser.name,
      refetch
    }
  }),
});

const withVersionsData = graphql(VERSIONS_QUERY, {
  options: {
    fetchPolicy: 'cache-and-network',
  },
  props: ({ data: { loading, versions, refetch }, ownProps }) => ({
    versions: {
      ...versions,
      loading,
      refetch
    }
  }),
});


function mapStateToProps(state) {
  return {
    path: state.router.location.pathname,
    user: {
      loggingIn: state.userInterface.loggingIn
    }
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ requestLogin }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(withVersionsData(withProfileData(Layout)));
