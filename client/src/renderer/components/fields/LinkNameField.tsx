import { gql, useLazyQuery } from '@apollo/client';
import { Autocomplete, ListItem, ListItemText } from '@mui/material';
import { urlAnalyzer } from '@structure/common';
import React, { FocusEvent } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import styled from 'styled-components';
import {
  TitleSuggestionsQuery,
  TitleSuggestionsQueryVariables,
} from '../../generated/graphql';
import useIsOnline from '../../hooks/useIsOnline';
import useQuickNumberShortcuts from '../../hooks/useQuickNumberShortcuts';
import { breakPointMobile } from '../../styles/constants';
import { QUICK_ACCESS_SHORTCUT_PREFIX, SHORTCUTS } from '../../utils/keyboard';
import { isUrlValid } from '../../utils/textHelpers';
import useDataState, { DataState } from '../../utils/useDataState';
import { NameInput } from '../formComponents';
import Shortcut from '../Shortcut';

const ListItemShortcut = styled.div`
  flex-shrink: 0;
  font-size: 70%;
  padding-left: 1em;

  @media (max-width: ${breakPointMobile}) {
    display: none;
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

  useQuickNumberShortcuts(
    titleSuggestionsQuery.state === DataState.DATA
      ? titleSuggestionsQuery.data.titleSuggestions
      : [],
    (suggestion) => {
      setValue(name, suggestion);
    }
  );

  const isOnline = useIsOnline();
  const suggestions =
    titleSuggestionsQuery.state === DataState.DATA
      ? titleSuggestionsQuery.data.titleSuggestions
      : [];

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
          options={suggestions}
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
          renderOption={(props, suggestion) => {
            const index = suggestions.indexOf(suggestion);
            return (
              <ListItem {...props}>
                <ListItemText>{suggestion}</ListItemText>
                {SHORTCUTS[QUICK_ACCESS_SHORTCUT_PREFIX + (index + 1)] ? (
                  <ListItemShortcut>
                    <Shortcut
                      shortcuts={
                        SHORTCUTS[QUICK_ACCESS_SHORTCUT_PREFIX + (index + 1)]
                      }
                    />
                  </ListItemShortcut>
                ) : undefined}
              </ListItem>
            );
          }}
        />
      )}
    />
  );
};

export default LinkNameField;
