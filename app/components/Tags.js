// @flow
import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import Mousetrap from 'mousetrap';
import makeMousetrapGlobal from '../utils/mousetrapGlobal';

import type { TagType } from '../types';
import styles from './Tags.scss';
import InlineTagForm from './InlineTagForm';
import calculateFontColor from '../utils/calculateFontColor';

makeMousetrapGlobal(Mousetrap);

const tagShortcutKeys = ['ctrl+t', 'command+t'];

class Tags extends React.Component {
  props: {
    tags: [TagType],
    existingTagsLoading: boolean,
    existingTags?: [TagType],
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
      Mousetrap.bindGlobal(tagShortcutKeys, this.showNewTagForm);
    }
  }
  componentWillUnmount() {
    if (this.props.withShortcuts) {
      Mousetrap.unbind(tagShortcutKeys);
    }
  }

  showNewTagForm = () => {
    this.setState({ addingNewTag: true });
  };
  hideNewTagForm = () => {
    this.setState({ addingNewTag: false });
  };

  handleSubmit = (data) => {
    const tagValue = data.name.trim();
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

  render() {
    let newTagForm;
    if (this.state.addingNewTag) {
      newTagForm = (
        <InlineTagForm
          onSubmit={this.handleSubmit}
          onAbort={this.hideNewTagForm}
        />
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
        (<div
          key={tag._id}
          className={styles.tag}
          style={{ backgroundColor: tag.color }}
          onClick={this.props.navigateToTag.bind(null, tag._id)}
          onContextMenu={this.handleContextMenu.bind(this, tag._id)}
          ref={calculateFontColor}
        >
          {tag.name}
        </div>)
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
