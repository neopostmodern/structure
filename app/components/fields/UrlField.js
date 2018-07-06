import React from 'react';
import type { FormProps } from 'redux-form';

import formStyles from '../NoteForm.scss';

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
          style={{ textAlign: 'center', height: '1.5rem', marginLeft: '1rem' }}
          onClick={() => window.open(this.props.input.value, '_blank', 'noopener, noreferrer')}
        >
          Open
        </button>
      </div>
    );
  }
}

export default UrlField;
