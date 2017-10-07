// @flow

import React from 'react';
import { Field, formValueSelector, reduxForm } from 'redux-form';
import { connect } from 'react-redux';

import MarkedTextarea from './MarkedTextarea';

import formStyles from './NoteForm.css';
import buttonStyles from '../styles/button.scss';

const LINK_FORM_NAME:string = 'link_form';

// todo: can't export; break build?
class LinkForm extends React.Component {
  props: {
    metadata?: {
      titles?: [string]
    },
    handleSubmit: () => void,
    descriptionFieldValue: string
  }

  static defaultProps = { metadata: {} }

  render() {
    let titles;
    if (this.props.metadata && this.props.metadata.titles) {
      titles = (
        <div style={{ marginBottom: '2rem' }}>
          <div className={formStyles.subheader}>Title suggestions</div>
          {this.props.metadata.titles.map((title, index) => (
            <button
              type="button"
              className={buttonStyles.textButton}
              style={{ fontStyle: 'italic', fontSize: '80%', display: 'block', marginTop: '0.3em' }}
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
        style={{ width: 'calc(100% - 2.5rem)' }}
      />
      <button
        type="button"
        style={{ textAlign: 'center', width: '1.5rem', height: '1.5rem', marginLeft: '1rem' }}
        onClick={() => window.open(this.props.urlValue, '_blank', 'noopener, noreferrer')}
      >
        🡭
      </button>
      <Field
        name="name"
        component="input"
        type="text"
        className={formStyles.name}
      />
      {titles}

      <div className={formStyles.subheader}>Description / notes</div>
      <Field
        name="description"
        component={MarkedTextarea}
        className={formStyles.description}
      />
    </form>);
  }
}

// todo: this most likely has a very negative impact on performance. value access should be delegated to sub-components.
const selector = formValueSelector(LINK_FORM_NAME);
const mapStateToProps = (state) => ({
  urlValue: selector(state, 'url')
});

export default connect(mapStateToProps)(reduxForm({ form: LINK_FORM_NAME })(LinkForm));
