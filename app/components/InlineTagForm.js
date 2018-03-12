// @flow

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import type { TagType } from '../types';
import styles from './InlineTagForm.scss';
import calculateFontColor from '../utils/calculateFontColor';

const FORM_NAME = 'inline-tag';

const notEmpty = value => (value && value.length > 0 ? undefined : 'No empty tags');
const inputField = ({
  input, label, type, meta: { touched, error, warning }, ...rest
}) => (
  <div>
    {(touched && error) && <div style={{
 color: 'darkred', position: 'absolute', bottom: '100%', right: 0, fontSize: '70%'
}}
    >{error}
                           </div>}
    <input {...input} placeholder={label} type={type} {...rest} />
  </div>
);

class InlineTagForm extends React.Component {
  static MAX_AUTOCOMPLETE_LENGTH = 5;
  state: {
    focusedAutocompleteIndex: number,
    autocompleteSuggestions: TagType[]
  }

  constructor() {
    super();

    this.state = {
      focusedAutocompleteIndex: 0
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.nameValue !== nextProps.nameValue) {
      this.setState({
        autocompleteSuggestions: this.props.tags.filter((tag) => tag.name.includes(nextProps.nameValue))
      });
    }
  }
  render() {
    const {
      handleSubmit, tagsLoading, pristine, submitting, nameValue, change, submit
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
                      ? 'black'
                      : 'transparent'
                  }}
                  ref={calculateFontColor}
                  onClick={() => { change('name', tag.name); setTimeout(submit, 0); }}
                >
                  {tag.name}
                </div>
              ))
            }
            {this.state.autocompleteSuggestions.length > InlineTagForm.MAX_AUTOCOMPLETE_LENGTH ? (
              <div
                key="more"
                className={styles.tagAutocompleteMore}
              >
                +{this.state.autocompleteSuggestions.length - InlineTagForm.MAX_AUTOCOMPLETE_LENGTH}
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
          change(
            'name',
            this.state.autocompleteSuggestions[this.state.focusedAutocompleteIndex].name
          );
          setTimeout(submit, 0);
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
