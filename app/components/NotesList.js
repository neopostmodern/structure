// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import TimeAgo from 'react-timeago';
import ClassNames from 'classnames';

import { type NoteObject } from '../reducers/links';
import Tags from './Tags';
import styles from './LinksList.css';
import buttonStyles from '../styles/button.scss';

type NotesListProps = {
  notes: Array<NoteObject>,
  batchEditing?: boolean,
  batchSelections: {
    [string]: boolean
  },

  addTagToNote: (linkId: string, tag: string) => void,
  onRemoveTagFromNote: (linkId: string, tagId: string) => void,
  onToggleArchived: (noteId: string) => void,
  onToggleBatchSelected: (noteId: string) => void
};

export default class NotesList extends Component<NotesListProps> {
  static defaultProps = {
    batchEditing: false
  }

  _handleSubmitTag(noteId: string, tag: string) {
    this.props.addTagToNote(noteId, tag);
  }

  renderBatchOperationCheckbox(note) {
    return (
      <React.Fragment>
        <input
          type="checkbox"
          className={styles.checkbox}
          id={`checkbox-${note._id}`}
          checked={this.props.batchSelections[note._id] || false}
          onChange={() => this.props.onToggleBatchSelected(note._id)}
        />
        <label htmlFor={`checkbox-${note._id}`} className={styles.checkboxLabel} />
      </React.Fragment>
    );
  }

  render() {
    if (this.props.notes.length === 0) {
      return <i>No links.</i>;
    }

    return (
      <div className={styles.links}>
        {this.props.notes.map((note) => (
          <div key={note._id} className={ClassNames(styles.link, { [styles.archived]: Boolean(note.archivedAt) })}>
            {this.props.batchEditing ? this.renderBatchOperationCheckbox(note) : null}
            <div className={styles.container}>
              <div className={styles.title}>
                <Link className={styles.name} to={`/${note.type.toLowerCase()}s/${note._id}`}>
                  {note.name}
                </Link>
                {note.type !== 'LINK' ? (
                  <div className={styles.type}>
&lt;
                    {note.type.toLowerCase()}
&gt;
                  </div>
                ) : null}
                <div className={styles.date}>
                  <TimeAgo date={note.createdAt} />
                </div>
              </div>
              <div className={styles.info}>
                {note.url
                  ? (
                    <a
                      href={note.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.domain}
                    >
                      {note.domain}
                    </a>
                  ) : null}
                <div className={styles.description}>{note.description}</div>
              </div>
              <div className={styles.actions}>
                <Tags
                  tags={note.tags}
                  onAddTag={this._handleSubmitTag.bind(this, note._id)}
                  onRemoveTag={this.props.onRemoveTagFromNote.bind(null, note._id)}
                />
                <div
                  className={styles.archive}
                  onClick={() => this.props.onToggleArchived(note._id)}
                >
                  <div className={styles.status}>{note.archivedAt ? 'Archived' : null}</div>
                  <button type="button" className={`${styles.change} ${buttonStyles.inlineButton}`}>
                    {note.archivedAt ? 'Unarchive' : 'Archive'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
}
