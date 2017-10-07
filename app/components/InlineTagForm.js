// @flow

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { gql, graphql, compose } from 'react-apollo';

import styles from './InlineTagForm.scss';
import calculateFontColor from '../utils/calculateFontColor';

const FORM_NAME = 'inline-tag';

const notEmpty = value => (value && value.length > 0 ? undefined : 'No empty tags');
const inputField = ({ input, label, type, meta: { touched, error, warning }, ...rest }) => (
  <div>
    {(touched && error) && <div style={{ color: 'darkred', position: 'absolute', bottom: '100%', right: 0, fontSize: '70%' }}>{error}</div>}
    <input {...input} placeholder={label} type={type} {...rest} />
  </div>
);

const InlineTagForm = props => {
  const { handleSubmit, tags, tagsLoading, pristine, submitting, nameValue, change, submit } = props;
  let tagAutocomplete;

  if (!pristine) {
    if (tagsLoading) {
      tagAutocomplete = (
        <div className={styles.tagAutocompleteContainer}>
          Tags loading...
        </div>
      );
    } else {
      const matchingTagsForAutocomplete = tags.filter((tag) => tag.name.includes(nameValue));
      tagAutocomplete = (
        <div className={styles.tagAutocompleteContainer}>
          {matchingTagsForAutocomplete.slice(0, 5).map((tag) => (
            <div
              key={tag._id}
              className={styles.tagAutocomplete}
              style={{ backgroundColor: tag.color }}
              ref={calculateFontColor}
              onClick={() => { change('name', tag.name); setTimeout(submit, 0); }}
            >
              {tag.name}
            </div>
          ))}
          {matchingTagsForAutocomplete.length > 5 ? (
            <div
              key={'more'}
              className={styles.tagAutocompleteMore}
            >
              +{matchingTagsForAutocomplete.length - 5}
            </div>
          ) : null}
        </div>
      );
    }
  }

  const handleInputKeydown = (event: SyntheticKeyboardEvent) => {
    if (event.key === 'Escape') {
      props.onAbort();
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
};

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
})(
  reduxForm({
    form: FORM_NAME,
  })(
    compose(withData)(InlineTagForm)
  )
);
