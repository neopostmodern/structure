import React from 'react';
import type { FormProps } from 'redux-form';

import formStyles from '../NoteForm.scss';
import buttonStyles from '../../styles/button.scss';

class UrlField extends React.Component<FormProps, void> {
  render() {
    return (
      <div style={{ display: 'flex' }}>
        <input
          type="text"
          className={formStyles.url}
          {...this.props.input}
        />
        <button
          type="button"
          className={buttonStyles.inlineButton}
          style={{ marginLeft: '1rem' }}
          onClick={() => window.open(this.props.input.value, '_blank', 'noopener, noreferrer')}
        >
          Open
        </button>
      </div>
    );
  }
}

export default UrlField;
