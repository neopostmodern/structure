import React from 'react';
import { Field, reduxForm } from 'redux-form';

const InlineTagForm = props => {
  const { handleSubmit, pristine, submitting } = props;
  return (
    <form onSubmit={handleSubmit} style={{ position: 'relative' }}>
      <Field
        name="name"
        component="input"
        type="text"
        placeholder="tag name"
      />
    </form>
  );
};

export default reduxForm({
  form: 'inline-tag' // a unique identifier for this form
})(InlineTagForm);
