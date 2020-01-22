// @flow

import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { graphql } from 'react-apollo';
import { flowRight as compose } from 'lodash';
import gql from 'graphql-tag';

import type { TagType } from '../types';
import styles from './InlineTagForm.scss';
import colorTools, { ColorCache } from '../utils/colorTools';

const FORM_NAME = 'inline-tag';

const notEmpty = value => (value && value.length > 0 ? undefined : 'No empty tags');
const inputField = ({
  input, label, type, meta: { touched, error, warning }, ...rest
}) => (
  <div>
    {(touched && error) && (
    <div style={{
      color: 'darkred', position: 'absolute', bottom: '100%', right: 0, fontSize: '70%'
    }}
    >
      {error}
    </div>
    )}
    <input {...input} placeholder={label} type={type} {...rest} />
  </div>
);

type InlineTagFormProps = {
  tagsLoading: true
} | {
  tags: Array<TagType>,
  tagsLoading: false,
  handleSubmit: () => void,
  onAbort: () => void,
  // from form
  nameValue: string,
  pristine: boolean,
  change: (string, any) => void,
  submit: () => void
};

class InlineTagForm extends React.Component<InlineTagFormProps> {
  static MAX_AUTOCOMPLETE_LENGTH = 5;

  state: {
    focusedAutocompleteIndex: number,
    autocompleteSuggestions: TagType[]
  }

  tagMap: {[string]: TagType};

  constructor(props) {
    super();


    this.tagMap = {};
    if (props.tags) {
      this.updateTagMap(props.tags);
    }

    this.state = {
      focusedAutocompleteIndex: 0,
      autocompleteSuggestions: []
    };
  }

  updateTagMap(tags) {
    tags.forEach(tag => {
      this.tagMap[tag._id] = tag;
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.nameValue !== nextProps.nameValue) {
      let autocompleteSuggestions = this.props.tags;
      if (nextProps.nameValue !== undefined) {
        autocompleteSuggestions = autocompleteSuggestions
          .map(({ _id, name }) => (
            { _id, index: name.toLowerCase().indexOf(nextProps.nameValue.toLowerCase()), name }
          ))
          .filter(({ index }) => index !== -1)
          .sort((tag1, tag2) => (
            (tag1.index + (tag1.name.length / 100)) - (tag2.index + (tag2.name.length / 100))
          ))
          .map(({ _id }) => this.tagMap[_id]);
      }

      this.setState({ autocompleteSuggestions });
    }

    if (this.props.tags !== nextProps.tags) {
      this.updateTagMap(nextProps.tags);
    }
  }

  render() {
    const {
      handleSubmit, tagsLoading, pristine, change, submit // submitting, nameValue,
    } = this.props;
    let tagAutocomplete;

    if (!pristine) {
      if (tagsLoading) {
        tagAutocomplete = (
          <div className={styles.tagAutocompleteContainer}>
            Tags loading...
          </div>
        );
      } else {
        tagAutocomplete = (
          <div className={styles.tagAutocompleteContainer}>
            {this.state.autocompleteSuggestions
              .slice(0, InlineTagForm.MAX_AUTOCOMPLETE_LENGTH)
              .map((tag, tagIndex) => (
                <div
                  key={tag._id}
                  className={styles.tagAutocomplete}
                  style={{
                    backgroundColor: tag.color,
                    borderColor: tagIndex === this.state.focusedAutocompleteIndex
                      ? (ColorCache[tag.color].isDark ? '#eee' : 'black')
                      : 'transparent'
                  }}
                  ref={colorTools}
                  onClick={() => { change('name', tag.name); setTimeout(submit, 0); }}
                >
                  {tag.name}
                </div>
              ))}
            {this.state.autocompleteSuggestions.length > InlineTagForm.MAX_AUTOCOMPLETE_LENGTH ? (
              <div
                key="more"
                className={styles.tagAutocompleteMore}
              >
                +
                {this.state.autocompleteSuggestions.length - InlineTagForm.MAX_AUTOCOMPLETE_LENGTH}
              </div>
            ) : null}
          </div>
        );
      }
    }

    const handleInputKeydown = (event: SyntheticKeyboardEvent<HTMLInputElement>) => {
      let { focusedAutocompleteIndex } = this.state;

      switch (event.key) {
        case 'Escape':
          this.props.onAbort();
          break;
        case 'Enter':
          // if either shift key is pressed or the input field itself is focused, let default input
          // field behavior kick in (instead of using suggestion)
          if (!event.shiftKey && focusedAutocompleteIndex !== null) {
            change(
              'name',
              this.state.autocompleteSuggestions[focusedAutocompleteIndex].name
            );
            setTimeout(submit, 0);
          }
          break;
        case 'ArrowDown':
          if (focusedAutocompleteIndex === null) {
            this.setState({
              focusedAutocompleteIndex: 0
            });
            return;
          }

          focusedAutocompleteIndex += 1;
          break;
        case 'ArrowUp':
          if (focusedAutocompleteIndex === null) {
            this.setState({
              focusedAutocompleteIndex: InlineTagForm.MAX_AUTOCOMPLETE_LENGTH - 1
            });
            return;
          }

          focusedAutocompleteIndex -= 1;
          break;
        case 'ArrowLeft':
          if (focusedAutocompleteIndex !== null) {
            focusedAutocompleteIndex -= 1;
          }
          break;
        case 'ArrowRight':
          if (focusedAutocompleteIndex !== null) {
            focusedAutocompleteIndex += 1;
          }
          break;
      }

      if (focusedAutocompleteIndex < 0
        || focusedAutocompleteIndex >= InlineTagForm.MAX_AUTOCOMPLETE_LENGTH) {
        focusedAutocompleteIndex = null;
      }
      if (this.state.focusedAutocompleteIndex !== focusedAutocompleteIndex) {
        this.setState({ focusedAutocompleteIndex });
        event.preventDefault();
      }
    };

    return (
      <form onSubmit={handleSubmit} style={{ position: 'relative' }}>
        <Field
          name="name"
          component={inputField}
          type="text"
          placeholder="tag name"
          autoFocus
          validate={notEmpty}
          onKeyDown={handleInputKeydown}
          style={this.state.focusedAutocompleteIndex === null ? { borderBottomStyle: 'dotted', borderBottomWidth: '2px' } : { marginBottom: '1px' }}
        />
        {tagAutocomplete}
      </form>
    );
  }
}

const selector = formValueSelector(FORM_NAME);

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
    tagsLoading: loading,
    tags
  }),
});

export default connect(state => {
  const nameValue = selector(state, 'name');
  return {
    nameValue
  };
})(reduxForm({ form: FORM_NAME })(compose(withData)(InlineTagForm)));
