import React from 'react';
import { formValues } from 'redux-form';

import buttonStyles from '../styles/button.scss';
import formStyles from './NoteForm.scss';
import urlAnalyzer from '../../util/urlAnalyzer';

type LinkNameFieldProps = {
  url: string,
  metadata?: {
    titles: Array<string>
  },
  metadataLoading: boolean,
  onRequestMetadata: () => void
};

type LinkNameFieldState = {
  nameFocused: false
};

class LinkNameField extends React.Component<LinkNameFieldProps, LinkNameFieldState> {
  static defaultProps = { metadata: undefined }

  constructor() {
    super();

    this.state = {
      nameFocused: false
    };

    this.handleFocusName = this.handleFocusName.bind(this);
    this.handleBlurName = this.handleBlurName.bind(this);
  }

  handleFocusName() {
    this.props.input.onFocus();
    this.props.onRequestMetadata();
    this.setState({
      nameFocused: true
    });
  }
  handleBlurName() {
    this.props.input.onBlur();
    setTimeout(() => this.setState({ nameFocused: false }), 100);
  }

  renderTitles() {
    return (
      <div style={{ marginBottom: '2rem' }}>
        <div className={formStyles.subheader}>Title suggestions</div>
        {this.props.metadataLoading
          ? <i>Loading metadata...</i>
          : this.props.metadata.titles.map((title, index) => (
            <button
              type="button"
              className={buttonStyles.textButton}
              style={{ fontStyle: 'italic', fontSize: '80%', display: 'block', marginTop: '0.3em' }}
              key={index}
              onClick={() => this.props.input.onChange(title)}
            >
              {title}
            </button>
          ))}
      </div>
    );
  }

  render() {
    console.log(this.props, this.state);
    return (
      <React.Fragment>
        <input
          type="text"
          className={formStyles.name}
          autoFocus={this.props.input.value === urlAnalyzer(this.props.url).suggestedName}
          onFocus={this.handleFocusName}
          onBlur={this.handleBlurName}
          onChange={this.props.input.onChange}
          value={this.props.input.value}
          placeholder="Title"
        />
        {this.state.nameFocused ? this.renderTitles() : null}
      </React.Fragment>
    );
  }
}

export default formValues('url')(LinkNameField);
