// @flow
import * as React from 'react';
import { graphql, compose } from 'react-apollo';
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
      return 'Grid layout';
    case TagsLayouts.COLOR_LIST_LAYOUT:
      return 'Color list layout';
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

    (this: any).selectNextLayout = this.selectNextLayout.bind(this);
  }

  selectNextLayout() {
    const layouts = Object.keys(TagsLayouts);
    const nextLayoutIndex = (layouts.indexOf(this.props.layout) + 1) % layouts.length;
    this.props.changeLayout(layouts[nextLayoutIndex]);
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

  renderColorListLayout() {
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
      <React.Fragment>
        {colors.map(color => (
          <div className={styles.tagContainer}>
            {colorTagGroups[color].map((tag) => (
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
        ))}
      </React.Fragment>
    );
  }

  renderTags() {
    switch (this.props.layout) {
      case TagsLayouts.CHAOS_LAYOUT:
        return this.renderChaosLayout();
      case TagsLayouts.COLOR_LIST_LAYOUT:
        return this.renderColorListLayout();
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
  connect(mapStateToProps, mapDispatchToProps)
)(TagsPage);
