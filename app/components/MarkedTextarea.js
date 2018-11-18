// @flow

import React from 'react';
import marked from 'marked';
import Mousetrap from 'mousetrap';

import makeMousetrapGlobal from '../utils/mousetrapGlobal';

makeMousetrapGlobal(Mousetrap);

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

type MarkedTextareaProps = {
  input: {
    value: string
  },
  className: string
}
type MarkedTextareaStateType = {
  editDescription: boolean,
  editDescriptionFocused: boolean
};

export default class MarkedTextarea extends React.Component<MarkedTextareaProps, MarkedTextareaStateType> {
  constructor() {
    super();

    this.state = {
      editDescription: false,
      editDescriptionFocused: false
    };

    this.textareaRefCallback = this.textareaRefCallback.bind(this);
    this.handleTextareaKeydown = this.handleTextareaKeydown.bind(this);
  }

  componentDidMount() {
    Mousetrap.bindGlobal(focusDescriptionShortcutKeys, this.toggleEditDescription.bind(this));
  }

  componentWillUnmount() {
    Mousetrap.unbind(focusDescriptionShortcutKeys);
  }

  textareaElement: HTMLTextAreaElement | null = null;

  toggleEditDescription() {
    const currentEditDescriptionStatus = this.state.editDescription;
    this.setState({ editDescription: !currentEditDescriptionStatus });

    if (!currentEditDescriptionStatus) {
      this.focusTextarea();
    } else {
      this.setState({ editDescriptionFocused: false });
    }
  }

  textareaRefCallback(textarea: ?HTMLTextAreaElement) {
    if (!textarea) {
      return;
    }

    this.textareaElement = textarea;
  }

  focusTextarea() {
    if (!this.state.editDescriptionFocused && this.textareaElement) {
      this.textareaElement.focus();
      this.setState({ editDescriptionFocused: true });
    }
  }

  handleTextareaKeydown(event: SyntheticKeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Escape') {
      this.toggleEditDescription();
    }
  }

  render() {
    const { input, className } = this.props;

    if (this.state.editDescription) {
      return (
        <div>
          <textarea
            {...input}
            className={className}
            onBlur={() => this.setState({ editDescriptionFocused: false })}
            onKeyDown={this.handleTextareaKeydown}
            ref={this.textareaRefCallback}
          />
        </div>
      );
    }

    return (
      <div
        dangerouslySetInnerHTML={{ __html: marked(input.value || '<small><i>No content</i></small>') }}
        style={{ fontSize: '1rem' }}
      />
    );
  }
}
