// @flow

import React from 'react';
import marked from 'marked';

const renderer = new marked.Renderer();
renderer.listitem = function renderListItem(text) {
  console.log(text);
  if (/^\s*\[[x ]\]\s*/.test(text)) {
    const textWithListItems = text
      .replace(/^\s*\[ \]\s*/, '☐ ')
      .replace(/^\s*\[x\]\s*/, '☑ ');
    return `<li style="list-style: none; margin-left: -1.3rem;">${textWithListItems}</li>`;
  }
  return `<li>${text}</li>`;
};
marked.setOptions({
  breaks: true,
  renderer
});

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
