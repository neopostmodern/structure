import { gql, useLazyQuery } from '@apollo/client';
import { urlAnalyzer } from '@structure/common';
import React, { useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import styled from 'styled-components';
import {
  TitleSuggestionsQuery,
  TitleSuggestionsQueryVariables,
} from '../../generated/graphql';
import useIsOnline from '../../hooks/useIsOnline';
import { isUrlValid } from '../../utils/textHelpers';
import useDataState, { DataState } from '../../utils/useDataState';
import ErrorSnackbar from '../ErrorSnackbar';
import { FormSubheader, NameInput } from '../formComponents';

const Suggestions = styled.div`
  opacity: 0;
  max-height: 0;
  transition-property: all;
  transition-timing-function: ease-in-out;
  transition-duration: 0.3s;

  ${NameInput}:focus ~ & {
    padding-bottom: 2rem;
    opacity: 1;
    max-height: 100px;
  }
`;

const Suggestion = styled.button`
  background: none;
  color: inherit;
  border: none;
  padding: 0;
  margin-top: 1rem;
  font: inherit;
  opacity: 0.75;
  cursor: pointer;

  &:focus,
  &:hover {
    opacity: 1;
    outline: none;
    //text-decoration: underline;
    background-color: ${({ theme }) => theme.palette.text.primary};
    color: ${({ theme }) => theme.palette.background.default};
  }
`;

const TITLE_SUGGESTIONS_QUERY = gql`
  query TitleSuggestions($linkId: ID!) {
    titleSuggestions(linkId: $linkId)
  }
`;

interface LinkNameFieldProps {
  linkId: string;
  url: string;
  name: string;
}

const LinkNameField: React.FC<LinkNameFieldProps> = ({ url, name, linkId }) => {
  const { register, setValue, getValues } = useFormContext();
  const inputElement = useRef<HTMLInputElement | null>();

  const [fetchTitleSuggestions, titleSuggestionsQuery] = useDataState(
    useLazyQuery<TitleSuggestionsQuery, TitleSuggestionsQueryVariables>(
      TITLE_SUGGESTIONS_QUERY,
      { variables: { linkId } }
    )
  );

  const formFieldProperties = register(name);

  let titleSuggestionsComponent: JSX.Element | Array<JSX.Element> | null;
  switch (titleSuggestionsQuery.state) {
    case DataState.UNCALLED:
      titleSuggestionsComponent = null;
      break;
    case DataState.LOADING:
      titleSuggestionsComponent = <i>Loading title suggestions...</i>;
      break;
    case DataState.ERROR:
      titleSuggestionsComponent = (
        <>
          <ErrorSnackbar
            error={titleSuggestionsQuery.error}
            actionDescription="fetch title suggestions"
          />
          <i>Failed to load title suggestions</i>
        </>
      );
      break;
    case DataState.DATA:
      if (titleSuggestionsQuery.data.titleSuggestions.length === 0) {
        titleSuggestionsComponent = <i>No titles found in website</i>;
      } else {
        titleSuggestionsComponent =
          titleSuggestionsQuery.data.titleSuggestions.map((title, index) => (
            <Suggestion
              type="button"
              style={{
                fontStyle: 'italic',
                fontSize: '80%',
                display: 'block',
                marginTop: '0.3em',
              }}
              key={index}
              onClick={(): void => {
                if (!inputElement.current) {
                  return;
                }
                inputElement.current.value = title;
                setValue(name, title, {
                  shouldValidate: true,
                });
              }}
            >
              {title}
            </Suggestion>
          ));
      }
      break;
  }

  const isOnline = useIsOnline();

  return (
    <>
      <NameInput
        type="text"
        {...formFieldProperties}
        autoFocus={
          isUrlValid(url) && getValues(name) === urlAnalyzer(url).suggestedName
        }
        onFocus={(): void => {
          fetchTitleSuggestions();
        }}
        ref={(ref): void => {
          formFieldProperties.ref(ref);
          inputElement.current = ref;
        }}
        placeholder="Title"
        disabled={!isOnline}
      />
      <Suggestions>
        <FormSubheader>Title suggestions</FormSubheader>
        {titleSuggestionsComponent}
      </Suggestions>
    </>
  );
};

export default LinkNameField;
