// @flow

import React from 'react';
import { Field, formValueSelector, reduxForm } from 'redux-form';
import { connect } from 'react-redux';

import MarkedTextarea from './MarkedTextarea';

import formStyles from './NoteForm.scss';
import LinkNameField from './LinkNameField';

const LINK_FORM_NAME:string = 'link_form';

type LinkFormProps = {
  metadata?: {
    titles: Array<string>
  },
  metadataLoading: boolean,
  handleSubmit: () => void,
  onRequestMetadata: () => void
};

// todo: can't export; break build?
class LinkForm extends React.Component<LinkFormProps, void> {
  static defaultProps = { metadata: undefined }

  render() {
    return (
      <form onSubmit={this.props.handleSubmit} className={formStyles.form}>
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
          component={LinkNameField}
          onRequestMetadata={this.props.onRequestMetadata}
          metadata={this.props.metadata}
          metadataLoading={this.props.metadataLoading}
        />

        <div className={formStyles.subheader}>Description / notes</div>
        <Field
          name="description"
          component={MarkedTextarea}
          className={formStyles.description}
        />
      </form>
    );
  }
}

// todo: this most likely has a very negative impact on performance. value access should be delegated to sub-components.
const selector = formValueSelector(LINK_FORM_NAME);
const mapStateToProps = (state) => ({
  urlValue: selector(state, 'url')
});

export default connect(mapStateToProps)(reduxForm({ form: LINK_FORM_NAME })(LinkForm));
