// @flow
import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { findDOMNode } from 'react-dom';
import type { TagType } from '../types';
import { gql, graphql, compose } from 'react-apollo';
import styles from './Tags.scss';
import InlineTagForm from './InlineTagForm';
import calculateFontColor from '../utils/calculateFontColor';

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
          tags={this.props.existingTags}
          tagsLoading={this.props.existingTagsLoading}
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
        <div
          key={tag._id}
          className={styles.tag}
          style={{ backgroundColor: tag.color }}
          onClick={this.props.navigateToTag.bind(null, tag._id)}
          onContextMenu={this.handleContextMenu.bind(this, tag._id)}
          ref={calculateFontColor}
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


const TAGS_QUERY = gql`
  query Tags {
    tags {
      _id
      name
      color
    }
  }
`;
const withData = graphql(TAGS_QUERY, {
  options: {
    fetchPolicy: 'cache-and-network',
  },
  props: ({ data: { loading, tags } }) => ({
    existingTagsLoading: loading,
    existingTags: tags
  }),
});

export default connect(
  null,
  mapDispatchToProps
)(compose(withData)(Tags));
