// @flow
import React, { Component } from 'react';

import styles from './AddLink.css';

class AddLink extends Component {
  props: {
    addLink: (link: string) => Promise<{ _id: string }>
  };

  handleSubmit = (event) => {
    event.preventDefault();

    this.props.addLink(this.refs.link.value)
      .then(({ _id }) => this.props.history.push(`/links/${_id}`));
  };

  render() {
    return (
      <div style={{ paddingTop: '20vh' }}>
        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            ref="link"
            className={styles.urlInput}
            placeholder="URL here"
          />
        </form>
      </div>
    );
  }
}

export default AddLink;
