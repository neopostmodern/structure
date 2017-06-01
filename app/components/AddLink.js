// @flow
import React, { Component } from 'react';

import styles from './AddLink.css';
import { reduxForm, Field } from 'redux-form';

const urlValidator = (value) => (value && value.indexOf('http') === 0
  ? undefined
  : 'Did you forget the protocol? (e.g. https://)'
);
const renderField = ({input, autoFocus, placeholder, className, type, meta: {touched, error, warning}}) => (
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

class AddLink extends Component {
  render() {
    return (
      <div style={{paddingTop: '20vh'}}>
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

export default reduxForm({form: 'addLink'})(AddLink)
