import { gql } from '@apollo/client'
import { useLazyQuery } from '@apollo/client/react'
import {
  Autocomplete,
  CircularProgress,
  ListItem,
  ListItemText,
} from '@mui/material'
import { urlAnalyzer } from '@structure/common'
import React, { FocusEvent } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import styled from 'styled-components'
import {
  TitleSuggestionsQuery,
  TitleSuggestionsQueryVariables,
} from '../../generated/graphql'
import useIsOnline from '../../hooks/useIsOnline'
import useQuickNumberShortcuts from '../../hooks/useQuickNumberShortcuts'
import { breakPointMobile } from '../../styles/constants'
import { QUICK_ACCESS_SHORTCUT_PREFIX, SHORTCUTS } from '../../utils/keyboard'
import { isUrlValid } from '../../utils/textHelpers'
import useDataState, { DataState } from '../../utils/useDataState'
import ErrorSnackbar from '../ErrorSnackbar'
import { NameInput } from '../formComponents'
import Shortcut from '../Shortcut'

const ListItemShortcut = styled.div`
  flex-shrink: 0;
  font-size: 70%;
  padding-left: 1em;

  @media (max-width: ${breakPointMobile}) {
    display: none;
  }
`

const TITLE_SUGGESTIONS_QUERY = gql`
  query TitleSuggestions($linkId: ID!) {
    titleSuggestions(linkId: $linkId)
  }
`

interface LinkNameFieldProps {
  linkId: string
  url: string
  name: string
  readOnly?: boolean
}

const LinkNameField: React.FC<LinkNameFieldProps> = ({
  url,
  name,
  linkId,
  readOnly: forceReadOnly = false,
}) => {
  const { setValue, getValues } = useFormContext()

  const [fetchTitleSuggestions, titleSuggestionsQuery] = useDataState(
    useLazyQuery<TitleSuggestionsQuery, TitleSuggestionsQueryVariables>(
      TITLE_SUGGESTIONS_QUERY,
      { fetchPolicy: 'no-cache' },
    ),
  )

  useQuickNumberShortcuts(
    titleSuggestionsQuery.state === DataState.DATA
      ? titleSuggestionsQuery.data.titleSuggestions
      : [],
    (suggestion) => {
      setValue(name, suggestion)
    },
  )

  const isOnline = useIsOnline()
  const readOnly = !isOnline || forceReadOnly
  const suggestions =
    titleSuggestionsQuery.state === DataState.DATA
      ? titleSuggestionsQuery.data.titleSuggestions
      : []

  return (
    <>
      <ErrorSnackbar
        error={
          'error' in titleSuggestionsQuery
            ? titleSuggestionsQuery.error
            : undefined
        }
        actionDescription={'load title suggestions'}
        autoHideDuration={1000}
      />
      <Controller
        name={name}
        render={({ field: { onChange, onBlur, ...fieldProps } }) => (
          <Autocomplete
            {...fieldProps}
            onChange={(_, selectedTitleSuggestion) => {
              onChange(selectedTitleSuggestion)
            }}
            onBlur={(event: FocusEvent<HTMLInputElement>) => {
              setValue(name, event.target.value)
              onBlur()
            }}
            loading={titleSuggestionsQuery.state === DataState.LOADING}
            loadingText='Loading title suggestions...'
            options={suggestions}
            filterOptions={(options) => options}
            disableClearable
            freeSolo
            openOnFocus
            readOnly={readOnly}
            renderInput={({ ...params }) => (
              <NameInput
                type='text'
                {...params}
                autoFocus={
                  isUrlValid(url) &&
                  getValues(name) === urlAnalyzer(url).suggestedName
                }
                onFocus={(): void => {
                  fetchTitleSuggestions({ variables: { linkId } })
                }}
                label='Title'
                InputProps={{
                  ...params.InputProps,
                  readOnly,
                  endAdornment:
                    titleSuggestionsQuery.state === DataState.LOADING ? (
                      <CircularProgress color='inherit' size={20} />
                    ) : (
                      params.InputProps.endAdornment
                    ),
                }}
              />
            )}
            renderOption={(props, suggestion) => {
              const index = suggestions.indexOf(suggestion)
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
              )
            }}
          />
        )}
      />
    </>
  )
}

export default LinkNameField
