// @flow

import React from 'react';
import marked from 'marked';
import Mousetrap from 'mousetrap';

const renderer = new marked.Renderer();
renderer.listitem = function renderListItem(text) {
  if (/^\s*\[[x ]\]\s*/.test(text)) {
    const textWithListItems = text
      .replace(/^\s*\[ \]\s*/, '☐ ')
      .replace(/^\s*\[x\]\s*/, '☑ ');
    return `<li style="list-style: none; margin-left: -1.3rem;">${textWithListItems}</li>`;
  }
  return `<li>${text}</li>`;
};

renderer.link = function renderLink(href, title, text) {
  return `<a href="${href}" title="${title || href}" target="_blank" rel="noopener noreferrer">${text}</a>`;
};

marked.setOptions({
  breaks: true,
  renderer
});

const focusDescriptionShortcutKeys = ['ctrl+e', 'command+e'];

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

  componentDidMount() {
    Mousetrap.bind(focusDescriptionShortcutKeys, this.setEditDescription.bind(this, true));
  }
  componentWillUnmount() {
    Mousetrap.unbind(focusDescriptionShortcutKeys);
  }

  setEditDescription(value: boolean) {
    this.setState({ editDescription: value });
  }

  render() {
    if (this.state.editDescription) {
      return (
        <div>
          <textarea
            {...this.props.input}
            className={this.props.className}
            onBlur={this.setEditDescription.bind(this, false)}
            ref={(element) => element && element.focus()}
          />
        </div>
      );
    }

    return (
      <div
        dangerouslySetInnerHTML={{ __html: marked(this.props.input.value || '<small><i>Click to add a description</i></small>') }}
        onClick={this.setEditDescription.bind(this, true)}
        style={{ fontSize: '1rem' }}
      />
    );
  }
}
