// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import TimeAgo from 'react-timeago';

import type LinkObject from '../reducers/links';
import Tags from './Tags';
import styles from './LinksList.css';

export default class NotesList extends Component {
  props: {
    notes: Array<LinkObject>,

    addTagToNote: (linkId: string, tag: string) => void,
    onRemoveTagFromNote: (linkId: string, tagId: string) => void
  };

  _handleSubmitTag(noteId: string, tag: string) {
    this.props.addTagToNote(noteId, tag);
  }

  render() {
    if (this.props.notes.length === 0) {
      return <i>No links.</i>;
    }

    return (
      <div className={styles.links}>
        {this.props.notes.map((note) =>
          <div key={note._id} className={styles.link}>
            <div className={styles.title}>
              <Link className={styles.name} to={`/${note.type.toLowerCase()}s/${note._id}`}>
                {note.name}
              </Link>
              {note.type !== 'LINK' ? <div className={styles.type}>&lt;{note.type.toLowerCase()}&gt;</div> : null}
              <div className={styles.date}>
                <TimeAgo date={note.createdAt} />
              </div>
            </div>
            <div className={styles.info}>
              {note.url ?
                  <a
                    href={note.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.domain}
                  >
                    {note.domain}
                  </a> : null}
              <div className={styles.description}>{note.description}</div>
            </div>
            <Tags
              tags={note.tags}
              onAddTag={this._handleSubmitTag.bind(this, note._id)}
              onRemoveTag={this.props.onRemoveTagFromNote.bind(null, note._id)}
            />
          </div>
        )}
      </div>
    );
  }
}

