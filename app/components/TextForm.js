// @flow
import React from 'react';
import { Field, reduxForm } from 'redux-form';

import formStyles from './NoteForm.scss';
import MarkedTextarea from './MarkedTextarea';

// todo: can't export; break build?
class TextForm extends React.Component {
  render() {
    return (
      <form onSubmit={this.props.handleSubmit} className={formStyles.form}>
        <Field
          name="name"
          component="input"
          type="text"
          className={formStyles.name}
        />

        <Field
          name="description"
          component={MarkedTextarea}
          className={formStyles.description}
        />
      </form>
    );
  }
}

export default reduxForm()(TextForm);
