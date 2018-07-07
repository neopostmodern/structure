// @flow
import * as React from 'react';
import { graphql, compose } from 'react-apollo';
import ClassNames from 'classnames';
import gql from 'graphql-tag';
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import type { TagsLayoutsType } from '../actions/userInterface';

import styles from './TagsPage.scss';
import menuStyles from '../styles/menu.scss';
import type { TagType } from '../types';
import colorTools, { ColorCache } from '../utils/colorTools'
import {
  changeTagsLayout,
  TagsLayouts
} from '../actions/userInterface';

export function layoutToName(layout: TagsLayoutsType) {
  switch (layout) {
    case TagsLayouts.CHAOS_LAYOUT:
      return 'Chaos layout';
    case TagsLayouts.COLOR_LIST_LAYOUT:
      return 'Color list layout';
    case TagsLayouts.COLOR_COLUMN_LAYOUT:
      return 'Color column layout';
    case TagsLayouts.COLOR_WHEEL_LAYOUT:
      return 'Color wheel layout';
    default:
      console.error('Unkown layout', layout);
      return 'Unknown layout';
  }
}

export class TagsPage extends React.Component {
  props: {
    loading: boolean,
    tags?: Array<TagType>,
    layout: TagsLayoutsType,
    changeLayout: (newLayout: TagsLayoutsType) => void
  };

  constructor() {
    super();

    this.state = {};

    (this: any).selectNextLayout = this.selectNextLayout.bind(this);
    (this: any).handleDrop = this.handleDrop.bind(this);
    (this: any).handleDragLeave = this.handleDragLeave.bind(this);
  }

  selectNextLayout() {
    const layouts = Object.keys(TagsLayouts);
    const nextLayoutIndex = (layouts.indexOf(this.props.layout) + 1) % layouts.length;
    this.props.changeLayout(layouts[nextLayoutIndex]);
  }

  handleDragStart(tag: TagType, event) {
    // eslint-disable-next-line no-param-reassign
    event.dataTransfer.dropEffect = 'copy';
    this.setState({ draggedTag: tag });
  }
  handleDragOver(color, event) {
    this.setState({ droppableColor: color });
    event.preventDefault();
  }
  handleDragLeave() {
    this.setState({ droppableColor: null });
  }
  handleDrop() {
    const recoloredTag = Object.assign({}, this.state.draggedTag, { color: this.state.droppableColor});
    this.props.updateTag(recoloredTag);
    this.setState({ droppableColor: null });
  }

  renderChaosLayout() {
    return (
      <div className={styles.tagContainer}>
        {this.props.tags.map((tag) => (
          <div
            key={tag._id}
            className={styles.tag}
            style={{ backgroundColor: tag.color }}
            onClick={() => this.props.history.push(`/tags/${tag._id}`)}
            ref={colorTools}
          >
            {tag.name}
          </div>
        ))}
      </div>
    );
  }

  renderColorListLayout(horizontal = false) {
    const colorTagGroups = {};

    this.props.tags.forEach(tag => {
      if (!colorTagGroups[tag.color]) {
        colorTagGroups[tag.color] = [];
      }
      colorTagGroups[tag.color].push(tag);
    });

    const colors = Object.keys(colorTagGroups)
      .map(color => ({ color, h: ColorCache[color].hsl[0] }))
      .sort((color1, color2) => color2.h - color1.h)
      .map(color => color.color);

    return (
      <div className={horizontal ? styles.columnsContainer : null}>
        {colors.map(color => (
          <div
            className={ClassNames(styles.tagContainer, { [styles.tagContainerDroppable]: color === this.state.droppableColor })}
            onDragOver={this.handleDragOver.bind(this, color)}
            onDragLeave={this.handleDragLeave}
            onDrop={this.handleDrop}
            key={color}
          >
            {colorTagGroups[color].map((tag) => (
              <div
                key={tag._id}
                className={styles.tag}
                style={{ backgroundColor: tag.color }}
                onClick={() => this.props.history.push(`/tags/${tag._id}`)}
                ref={colorTools}
                draggable
                onDragStart={this.handleDragStart.bind(this, tag)}
              >
                {tag.name}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  renderTags() {
    switch (this.props.layout) {
      case TagsLayouts.CHAOS_LAYOUT:
        return this.renderChaosLayout();
      case TagsLayouts.COLOR_LIST_LAYOUT:
        return this.renderColorListLayout();
      case TagsLayouts.COLOR_COLUMN_LAYOUT:
        return this.renderColorListLayout(true);
      default:
        return <i>Unsupported layout.</i>;
    }
  }

  render() {
    let content;
    if (!this.props.loading) {
      content = (<React.Fragment>
        <div className={menuStyles.menu}>
          <a
            onClick={this.selectNextLayout}
          >
            {layoutToName(this.props.layout)}
          </a>
        </div>
        {this.renderTags()}
      </React.Fragment>);
    } else {
      content = <i>Loading...</i>;
    }
    return (
      <div>
        {content}
      </div>
    );
  }
}

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
    loading,
    tags
  }),
});

const UPDATE_TAG_MUTATION = gql`
  mutation UpdateTag($tag: InputTag!) {
    updateTag(tag: $tag) {
      _id
      name
      color
      
      notes {
        ... on INote {
          type
          _id
          createdAt
          description
          tags {
            _id
            name
            color
          }
        }
        ... on Link {
          url
          domain
          name
        }
      }
    }
  }
`;
const withUpdateTag = graphql(UPDATE_TAG_MUTATION, {
  props: ({ mutate }) => ({
    updateTag: ({ _id, name, color }) => mutate({ variables: { tag: { _id, name, color } } })
  })
});

function mapStateToProps(state) {
  return {
    layout: state.userInterface.tagsLayout
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    changeLayout: changeTagsLayout
  }, dispatch);
}

export default compose(
  withData,
  withUpdateTag,
  connect(mapStateToProps, mapDispatchToProps)
)(TagsPage);
