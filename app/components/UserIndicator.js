// @flow
import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { requestLogin } from '../actions/userInterface';

type UserIndicatorProps = {
  requestLogin: () => void,
  loggingIn: boolean,

  loading: boolean,
  name: string,
  refetch: () => void
};

export class UserIndicator extends Component<UserIndicatorProps> {
  constructor() {
    super();

    this.openLoginModal = this.openLoginModal.bind(this);
  }

  openLoginModal() {
    this.props.requestLogin();
  }

  componentDidUpdate(prevProps) {
    if (this.props.loggingIn !== prevProps.loggingIn) {
      this.props.refetch();
    }
  }

  render() {
    console.log(this.props);
    if (this.props.loggingIn) {
      return <i>Logging in...</i>;
    } else if (this.props.loading) {
      return <i>Loading...</i>;
    } else if (this.props.name) {
      return <b>{this.props.name}.</b>;
    }
    return <button onClick={this.openLoginModal}>Log in</button>;
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
  props: ({ data: { loading, currentUser, refetch } }) => ({
    loading,
    name: currentUser && currentUser.name,
    refetch
  }),
});


function mapStateToProps(state) {
  return { loggingIn: state.userInterface.loggingIn };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ requestLogin }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(withData(UserIndicator));
