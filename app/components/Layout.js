// @flow
import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { requestLogin } from '../actions/userInterface';
import Centered from './Centered';

import styles from './Layout.scss';
import LoginView from './LoginView'
import VersionMarks from './VersionMarks'

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
    const {
      path,
      versions,
      user,
      children
    } = this.props;

    let headline = 'Structure';
    if (path !== '/') {
      headline = (
        <span>
          <Link to="/">/</Link>
          {path.substr(1)}
        </span>
      );
    }

    let content;
    let userIndicator;

    if (user.loggingIn) {
      content = <Centered text="Logging in..." />;
    } else if (user.loading) {
      content = <Centered text="Loading..." />;
    } else if (user.name) {
      content = children;
      userIndicator = (
        <Link to="/me" className={styles.username}>
          {user.name}
.
        </Link>
      );
    } else {
      content = <LoginView openLoginModal={this.openLoginModal} />;
    }

    return (
      <div>
        <div className={styles.container}>
          <header>
            <h2 className={styles.title}>{headline}</h2>
            <div className={styles.userIndicator}>
              {userIndicator}
            </div>
          </header>
          <VersionMarks versions={versions} />
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
