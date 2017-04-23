// @flow
import React from 'react';
import { Field, reduxForm } from 'redux-form';

import formStyles from './LinkForm.css';

// todo: can't export; break build?
class LinkForm extends React.Component {
  render() {
    return (<form onSubmit={this.props.handleSubmit} className={formStyles.form}>
      <Field
        name="url"
        component="input"
        type="text"
        className={formStyles.url}
      />
      <Field
        name="name"
        component="input"
        type="text"
        className={formStyles.name}
      />
      <Field
        name="description"
        component="textarea"
        className={formStyles.description}
      />
    </form>);
  }
}

export default reduxForm()(LinkForm);
