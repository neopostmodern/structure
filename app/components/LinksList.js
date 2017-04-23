// @flow
import React, { Component } from 'react';
import TimeAgo from 'react-timeago';
import type LinkObject from '../reducers/links';
import Tags from './Tags';
import styles from './LinksList.css';
import { Link } from 'react-router-dom';

export default class LinksList extends Component {
  props: {
    links: Array<LinkObject>,

    addTagToLink: (linkId: string, tag: string) => void
  };

  _handleSubmitTag(linkId, tag) {
    this.props.addTagToLink(linkId, tag);
  }

  render() {
    if (this.props.links.length === 0) {
      return <i>No links.</i>;
    }

    return (
      <div className={styles.links}>
        {this.props.links.map((link) =>
          <div key={link._id} className={styles.link}>
            <div className={styles.title}>
              <Link className={styles.name} to={`/links/${link._id}`}>
                {link.name}
              </Link>
              <div className={styles.date}>
                <TimeAgo date={link.createdAt} />
              </div>
            </div>
            <div className={styles.info}>
              <a href={link.url} className={styles.domain}>{link.domain}</a>
              <div className={styles.description}>{link.description}</div>
            </div>
            <Tags
              tags={link.tags}
              onAddTag={this._handleSubmitTag.bind(this, link._id)}
              onRemoveTag={this.props.onRemoveTagFromLink.bind(null, link._id)}
            />
          </div>
        )}
      </div>
    );
  }
}

