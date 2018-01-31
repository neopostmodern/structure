// @flow

import React from 'react';
import marked from 'marked';

export default class MarkedTextarea extends React.Component {
  state: {
    editDescription: boolean
  }

  constructor() {
    super();

    this.state = {
      editDescription: false
    };
  }

  render() {
    if (this.state.editDescription) {
      return (
        <div>
          <textarea
            {...this.props.input}
            className={this.props.className}
            onBlur={() => this.setState({ editDescription: false })}
            ref={(element) => element && element.focus()}
          />
        </div>
      );
    }

    return (
      <div
        dangerouslySetInnerHTML={{ __html: marked(this.props.input.value || '<small><i>Click to add a description</i></small>') }}
        onClick={() => this.setState({ editDescription: true })}
        style={{ fontSize: '1rem' }}
      />
    );
  }
}
