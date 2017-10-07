import React from 'react';
import { reduxForm, Field } from 'redux-form';

import styles from './TagForm.scss';

class TagForm extends React.Component {
  render() {
    return (
      <form onSubmit={this.props.handleSubmit}>
        <Field
          name="color"
          component="input"
          type="text"
          className={styles.colorBlock}
          style={{ backgroundColor: this.props.initialValues.color }}
        />
        <br />
        <Field
          name="name"
          component="input"
          type="text"
          className={styles.name}
        />
      </form>
    );
  }
}

export default reduxForm()(TagForm);
