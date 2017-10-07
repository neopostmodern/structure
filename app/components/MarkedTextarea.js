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

  componentWillMount() {
    console.log(this.props.meta);
    if (this.props.meta.initial.length === 0) {
      this.setState({ editDescription: true });
    }
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
        dangerouslySetInnerHTML={{ __html: marked(this.props.input.value || '') }}
        onClick={() => this.setState({ editDescription: true })}
        style={{ fontSize: '1rem' }}
      />
    );
  }
}
