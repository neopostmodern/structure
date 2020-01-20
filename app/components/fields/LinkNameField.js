import React from 'react';
import { formValues } from 'redux-form';
import { type FieldProps } from 'redux-form/es/FieldProps.types.js.flow';
import ClassNames from 'classnames';

import buttonStyles from '../../styles/button.scss';
import formStyles from '../NoteForm.scss';
import urlAnalyzer from '../../../util/urlAnalyzer';

type LinkNameFieldProps = {
  url: ?string,
  metadata?: {
    titles: Array<string>
  },
  metadataLoading: boolean,
  onRequestMetadata: () => void
} & FieldProps;

type LinkNameFieldState = {
  nameFocused: boolean,
  nameFocusedAnimation: boolean
};

class LinkNameField extends React.Component<LinkNameFieldProps, LinkNameFieldState> {
  static defaultProps = { metadata: undefined }

  constructor() {
    super();

    this.state = {
      nameFocused: false,
      nameFocusedAnimation: false
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
    setTimeout(
      () => this.setState({ nameFocusedAnimation: true }),
      10
    );
  }

  handleBlurName() {
    this.props.input.onBlur();
    this.setState({ nameFocusedAnimation: false });
    setTimeout(() => this.setState({ nameFocused: false }), 300);
  }

  renderTitles() {
    return (
      <div className={ClassNames(formStyles.suggestions, { [formStyles.suggestionsVisible]: this.state.nameFocusedAnimation })}>
        <div className={formStyles.subheader}>Title suggestions</div>
        {this.props.metadataLoading
          ? <i>Loading metadata...</i>
          : this.props.metadata.titles.map((title, index) => (
            <button
              type="button"
              className={buttonStyles.textButton}
              style={{
                fontStyle: 'italic', fontSize: '80%', display: 'block', marginTop: '0.3em'
              }}
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
    // guard against initial render without `formValues`: https://github.com/erikras/redux-form/issues/3570
    if (this.props.url === undefined) {
      return null;
    }

    const { input, url } = this.props;

    return (
      <React.Fragment>
        <input
          type="text"
          className={formStyles.name}
          autoFocus={input.value === urlAnalyzer(url).suggestedName}
          onFocus={this.handleFocusName}
          onBlur={this.handleBlurName}
          onChange={input.onChange}
          value={input.value}
          placeholder="Title"
        />
        {this.state.nameFocused ? this.renderTitles() : null}
      </React.Fragment>
    );
  }
}

export default formValues('url')(LinkNameField);
