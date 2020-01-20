// @flow

import React from 'react';
import { Field, reduxForm } from 'redux-form';

import MarkedTextarea from './MarkedTextarea';

import formStyles from './NoteForm.scss';
import LinkNameField from './fields/LinkNameField';
import UrlField from './fields/UrlField';

const LINK_FORM_NAME: string = 'link_form';

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
          component={UrlField}
        />

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

export default reduxForm({ form: LINK_FORM_NAME })(LinkForm);
