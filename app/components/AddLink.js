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
const renderField = ({ input, type, meta: { touched, error, warning }, ...rest }) => (
  <div>
    <input
      {...input}
      type={type}
      {...rest}
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
  clearClipboard: () => void,
  onAbort: () => void
};

class AddLink extends Component<AddLinkProps> { // & FormProps
  constructor() {
    super();

    (this: any).handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentWillMount() {
    this.props.requestClipboard();
  }
  componentWillUnmount() {
    this.props.clearClipboard();
  }

  handleKeyDown(event) {
    if (event.key === 'Escape') {
      this.props.onAbort();
    }
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
            onKeyDown={this.handleKeyDown}
          />
        </form>
      </div>
    );
  }
}

function mapStateToProps(state) {
  if (isUrlValid(state.userInterface.clipboard)) {
    return {
      initialValues: { url: state.userInterface.clipboard }
    };
  }

  return {};
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators({ requestClipboard, clearClipboard }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({ form: 'addLink', enableReinitialize: true })(AddLink));
