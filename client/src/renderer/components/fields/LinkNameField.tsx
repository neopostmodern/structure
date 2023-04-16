import { gql, useLazyQuery } from '@apollo/client';
import { Autocomplete } from '@mui/material';
import { urlAnalyzer } from '@structure/common';
import React, { FocusEvent } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import {
  TitleSuggestionsQuery,
  TitleSuggestionsQueryVariables,
} from '../../generated/graphql';
import useIsOnline from '../../hooks/useIsOnline';
import { isUrlValid } from '../../utils/textHelpers';
import useDataState, { DataState } from '../../utils/useDataState';
import { NameInput } from '../formComponents';

const TITLE_SUGGESTIONS_QUERY = gql`
  query TitleSuggestions($linkId: ID!) {
    titleSuggestions(linkId: $linkId)
  }
`;

interface LinkNameFieldProps {
  linkId: string;
  url: string;
  name: string;
  readOnly?: boolean;
}

const LinkNameField: React.FC<LinkNameFieldProps> = ({
  url,
  name,
  linkId,
  readOnly = false,
}) => {
  const { setValue, getValues } = useFormContext();

  const [fetchTitleSuggestions, titleSuggestionsQuery] = useDataState(
    useLazyQuery<TitleSuggestionsQuery, TitleSuggestionsQueryVariables>(
      TITLE_SUGGESTIONS_QUERY,
      { variables: { linkId } }
    )
  );

  const isOnline = useIsOnline();

  return (
    <Controller
      name={name}
      render={({ field: { onChange, onBlur, ...fieldProps } }) => (
        <Autocomplete
          {...fieldProps}
          onChange={(_, selectedTitleSuggestion) => {
            onChange(selectedTitleSuggestion);
          }}
          onBlur={(event: FocusEvent<HTMLInputElement>) => {
            setValue(name, event.target.value);
            onBlur();
          }}
          loading={titleSuggestionsQuery.state === DataState.LOADING}
          loadingText="Loading title suggestions..."
          options={
            titleSuggestionsQuery.state === DataState.DATA
              ? titleSuggestionsQuery.data.titleSuggestions
              : []
          }
          filterOptions={(options) => options}
          disableClearable
          freeSolo
          openOnFocus
          renderInput={({ ...params }) => (
            <NameInput
              type="text"
              {...params}
              autoFocus={
                isUrlValid(url) &&
                getValues(name) === urlAnalyzer(url).suggestedName
              }
              onFocus={(): void => {
                fetchTitleSuggestions();
              }}
              label="Title"
              disabled={!isOnline || readOnly}
            />
          )}
        />
      )}
    />
  );
};

export default LinkNameField;
