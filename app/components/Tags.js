// @flow
import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { findDOMNode } from 'react-dom';
import type { TagType } from '../types';
import styles from './Tags.scss';

class Tags extends React.Component {
  props: {
    tags: [TagType],
    withShortcuts?: boolean,
    onAddTag: () => void,
    onRemoveTag: (string) => void,
    onClickTag: (string) => void
  };
  state: {
    addingNewTag: boolean
  }

  defaultProps = {
    withShortcuts: false
  };

  constructor() {
    super();

    this.state = {
      addingNewTag: false
    };
  }

  componentDidMount() {
    if (this.props.withShortcuts) {
      window.addEventListener('keydown', (event: KeyboardEvent) => {
        if (event.key === 't' && event.ctrlKey) {
          this.showNewTagForm();
        }
      }, true);
    }
  }

  showNewTagForm = () => {
    this.setState({ addingNewTag: true });
  };
  hideNewTagForm = () => {
    this.tagInput.value = '';
    this.setState({ addingNewTag: false });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    const tagValue = this.tagInput.value.trim();
    if (tagValue.length > 0) {
      this.props.onAddTag(tagValue);
      this.hideNewTagForm();
    } else {
      alert("Can't add empty tag."); // todo: error handling in UI
    }
  };

  handleContextMenu(tagId, event: SyntheticMouseEvent) {
    event.preventDefault();
    this.props.onRemoveTag(tagId);
  }

  handleInputKeydown = (event: SyntheticKeyboardEvent) => {
    if (event.key === 'Escape') {
      this.hideNewTagForm();
    }
  };

  calculateFontColor = (element) => {
    if (!element) {
      return;
    }

    const backgroundColorRGB = window.getComputedStyle(element).backgroundColor
      .replace(new RegExp('[^0-9.,]+', 'g'), '')
      .split(',');
    const perceivedBackgroundLightness = (
      0.299 * backgroundColorRGB[0]
      + 0.587 * backgroundColorRGB[1]
      + 0.114 * backgroundColorRGB[2]
      ) / 255;

    if (perceivedBackgroundLightness < 0.5) {
      // eslint-disable-next-line no-param-reassign
      element.style.color = '#eee';
    }
  }

  render() {
    let newTagForm;
    if (this.state.addingNewTag) {
      // todo: redux form
      newTagForm = (
        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            placeholder="tag name"
            ref={(element) => { if (element) { element.focus(); } this.tagInput = element; }}
            onKeyDown={this.handleInputKeydown}
          />
        </form>
      );
    } else {
      const addTagText = this.props.tags.length === 0 ? '+tag' : '+';
      newTagForm = (
        <div
          className={styles.tag}
          style={{ border: '1px solid black' }}
          onClick={this.showNewTagForm}
        >
          {addTagText}
        </div>
      );
    }
    return (<div className={styles.tags}>
      {this.props.tags.map((tag) =>
        <div
          key={tag._id}
          className={styles.tag}
          style={{ backgroundColor: tag.color }}
          onClick={this.props.navigateToTag.bind(null, tag._id)}
          onContextMenu={this.handleContextMenu.bind(this, tag._id)}
          ref={this.calculateFontColor}
        >
          {tag.name}
        </div>
      )}
      {newTagForm}
    </div>);
  }
}

// todo: decide on fragments
// Tags.fragments = {
//   tags: gql`
//     fragment Tags on Link {
//       tags {
//         _id
//         name
//         color
//       }
//     }
//   `
// };


const mapDispatchToProps = (dispatch) => ({
  navigateToTag: (tagId) => dispatch(push(`/tags/${tagId}`))
});

export default connect(
  null,
  mapDispatchToProps
)(Tags);
