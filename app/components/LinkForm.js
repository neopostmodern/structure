// @flow

import React from 'react';
import { Field, reduxForm } from 'redux-form';

import formStyles from './NoteForm.css';
import buttonStyles from '../styles/button.scss';

const LINK_FORM_NAME:string = 'link_form';

// todo: can't export; break build?
class LinkForm extends React.Component {
  props: {
    metadata?: {
      titles?: [string]
    },
    handleSubmit: () => void
  }

  static defaultProps = { metadata: {} }

  render() {
    let titles;
    if (this.props.metadata && this.props.metadata.titles) {
      titles = (
        <div style={{ marginBottom: '2rem' }}>
          {this.props.metadata.titles.map((title, index) => (
            <button
              type="button"
              className={buttonStyles.textButton}
              style={{ fontStyle: 'italic', fontSize: '80%' }}
              key={index}
              onClick={() => this.props.change('name', title)}
            >
              {title}
            </button>
          ))}
        </div>
      );
    }

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
      {titles}
      <Field
        name="description"
        component="textarea"
        className={formStyles.description}
      />
    </form>);
  }
}

export default reduxForm({ form: LINK_FORM_NAME })(LinkForm);
