// @flow
import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { findDOMNode } from 'react-dom';
import type { TagType } from '../types';
import styles from './Tags.scss';

class Tags extends React.Component {
  propTypes: {
    tags: [TagType],
    onAddTag: () => void,
    onRemoveTag: (string) => void,
    onClickTag: (string) => void
  };

  constructor() {
    super();

    this.state = {
      addingNewTag: false
    };

    this._showNewTagForm = this._showNewTagForm.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
  }

  _showNewTagForm() {
    this.setState({ addingNewTag: true });
  }
  _handleSubmit(event) {
    event.preventDefault();

    const tagField = findDOMNode(this.refs.tag);
    const tagValue = tagField.value.trim();
    if (tagValue.length > 0) {
      this.props.onAddTag(tagValue);
      tagField.value = '';
      this.setState({ addingNewTag: false });
    } else {
      alert("Can't add empty tag."); // todo: error handling in UI
    }
  }

  handleContextMenu(tagId, event: SyntheticMouseEvent) {
    event.preventDefault();
    this.props.onRemoveTag(tagId);
  };

  render() {
    let newTagForm;
    if (this.state.addingNewTag) {
      newTagForm = <form onSubmit={this._handleSubmit}><input type="text" placeholder="tag name" ref="tag" /></form>;
    } else {
      const addTagText = this.props.tags.length === 0 ? '+tag' : '+';
      newTagForm = (<div
        className={styles.tag}
        style={{ border: '1px solid black' }}
        onClick={this._showNewTagForm}
      >
        {addTagText}
      </div>);
    }
    return (<div className={styles.tags}>
      {this.props.tags.map((tag) =>
        <div
          key={tag._id}
          className={styles.tag}
          style={{ backgroundColor: tag.color }}
          onClick={this.props.navigateToTag.bind(null, tag._id)}
          onContextMenu={this.handleContextMenu.bind(this, tag._id)}
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
