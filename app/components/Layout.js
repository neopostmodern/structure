//@flow
import React, { Component } from 'react';
import { gql, graphql } from 'react-apollo';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { requestLogin } from '../actions/userInterface';
import Centered from '../components/Centered';

import styles from './Layout.css';

export class Layout extends Component {
  props: {
    path: string,

    requestLogin: () => void,
    user: {
      loggingIn: boolean,
      loading: boolean,
      name?: string,
      refetch: () => void
    }
  };

  constructor() {
    super();

    this.openLoginModal = this.openLoginModal.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.user.loggingIn !== prevProps.user.loggingIn) {
      this.props.user.refetch();
    }
  }

  openLoginModal() {
    this.props.requestLogin();
  }

  render() {
    let headline = "Structure";
    if (this.props.path !== "/") {
      headline = <span><Link to="/">/</Link>{this.props.path.substr(1)}</span>;
    }

    let content;
    let userIndicator;

    if (this.props.user.loggingIn) {
      content = <Centered text="Logging in..." />;
    } else if (this.props.user.loading) {
      content = <Centered text="Loading..."/>;
    } else if (this.props.user.name) {
      content = this.props.children;
      userIndicator = <b>{this.props.user.name}.</b>;
    } else {
      content = <Centered>
        <button onClick={this.openLoginModal} className={styles.loginButton}>Log in</button>
      </Centered>;
    }

    return (
      <div>
        <div className={styles.container}>
          <div style={{display: 'flex'}}>
            <h2>{headline}</h2>
            <div style={{marginLeft: 'auto'}}>
              {userIndicator}
            </div>
          </div>
          {content}
        </div>
      </div>
    );
  }
}


const PROFILE_QUERY = gql`
  query CurrentUserForLayout {
    currentUser {
      name
    }
  }
`;

const withData = graphql(PROFILE_QUERY, {
  options: {
    fetchPolicy: 'cache-and-network',
  },
  props: ({ data: { loading, currentUser, refetch }, ownProps }) => ({
    user: Object.assign({}, ownProps.user, {
      loading,
      name: currentUser && currentUser.name,
      refetch
    })
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

export default connect(mapStateToProps, mapDispatchToProps)(withData(Layout));
