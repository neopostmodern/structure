// @flow
import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
// import type { FormProps } from 'redux-form';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import styles from './AddLink.css';
import { clearClipboard, requestClipboard } from '../actions/userInterface';

const isUrlValid = (url) => url && url.indexOf('http') === 0;
const urlValidator = (value) => (isUrlValid(value)
  ? undefined
  : 'Did you forget the protocol? (e.g. https://)'
);
const renderField = ({ input, autoFocus, placeholder, className, type, meta: { touched, error, warning } }) => (
  <div>
    <input
      {...input}
      autoFocus={autoFocus}
      placeholder={placeholder}
      type={type}
      className={className}
    />
    {touched && (
      (error &&
        <div style={{ marginTop: '0.5em', color: 'darkred' }}>
          {error}
        </div>
      ) ||
      (warning &&
        <span>{warning}</span>
      )
    )}
  </div>
);

type AddLinkProps = {
  requestClipboard: () => void,
  clearClipboard: () => void
};

class AddLink extends Component<AddLinkProps> { // & FormProps
  componentWillMount() {
    this.props.requestClipboard();
  }
  componentWillUnmount() {
    this.props.clearClipboard();
  }

  render() {
    return (
      <div style={{ paddingTop: '20vh' }}>
        <form onSubmit={this.props.handleSubmit}>
          <Field
            name="url"
            component={renderField}
            autoFocus
            type="text"
            className={styles.urlInput}
            placeholder="URL here"
            validate={urlValidator}
          />
        </form>
      </div>
    );
  }
}

function mapStateToProps(state) {
  if (isUrlValid(state.userInterface.clipboard)) {
    return {
      initialValues: {url: state.userInterface.clipboard}
    };
  }

  return {};
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators({ requestClipboard, clearClipboard }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({ form: 'addLink', enableReinitialize: true })(AddLink));
