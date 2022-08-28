import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
};

export type BaseObject = {
  _id: Scalars['ID'];
  createdAt: Scalars['Date'];
  updatedAt: Scalars['Date'];
};

export type Credentials = {
  __typename: 'Credentials';
  bookmarklet?: Maybe<Scalars['String']>;
  rss?: Maybe<Scalars['String']>;
};

export type EntitiesUpdatedSince = {
  __typename: 'EntitiesUpdatedSince';
  notes: Array<Note>;
  tags: Array<Tag>;
  timestamp: Scalars['Date'];
};

export type INote = {
  _id: Scalars['ID'];
  archivedAt?: Maybe<Scalars['Date']>;
  createdAt: Scalars['Date'];
  deletedAt?: Maybe<Scalars['Date']>;
  description: Scalars['String'];
  name: Scalars['String'];
  tags: Array<Tag>;
  type: NoteType;
  updatedAt: Scalars['Date'];
  user: User;
};

export type InputLink = {
  _id: Scalars['ID'];
  archivedAt?: InputMaybe<Scalars['Date']>;
  description?: InputMaybe<Scalars['String']>;
  domain?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  path?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['Date']>;
  url?: InputMaybe<Scalars['String']>;
};

export type InputTag = {
  _id: Scalars['ID'];
  color: Scalars['String'];
  name: Scalars['String'];
  updatedAt?: InputMaybe<Scalars['Date']>;
};

export type InputText = {
  _id: Scalars['ID'];
  description?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['Date']>;
};

export type Link = BaseObject & INote & {
  __typename: 'Link';
  _id: Scalars['ID'];
  archivedAt?: Maybe<Scalars['Date']>;
  createdAt: Scalars['Date'];
  deletedAt?: Maybe<Scalars['Date']>;
  description: Scalars['String'];
  domain: Scalars['String'];
  name: Scalars['String'];
  path: Scalars['String'];
  tags: Array<Tag>;
  type: NoteType;
  updatedAt: Scalars['Date'];
  url: Scalars['String'];
  user: User;
};

export type Mutation = {
  __typename: 'Mutation';
  addTagByNameToNote: Note;
  createText: Text;
  removeTagByIdFromNote: Note;
  requestNewCredential: User;
  revokeCredential: User;
  submitLink: Link;
  toggleArchivedNote: Note;
  toggleDeletedNote: Note;
  updateLink: Link;
  updateTag: Tag;
  updateText: Text;
};


export type MutationAddTagByNameToNoteArgs = {
  name: Scalars['String'];
  noteId: Scalars['ID'];
};


export type MutationCreateTextArgs = {
  description?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
};


export type MutationRemoveTagByIdFromNoteArgs = {
  noteId: Scalars['ID'];
  tagId: Scalars['ID'];
};


export type MutationRequestNewCredentialArgs = {
  purpose: Scalars['String'];
};


export type MutationRevokeCredentialArgs = {
  purpose: Scalars['String'];
};


export type MutationSubmitLinkArgs = {
  url: Scalars['String'];
};


export type MutationToggleArchivedNoteArgs = {
  noteId: Scalars['ID'];
};


export type MutationToggleDeletedNoteArgs = {
  noteId: Scalars['ID'];
};


export type MutationUpdateLinkArgs = {
  link: InputLink;
};


export type MutationUpdateTagArgs = {
  tag: InputTag;
};


export type MutationUpdateTextArgs = {
  text: InputText;
};

export type Note = Link | Text;

export enum NoteType {
  Link = 'LINK',
  Text = 'TEXT'
}

export type Query = {
  __typename: 'Query';
  currentUser?: Maybe<User>;
  entitiesUpdatedSince: EntitiesUpdatedSince;
  link: Link;
  links: Array<Link>;
  notes: Array<Note>;
  tag: Tag;
  tags: Array<Tag>;
  text: Text;
  titleSuggestions: Array<Scalars['String']>;
  versions: Versions;
};


export type QueryEntitiesUpdatedSinceArgs = {
  updatedSince: Scalars['Date'];
};


export type QueryLinkArgs = {
  linkId?: InputMaybe<Scalars['ID']>;
};


export type QueryLinksArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};


export type QueryNotesArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};


export type QueryTagArgs = {
  tagId?: InputMaybe<Scalars['ID']>;
};


export type QueryTagsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};


export type QueryTextArgs = {
  textId?: InputMaybe<Scalars['ID']>;
};


export type QueryTitleSuggestionsArgs = {
  linkId: Scalars['ID'];
};


export type QueryVersionsArgs = {
  currentVersion?: InputMaybe<Scalars['String']>;
};

export type Tag = BaseObject & {
  __typename: 'Tag';
  _id: Scalars['ID'];
  color: Scalars['String'];
  createdAt: Scalars['Date'];
  name: Scalars['String'];
  notes?: Maybe<Array<Maybe<Note>>>;
  updatedAt: Scalars['Date'];
  user: User;
};

export type Text = BaseObject & INote & {
  __typename: 'Text';
  _id: Scalars['ID'];
  archivedAt?: Maybe<Scalars['Date']>;
  createdAt: Scalars['Date'];
  deletedAt?: Maybe<Scalars['Date']>;
  description: Scalars['String'];
  name: Scalars['String'];
  tags: Array<Tag>;
  type: NoteType;
  updatedAt: Scalars['Date'];
  user: User;
};

export type User = BaseObject & {
  __typename: 'User';
  _id: Scalars['ID'];
  authenticationProvider?: Maybe<Scalars['String']>;
  createdAt: Scalars['Date'];
  credentials?: Maybe<Credentials>;
  name: Scalars['String'];
  updatedAt: Scalars['Date'];
};

export type Versions = {
  __typename: 'Versions';
  current: Scalars['String'];
  minimum?: Maybe<Scalars['String']>;
  /** @deprecated Upgrade to 0.20.0+ and use 'current' field */
  recommended?: Maybe<Scalars['String']>;
};

export type AddTagByNameToNoteMutationVariables = Exact<{
  noteId: Scalars['ID'];
  tagName: Scalars['String'];
}>;


export type AddTagByNameToNoteMutation = { __typename: 'Mutation', addTagByNameToNote: { __typename: 'Link', _id: string, updatedAt: any, tags: Array<{ __typename: 'Tag', _id: string, createdAt: any, updatedAt: any, name: string, color: string }> } | { __typename: 'Text', _id: string, updatedAt: any, tags: Array<{ __typename: 'Tag', _id: string, createdAt: any, updatedAt: any, name: string, color: string }> } };

export type VisitedNotesQueryVariables = Exact<{ [key: string]: never; }>;


export type VisitedNotesQuery = { __typename: 'Query', notes: Array<{ __typename: 'Link', _id: string, name: string } | { __typename: 'Text', _id: string, name: string }> };

export type RemoveTagByIdFromNoteMutationVariables = Exact<{
  noteId: Scalars['ID'];
  tagId: Scalars['ID'];
}>;


export type RemoveTagByIdFromNoteMutation = { __typename: 'Mutation', removeTagByIdFromNote: { __typename: 'Link', _id: string, tags: Array<{ __typename: 'Tag', _id: string, name: string, color: string }> } | { __typename: 'Text', _id: string, tags: Array<{ __typename: 'Tag', _id: string, name: string, color: string }> } };

export type TitleSuggestionsQueryVariables = Exact<{
  linkId: Scalars['ID'];
}>;


export type TitleSuggestionsQuery = { __typename: 'Query', titleSuggestions: Array<string> };

export type AddLinkMutationVariables = Exact<{
  url: Scalars['String'];
}>;


export type AddLinkMutation = { __typename: 'Mutation', submitLink: { __typename: 'Link', _id: string, name: string, createdAt: any, updatedAt: any, archivedAt?: any | null, deletedAt?: any | null, description: string, url: string, domain: string, tags: Array<{ __typename: 'Tag', _id: string, createdAt: any, updatedAt: any, name: string, color: string }> } };

export type AddTextMutationVariables = Exact<{
  title?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
}>;


export type AddTextMutation = { __typename: 'Mutation', createText: { __typename: 'Text', _id: string, name: string, createdAt: any, updatedAt: any, archivedAt?: any | null, deletedAt?: any | null, description: string, tags: Array<{ __typename: 'Tag', _id: string, createdAt: any, updatedAt: any, name: string, color: string }> } };

export type LinkQueryVariables = Exact<{
  linkId?: InputMaybe<Scalars['ID']>;
}>;


export type LinkQuery = { __typename: 'Query', link: { __typename: 'Link', _id: string, createdAt: any, updatedAt: any, archivedAt?: any | null, url: string, name: string, description: string, domain: string, tags: Array<{ __typename: 'Tag', _id: string, name: string, color: string }> } };

export type UpdateLinkMutationVariables = Exact<{
  link: InputLink;
}>;


export type UpdateLinkMutation = { __typename: 'Mutation', updateLink: { __typename: 'Link', _id: string, createdAt: any, updatedAt: any, url: string, domain: string, name: string, description: string, tags: Array<{ __typename: 'Tag', _id: string, name: string, color: string }> } };

export type NotesForListQueryVariables = Exact<{ [key: string]: never; }>;


export type NotesForListQuery = { __typename: 'Query', notes: Array<{ __typename: 'Link', _id: string, name: string, createdAt: any, updatedAt: any, archivedAt?: any | null, deletedAt?: any | null, description: string, url: string, domain: string, tags: Array<{ __typename: 'Tag', _id: string, createdAt: any, updatedAt: any, name: string, color: string }> } | { __typename: 'Text', _id: string, name: string, createdAt: any, updatedAt: any, archivedAt?: any | null, deletedAt?: any | null, description: string, tags: Array<{ __typename: 'Tag', _id: string, createdAt: any, updatedAt: any, name: string, color: string }> }> };

export type TinyUserQueryVariables = Exact<{ [key: string]: never; }>;


export type TinyUserQuery = { __typename: 'Query', currentUser?: { __typename: 'User', _id: string } | null };

export type TagWithNotesQueryVariables = Exact<{
  tagId: Scalars['ID'];
}>;


export type TagWithNotesQuery = { __typename: 'Query', tag: { __typename: 'Tag', _id: string, createdAt: any, updatedAt: any, name: string, color: string, notes?: Array<{ __typename: 'Link', type: NoteType, _id: string, name: string, createdAt: any, archivedAt?: any | null, description: string, url: string, domain: string, tags: Array<{ __typename: 'Tag', _id: string, name: string, color: string }> } | { __typename: 'Text', type: NoteType, _id: string, name: string, createdAt: any, archivedAt?: any | null, description: string, tags: Array<{ __typename: 'Tag', _id: string, name: string, color: string }> } | null> | null } };

export type UpdateTagMutationVariables = Exact<{
  tag: InputTag;
}>;


export type UpdateTagMutation = { __typename: 'Mutation', updateTag: { __typename: 'Tag', _id: string, createdAt: any, updatedAt: any, name: string, color: string, notes?: Array<{ __typename: 'Link', type: NoteType, _id: string, name: string, createdAt: any, archivedAt?: any | null, description: string, url: string, domain: string, tags: Array<{ __typename: 'Tag', _id: string, name: string, color: string }> } | { __typename: 'Text', type: NoteType, _id: string, name: string, createdAt: any, archivedAt?: any | null, description: string, tags: Array<{ __typename: 'Tag', _id: string, name: string, color: string }> } | null> | null } };

export type TagsQueryVariables = Exact<{ [key: string]: never; }>;


export type TagsQuery = { __typename: 'Query', tags: Array<{ __typename: 'Tag', _id: string, createdAt: any, updatedAt: any, name: string, color: string }> };

export type UpdateTag2MutationVariables = Exact<{
  tag: InputTag;
}>;


export type UpdateTag2Mutation = { __typename: 'Mutation', updateTag: { __typename: 'Tag', _id: string, createdAt: any, updatedAt: any, name: string, color: string } };

export type TextQueryVariables = Exact<{
  textId?: InputMaybe<Scalars['ID']>;
}>;


export type TextQuery = { __typename: 'Query', text: { __typename: 'Text', _id: string, createdAt: any, updatedAt: any, archivedAt?: any | null, name: string, description: string, tags: Array<{ __typename: 'Tag', _id: string, name: string, color: string }> } };

export type UpdateTextMutationVariables = Exact<{
  text: InputText;
}>;


export type UpdateTextMutation = { __typename: 'Mutation', updateText: { __typename: 'Text', _id: string, createdAt: any, updatedAt: any, archivedAt?: any | null, name: string, description: string, tags: Array<{ __typename: 'Tag', _id: string, name: string, color: string }> } };

export type UserQueryVariables = Exact<{ [key: string]: never; }>;


export type UserQuery = { __typename: 'Query', currentUser?: { __typename: 'User', _id: string, authenticationProvider?: string | null, createdAt: any, name: string } | null };

export type UserCredentialsFragmentFragment = { __typename: 'User', _id: string, credentials?: { __typename: 'Credentials', bookmarklet?: string | null, rss?: string | null } | null };

export type UserCredentialsQueryVariables = Exact<{ [key: string]: never; }>;


export type UserCredentialsQuery = { __typename: 'Query', currentUser?: { __typename: 'User', _id: string, credentials?: { __typename: 'Credentials', bookmarklet?: string | null, rss?: string | null } | null } | null };

export type RequestNewCredentialMutationVariables = Exact<{
  purpose: Scalars['String'];
}>;


export type RequestNewCredentialMutation = { __typename: 'Mutation', requestNewCredential: { __typename: 'User', _id: string, credentials?: { __typename: 'Credentials', bookmarklet?: string | null, rss?: string | null } | null } };

export type RevokeCredentialMutationVariables = Exact<{
  purpose: Scalars['String'];
}>;


export type RevokeCredentialMutation = { __typename: 'Mutation', revokeCredential: { __typename: 'User', _id: string, credentials?: { __typename: 'Credentials', bookmarklet?: string | null, rss?: string | null } | null } };

export type ToggleDeletedNoteMutationVariables = Exact<{
  noteId: Scalars['ID'];
}>;


export type ToggleDeletedNoteMutation = { __typename: 'Mutation', toggleDeletedNote: { __typename: 'Link', _id: string, deletedAt?: any | null } | { __typename: 'Text', _id: string, deletedAt?: any | null } };

export type EntitiesUpdatedSinceQueryVariables = Exact<{
  updatedSince: Scalars['Date'];
}>;


export type EntitiesUpdatedSinceQuery = { __typename: 'Query', entitiesUpdatedSince: { __typename: 'EntitiesUpdatedSince', timestamp: any, notes: Array<{ __typename: 'Link', _id: string, name: string, createdAt: any, updatedAt: any, archivedAt?: any | null, deletedAt?: any | null, description: string, url: string, domain: string, tags: Array<{ __typename: 'Tag', _id: string, createdAt: any, updatedAt: any, name: string, color: string }> } | { __typename: 'Text', _id: string, name: string, createdAt: any, updatedAt: any, archivedAt?: any | null, deletedAt?: any | null, description: string, tags: Array<{ __typename: 'Tag', _id: string, createdAt: any, updatedAt: any, name: string, color: string }> }>, tags: Array<{ __typename: 'Tag', _id: string, createdAt: any, updatedAt: any, name: string, color: string }> } };

export type ToggleArchivedNoteMutationVariables = Exact<{
  noteId: Scalars['ID'];
}>;


export type ToggleArchivedNoteMutation = { __typename: 'Mutation', toggleArchivedNote: { __typename: 'Link', _id: string, archivedAt?: any | null } | { __typename: 'Text', _id: string, archivedAt?: any | null } };

export type ProfileQueryVariables = Exact<{
  currentVersion: Scalars['String'];
}>;


export type ProfileQuery = { __typename: 'Query', currentUser?: { __typename: 'User', _id: string, name: string } | null, versions: { __typename: 'Versions', current: string, minimum?: string | null } };

export type BaseTagFragment = { __typename: 'Tag', _id: string, createdAt: any, updatedAt: any, name: string, color: string };

type BaseNote_Link_Fragment = { __typename: 'Link', _id: string, name: string, createdAt: any, updatedAt: any, archivedAt?: any | null, deletedAt?: any | null, description: string, url: string, domain: string, tags: Array<{ __typename: 'Tag', _id: string, createdAt: any, updatedAt: any, name: string, color: string }> };

type BaseNote_Text_Fragment = { __typename: 'Text', _id: string, name: string, createdAt: any, updatedAt: any, archivedAt?: any | null, deletedAt?: any | null, description: string, tags: Array<{ __typename: 'Tag', _id: string, createdAt: any, updatedAt: any, name: string, color: string }> };

export type BaseNoteFragment = BaseNote_Link_Fragment | BaseNote_Text_Fragment;

export const UserCredentialsFragmentFragmentDoc = gql`
    fragment UserCredentialsFragment on User {
  _id
  credentials {
    bookmarklet
    rss
  }
}
    `;
export const BaseTagFragmentDoc = gql`
    fragment BaseTag on Tag {
  _id
  createdAt
  updatedAt
  name
  color
}
    `;
export const BaseNoteFragmentDoc = gql`
    fragment BaseNote on INote {
  ... on INote {
    _id
    name
    createdAt
    updatedAt
    archivedAt
    deletedAt
    description
    tags {
      ...BaseTag
    }
  }
  ... on Link {
    url
    domain
  }
}
    ${BaseTagFragmentDoc}`;
export const AddTagByNameToNoteDocument = gql`
    mutation AddTagByNameToNote($noteId: ID!, $tagName: String!) {
  addTagByNameToNote(noteId: $noteId, name: $tagName) {
    ... on INote {
      _id
      updatedAt
      tags {
        ...BaseTag
      }
    }
  }
}
    ${BaseTagFragmentDoc}`;
export type AddTagByNameToNoteMutationFn = Apollo.MutationFunction<AddTagByNameToNoteMutation, AddTagByNameToNoteMutationVariables>;

/**
 * __useAddTagByNameToNoteMutation__
 *
 * To run a mutation, you first call `useAddTagByNameToNoteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddTagByNameToNoteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addTagByNameToNoteMutation, { data, loading, error }] = useAddTagByNameToNoteMutation({
 *   variables: {
 *      noteId: // value for 'noteId'
 *      tagName: // value for 'tagName'
 *   },
 * });
 */
export function useAddTagByNameToNoteMutation(baseOptions?: Apollo.MutationHookOptions<AddTagByNameToNoteMutation, AddTagByNameToNoteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddTagByNameToNoteMutation, AddTagByNameToNoteMutationVariables>(AddTagByNameToNoteDocument, options);
      }
export type AddTagByNameToNoteMutationHookResult = ReturnType<typeof useAddTagByNameToNoteMutation>;
export type AddTagByNameToNoteMutationResult = Apollo.MutationResult<AddTagByNameToNoteMutation>;
export type AddTagByNameToNoteMutationOptions = Apollo.BaseMutationOptions<AddTagByNameToNoteMutation, AddTagByNameToNoteMutationVariables>;
export const VisitedNotesDocument = gql`
    query VisitedNotes {
  notes {
    ... on INote {
      _id
      name
    }
  }
}
    `;

/**
 * __useVisitedNotesQuery__
 *
 * To run a query within a React component, call `useVisitedNotesQuery` and pass it any options that fit your needs.
 * When your component renders, `useVisitedNotesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useVisitedNotesQuery({
 *   variables: {
 *   },
 * });
 */
export function useVisitedNotesQuery(baseOptions?: Apollo.QueryHookOptions<VisitedNotesQuery, VisitedNotesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<VisitedNotesQuery, VisitedNotesQueryVariables>(VisitedNotesDocument, options);
      }
export function useVisitedNotesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<VisitedNotesQuery, VisitedNotesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<VisitedNotesQuery, VisitedNotesQueryVariables>(VisitedNotesDocument, options);
        }
export type VisitedNotesQueryHookResult = ReturnType<typeof useVisitedNotesQuery>;
export type VisitedNotesLazyQueryHookResult = ReturnType<typeof useVisitedNotesLazyQuery>;
export type VisitedNotesQueryResult = Apollo.QueryResult<VisitedNotesQuery, VisitedNotesQueryVariables>;
export const RemoveTagByIdFromNoteDocument = gql`
    mutation RemoveTagByIdFromNote($noteId: ID!, $tagId: ID!) {
  removeTagByIdFromNote(noteId: $noteId, tagId: $tagId) {
    ... on INote {
      _id
      tags {
        _id
        name
        color
      }
    }
  }
}
    `;
export type RemoveTagByIdFromNoteMutationFn = Apollo.MutationFunction<RemoveTagByIdFromNoteMutation, RemoveTagByIdFromNoteMutationVariables>;

/**
 * __useRemoveTagByIdFromNoteMutation__
 *
 * To run a mutation, you first call `useRemoveTagByIdFromNoteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveTagByIdFromNoteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeTagByIdFromNoteMutation, { data, loading, error }] = useRemoveTagByIdFromNoteMutation({
 *   variables: {
 *      noteId: // value for 'noteId'
 *      tagId: // value for 'tagId'
 *   },
 * });
 */
export function useRemoveTagByIdFromNoteMutation(baseOptions?: Apollo.MutationHookOptions<RemoveTagByIdFromNoteMutation, RemoveTagByIdFromNoteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveTagByIdFromNoteMutation, RemoveTagByIdFromNoteMutationVariables>(RemoveTagByIdFromNoteDocument, options);
      }
export type RemoveTagByIdFromNoteMutationHookResult = ReturnType<typeof useRemoveTagByIdFromNoteMutation>;
export type RemoveTagByIdFromNoteMutationResult = Apollo.MutationResult<RemoveTagByIdFromNoteMutation>;
export type RemoveTagByIdFromNoteMutationOptions = Apollo.BaseMutationOptions<RemoveTagByIdFromNoteMutation, RemoveTagByIdFromNoteMutationVariables>;
export const TitleSuggestionsDocument = gql`
    query TitleSuggestions($linkId: ID!) {
  titleSuggestions(linkId: $linkId)
}
    `;

/**
 * __useTitleSuggestionsQuery__
 *
 * To run a query within a React component, call `useTitleSuggestionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useTitleSuggestionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTitleSuggestionsQuery({
 *   variables: {
 *      linkId: // value for 'linkId'
 *   },
 * });
 */
export function useTitleSuggestionsQuery(baseOptions: Apollo.QueryHookOptions<TitleSuggestionsQuery, TitleSuggestionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TitleSuggestionsQuery, TitleSuggestionsQueryVariables>(TitleSuggestionsDocument, options);
      }
export function useTitleSuggestionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TitleSuggestionsQuery, TitleSuggestionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TitleSuggestionsQuery, TitleSuggestionsQueryVariables>(TitleSuggestionsDocument, options);
        }
export type TitleSuggestionsQueryHookResult = ReturnType<typeof useTitleSuggestionsQuery>;
export type TitleSuggestionsLazyQueryHookResult = ReturnType<typeof useTitleSuggestionsLazyQuery>;
export type TitleSuggestionsQueryResult = Apollo.QueryResult<TitleSuggestionsQuery, TitleSuggestionsQueryVariables>;
export const AddLinkDocument = gql`
    mutation AddLink($url: String!) {
  submitLink(url: $url) {
    ...BaseNote
  }
}
    ${BaseNoteFragmentDoc}`;
export type AddLinkMutationFn = Apollo.MutationFunction<AddLinkMutation, AddLinkMutationVariables>;

/**
 * __useAddLinkMutation__
 *
 * To run a mutation, you first call `useAddLinkMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddLinkMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addLinkMutation, { data, loading, error }] = useAddLinkMutation({
 *   variables: {
 *      url: // value for 'url'
 *   },
 * });
 */
export function useAddLinkMutation(baseOptions?: Apollo.MutationHookOptions<AddLinkMutation, AddLinkMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddLinkMutation, AddLinkMutationVariables>(AddLinkDocument, options);
      }
export type AddLinkMutationHookResult = ReturnType<typeof useAddLinkMutation>;
export type AddLinkMutationResult = Apollo.MutationResult<AddLinkMutation>;
export type AddLinkMutationOptions = Apollo.BaseMutationOptions<AddLinkMutation, AddLinkMutationVariables>;
export const AddTextDocument = gql`
    mutation AddText($title: String, $description: String) {
  createText(title: $title, description: $description) {
    ...BaseNote
  }
}
    ${BaseNoteFragmentDoc}`;
export type AddTextMutationFn = Apollo.MutationFunction<AddTextMutation, AddTextMutationVariables>;

/**
 * __useAddTextMutation__
 *
 * To run a mutation, you first call `useAddTextMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddTextMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addTextMutation, { data, loading, error }] = useAddTextMutation({
 *   variables: {
 *      title: // value for 'title'
 *      description: // value for 'description'
 *   },
 * });
 */
export function useAddTextMutation(baseOptions?: Apollo.MutationHookOptions<AddTextMutation, AddTextMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddTextMutation, AddTextMutationVariables>(AddTextDocument, options);
      }
export type AddTextMutationHookResult = ReturnType<typeof useAddTextMutation>;
export type AddTextMutationResult = Apollo.MutationResult<AddTextMutation>;
export type AddTextMutationOptions = Apollo.BaseMutationOptions<AddTextMutation, AddTextMutationVariables>;
export const LinkDocument = gql`
    query Link($linkId: ID) {
  link(linkId: $linkId) {
    _id
    createdAt
    updatedAt
    archivedAt
    url
    name
    description
    domain
    tags {
      _id
      name
      color
    }
  }
}
    `;

/**
 * __useLinkQuery__
 *
 * To run a query within a React component, call `useLinkQuery` and pass it any options that fit your needs.
 * When your component renders, `useLinkQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLinkQuery({
 *   variables: {
 *      linkId: // value for 'linkId'
 *   },
 * });
 */
export function useLinkQuery(baseOptions?: Apollo.QueryHookOptions<LinkQuery, LinkQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<LinkQuery, LinkQueryVariables>(LinkDocument, options);
      }
export function useLinkLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<LinkQuery, LinkQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<LinkQuery, LinkQueryVariables>(LinkDocument, options);
        }
export type LinkQueryHookResult = ReturnType<typeof useLinkQuery>;
export type LinkLazyQueryHookResult = ReturnType<typeof useLinkLazyQuery>;
export type LinkQueryResult = Apollo.QueryResult<LinkQuery, LinkQueryVariables>;
export const UpdateLinkDocument = gql`
    mutation UpdateLink($link: InputLink!) {
  updateLink(link: $link) {
    _id
    createdAt
    updatedAt
    url
    domain
    name
    description
    tags {
      _id
      name
      color
    }
  }
}
    `;
export type UpdateLinkMutationFn = Apollo.MutationFunction<UpdateLinkMutation, UpdateLinkMutationVariables>;

/**
 * __useUpdateLinkMutation__
 *
 * To run a mutation, you first call `useUpdateLinkMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateLinkMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateLinkMutation, { data, loading, error }] = useUpdateLinkMutation({
 *   variables: {
 *      link: // value for 'link'
 *   },
 * });
 */
export function useUpdateLinkMutation(baseOptions?: Apollo.MutationHookOptions<UpdateLinkMutation, UpdateLinkMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateLinkMutation, UpdateLinkMutationVariables>(UpdateLinkDocument, options);
      }
export type UpdateLinkMutationHookResult = ReturnType<typeof useUpdateLinkMutation>;
export type UpdateLinkMutationResult = Apollo.MutationResult<UpdateLinkMutation>;
export type UpdateLinkMutationOptions = Apollo.BaseMutationOptions<UpdateLinkMutation, UpdateLinkMutationVariables>;
export const NotesForListDocument = gql`
    query NotesForList {
  notes {
    ...BaseNote
  }
}
    ${BaseNoteFragmentDoc}`;

/**
 * __useNotesForListQuery__
 *
 * To run a query within a React component, call `useNotesForListQuery` and pass it any options that fit your needs.
 * When your component renders, `useNotesForListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNotesForListQuery({
 *   variables: {
 *   },
 * });
 */
export function useNotesForListQuery(baseOptions?: Apollo.QueryHookOptions<NotesForListQuery, NotesForListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<NotesForListQuery, NotesForListQueryVariables>(NotesForListDocument, options);
      }
export function useNotesForListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<NotesForListQuery, NotesForListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<NotesForListQuery, NotesForListQueryVariables>(NotesForListDocument, options);
        }
export type NotesForListQueryHookResult = ReturnType<typeof useNotesForListQuery>;
export type NotesForListLazyQueryHookResult = ReturnType<typeof useNotesForListLazyQuery>;
export type NotesForListQueryResult = Apollo.QueryResult<NotesForListQuery, NotesForListQueryVariables>;
export const TinyUserDocument = gql`
    query TinyUser {
  currentUser {
    _id
  }
}
    `;

/**
 * __useTinyUserQuery__
 *
 * To run a query within a React component, call `useTinyUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useTinyUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTinyUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useTinyUserQuery(baseOptions?: Apollo.QueryHookOptions<TinyUserQuery, TinyUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TinyUserQuery, TinyUserQueryVariables>(TinyUserDocument, options);
      }
export function useTinyUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TinyUserQuery, TinyUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TinyUserQuery, TinyUserQueryVariables>(TinyUserDocument, options);
        }
export type TinyUserQueryHookResult = ReturnType<typeof useTinyUserQuery>;
export type TinyUserLazyQueryHookResult = ReturnType<typeof useTinyUserLazyQuery>;
export type TinyUserQueryResult = Apollo.QueryResult<TinyUserQuery, TinyUserQueryVariables>;
export const TagWithNotesDocument = gql`
    query TagWithNotes($tagId: ID!) {
  tag(tagId: $tagId) {
    ...BaseTag
    notes {
      ... on INote {
        type
        _id
        name
        createdAt
        archivedAt
        description
        tags {
          _id
          name
          color
        }
      }
      ... on Link {
        url
        domain
      }
    }
  }
}
    ${BaseTagFragmentDoc}`;

/**
 * __useTagWithNotesQuery__
 *
 * To run a query within a React component, call `useTagWithNotesQuery` and pass it any options that fit your needs.
 * When your component renders, `useTagWithNotesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTagWithNotesQuery({
 *   variables: {
 *      tagId: // value for 'tagId'
 *   },
 * });
 */
export function useTagWithNotesQuery(baseOptions: Apollo.QueryHookOptions<TagWithNotesQuery, TagWithNotesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TagWithNotesQuery, TagWithNotesQueryVariables>(TagWithNotesDocument, options);
      }
export function useTagWithNotesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TagWithNotesQuery, TagWithNotesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TagWithNotesQuery, TagWithNotesQueryVariables>(TagWithNotesDocument, options);
        }
export type TagWithNotesQueryHookResult = ReturnType<typeof useTagWithNotesQuery>;
export type TagWithNotesLazyQueryHookResult = ReturnType<typeof useTagWithNotesLazyQuery>;
export type TagWithNotesQueryResult = Apollo.QueryResult<TagWithNotesQuery, TagWithNotesQueryVariables>;
export const UpdateTagDocument = gql`
    mutation UpdateTag($tag: InputTag!) {
  updateTag(tag: $tag) {
    ...BaseTag
    notes {
      ... on INote {
        type
        _id
        name
        createdAt
        archivedAt
        description
        tags {
          _id
          name
          color
        }
      }
      ... on Link {
        url
        domain
      }
    }
  }
}
    ${BaseTagFragmentDoc}`;
export type UpdateTagMutationFn = Apollo.MutationFunction<UpdateTagMutation, UpdateTagMutationVariables>;

/**
 * __useUpdateTagMutation__
 *
 * To run a mutation, you first call `useUpdateTagMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTagMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTagMutation, { data, loading, error }] = useUpdateTagMutation({
 *   variables: {
 *      tag: // value for 'tag'
 *   },
 * });
 */
export function useUpdateTagMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTagMutation, UpdateTagMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateTagMutation, UpdateTagMutationVariables>(UpdateTagDocument, options);
      }
export type UpdateTagMutationHookResult = ReturnType<typeof useUpdateTagMutation>;
export type UpdateTagMutationResult = Apollo.MutationResult<UpdateTagMutation>;
export type UpdateTagMutationOptions = Apollo.BaseMutationOptions<UpdateTagMutation, UpdateTagMutationVariables>;
export const TagsDocument = gql`
    query Tags {
  tags {
    ...BaseTag
  }
}
    ${BaseTagFragmentDoc}`;

/**
 * __useTagsQuery__
 *
 * To run a query within a React component, call `useTagsQuery` and pass it any options that fit your needs.
 * When your component renders, `useTagsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTagsQuery({
 *   variables: {
 *   },
 * });
 */
export function useTagsQuery(baseOptions?: Apollo.QueryHookOptions<TagsQuery, TagsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TagsQuery, TagsQueryVariables>(TagsDocument, options);
      }
export function useTagsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TagsQuery, TagsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TagsQuery, TagsQueryVariables>(TagsDocument, options);
        }
export type TagsQueryHookResult = ReturnType<typeof useTagsQuery>;
export type TagsLazyQueryHookResult = ReturnType<typeof useTagsLazyQuery>;
export type TagsQueryResult = Apollo.QueryResult<TagsQuery, TagsQueryVariables>;
export const UpdateTag2Document = gql`
    mutation UpdateTag2($tag: InputTag!) {
  updateTag(tag: $tag) {
    ...BaseTag
  }
}
    ${BaseTagFragmentDoc}`;
export type UpdateTag2MutationFn = Apollo.MutationFunction<UpdateTag2Mutation, UpdateTag2MutationVariables>;

/**
 * __useUpdateTag2Mutation__
 *
 * To run a mutation, you first call `useUpdateTag2Mutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTag2Mutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTag2Mutation, { data, loading, error }] = useUpdateTag2Mutation({
 *   variables: {
 *      tag: // value for 'tag'
 *   },
 * });
 */
export function useUpdateTag2Mutation(baseOptions?: Apollo.MutationHookOptions<UpdateTag2Mutation, UpdateTag2MutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateTag2Mutation, UpdateTag2MutationVariables>(UpdateTag2Document, options);
      }
export type UpdateTag2MutationHookResult = ReturnType<typeof useUpdateTag2Mutation>;
export type UpdateTag2MutationResult = Apollo.MutationResult<UpdateTag2Mutation>;
export type UpdateTag2MutationOptions = Apollo.BaseMutationOptions<UpdateTag2Mutation, UpdateTag2MutationVariables>;
export const TextDocument = gql`
    query Text($textId: ID) {
  text(textId: $textId) {
    _id
    createdAt
    updatedAt
    archivedAt
    name
    description
    tags {
      _id
      name
      color
    }
  }
}
    `;

/**
 * __useTextQuery__
 *
 * To run a query within a React component, call `useTextQuery` and pass it any options that fit your needs.
 * When your component renders, `useTextQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTextQuery({
 *   variables: {
 *      textId: // value for 'textId'
 *   },
 * });
 */
export function useTextQuery(baseOptions?: Apollo.QueryHookOptions<TextQuery, TextQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TextQuery, TextQueryVariables>(TextDocument, options);
      }
export function useTextLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TextQuery, TextQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TextQuery, TextQueryVariables>(TextDocument, options);
        }
export type TextQueryHookResult = ReturnType<typeof useTextQuery>;
export type TextLazyQueryHookResult = ReturnType<typeof useTextLazyQuery>;
export type TextQueryResult = Apollo.QueryResult<TextQuery, TextQueryVariables>;
export const UpdateTextDocument = gql`
    mutation UpdateText($text: InputText!) {
  updateText(text: $text) {
    _id
    createdAt
    updatedAt
    archivedAt
    name
    description
    tags {
      _id
      name
      color
    }
  }
}
    `;
export type UpdateTextMutationFn = Apollo.MutationFunction<UpdateTextMutation, UpdateTextMutationVariables>;

/**
 * __useUpdateTextMutation__
 *
 * To run a mutation, you first call `useUpdateTextMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTextMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTextMutation, { data, loading, error }] = useUpdateTextMutation({
 *   variables: {
 *      text: // value for 'text'
 *   },
 * });
 */
export function useUpdateTextMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTextMutation, UpdateTextMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateTextMutation, UpdateTextMutationVariables>(UpdateTextDocument, options);
      }
export type UpdateTextMutationHookResult = ReturnType<typeof useUpdateTextMutation>;
export type UpdateTextMutationResult = Apollo.MutationResult<UpdateTextMutation>;
export type UpdateTextMutationOptions = Apollo.BaseMutationOptions<UpdateTextMutation, UpdateTextMutationVariables>;
export const UserDocument = gql`
    query User {
  currentUser {
    _id
    authenticationProvider
    createdAt
    name
  }
}
    `;

/**
 * __useUserQuery__
 *
 * To run a query within a React component, call `useUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useUserQuery(baseOptions?: Apollo.QueryHookOptions<UserQuery, UserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UserQuery, UserQueryVariables>(UserDocument, options);
      }
export function useUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserQuery, UserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UserQuery, UserQueryVariables>(UserDocument, options);
        }
export type UserQueryHookResult = ReturnType<typeof useUserQuery>;
export type UserLazyQueryHookResult = ReturnType<typeof useUserLazyQuery>;
export type UserQueryResult = Apollo.QueryResult<UserQuery, UserQueryVariables>;
export const UserCredentialsDocument = gql`
    query UserCredentials {
  currentUser {
    ...UserCredentialsFragment
  }
}
    ${UserCredentialsFragmentFragmentDoc}`;

/**
 * __useUserCredentialsQuery__
 *
 * To run a query within a React component, call `useUserCredentialsQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserCredentialsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserCredentialsQuery({
 *   variables: {
 *   },
 * });
 */
export function useUserCredentialsQuery(baseOptions?: Apollo.QueryHookOptions<UserCredentialsQuery, UserCredentialsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UserCredentialsQuery, UserCredentialsQueryVariables>(UserCredentialsDocument, options);
      }
export function useUserCredentialsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserCredentialsQuery, UserCredentialsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UserCredentialsQuery, UserCredentialsQueryVariables>(UserCredentialsDocument, options);
        }
export type UserCredentialsQueryHookResult = ReturnType<typeof useUserCredentialsQuery>;
export type UserCredentialsLazyQueryHookResult = ReturnType<typeof useUserCredentialsLazyQuery>;
export type UserCredentialsQueryResult = Apollo.QueryResult<UserCredentialsQuery, UserCredentialsQueryVariables>;
export const RequestNewCredentialDocument = gql`
    mutation RequestNewCredential($purpose: String!) {
  requestNewCredential(purpose: $purpose) {
    ...UserCredentialsFragment
  }
}
    ${UserCredentialsFragmentFragmentDoc}`;
export type RequestNewCredentialMutationFn = Apollo.MutationFunction<RequestNewCredentialMutation, RequestNewCredentialMutationVariables>;

/**
 * __useRequestNewCredentialMutation__
 *
 * To run a mutation, you first call `useRequestNewCredentialMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRequestNewCredentialMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [requestNewCredentialMutation, { data, loading, error }] = useRequestNewCredentialMutation({
 *   variables: {
 *      purpose: // value for 'purpose'
 *   },
 * });
 */
export function useRequestNewCredentialMutation(baseOptions?: Apollo.MutationHookOptions<RequestNewCredentialMutation, RequestNewCredentialMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RequestNewCredentialMutation, RequestNewCredentialMutationVariables>(RequestNewCredentialDocument, options);
      }
export type RequestNewCredentialMutationHookResult = ReturnType<typeof useRequestNewCredentialMutation>;
export type RequestNewCredentialMutationResult = Apollo.MutationResult<RequestNewCredentialMutation>;
export type RequestNewCredentialMutationOptions = Apollo.BaseMutationOptions<RequestNewCredentialMutation, RequestNewCredentialMutationVariables>;
export const RevokeCredentialDocument = gql`
    mutation RevokeCredential($purpose: String!) {
  revokeCredential(purpose: $purpose) {
    ...UserCredentialsFragment
  }
}
    ${UserCredentialsFragmentFragmentDoc}`;
export type RevokeCredentialMutationFn = Apollo.MutationFunction<RevokeCredentialMutation, RevokeCredentialMutationVariables>;

/**
 * __useRevokeCredentialMutation__
 *
 * To run a mutation, you first call `useRevokeCredentialMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRevokeCredentialMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [revokeCredentialMutation, { data, loading, error }] = useRevokeCredentialMutation({
 *   variables: {
 *      purpose: // value for 'purpose'
 *   },
 * });
 */
export function useRevokeCredentialMutation(baseOptions?: Apollo.MutationHookOptions<RevokeCredentialMutation, RevokeCredentialMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RevokeCredentialMutation, RevokeCredentialMutationVariables>(RevokeCredentialDocument, options);
      }
export type RevokeCredentialMutationHookResult = ReturnType<typeof useRevokeCredentialMutation>;
export type RevokeCredentialMutationResult = Apollo.MutationResult<RevokeCredentialMutation>;
export type RevokeCredentialMutationOptions = Apollo.BaseMutationOptions<RevokeCredentialMutation, RevokeCredentialMutationVariables>;
export const ToggleDeletedNoteDocument = gql`
    mutation ToggleDeletedNote($noteId: ID!) {
  toggleDeletedNote(noteId: $noteId) {
    ... on INote {
      _id
      deletedAt
    }
  }
}
    `;
export type ToggleDeletedNoteMutationFn = Apollo.MutationFunction<ToggleDeletedNoteMutation, ToggleDeletedNoteMutationVariables>;

/**
 * __useToggleDeletedNoteMutation__
 *
 * To run a mutation, you first call `useToggleDeletedNoteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useToggleDeletedNoteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [toggleDeletedNoteMutation, { data, loading, error }] = useToggleDeletedNoteMutation({
 *   variables: {
 *      noteId: // value for 'noteId'
 *   },
 * });
 */
export function useToggleDeletedNoteMutation(baseOptions?: Apollo.MutationHookOptions<ToggleDeletedNoteMutation, ToggleDeletedNoteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ToggleDeletedNoteMutation, ToggleDeletedNoteMutationVariables>(ToggleDeletedNoteDocument, options);
      }
export type ToggleDeletedNoteMutationHookResult = ReturnType<typeof useToggleDeletedNoteMutation>;
export type ToggleDeletedNoteMutationResult = Apollo.MutationResult<ToggleDeletedNoteMutation>;
export type ToggleDeletedNoteMutationOptions = Apollo.BaseMutationOptions<ToggleDeletedNoteMutation, ToggleDeletedNoteMutationVariables>;
export const EntitiesUpdatedSinceDocument = gql`
    query EntitiesUpdatedSince($updatedSince: Date!) {
  entitiesUpdatedSince(updatedSince: $updatedSince) {
    notes {
      ...BaseNote
    }
    tags {
      ...BaseTag
    }
    timestamp
  }
}
    ${BaseNoteFragmentDoc}
${BaseTagFragmentDoc}`;

/**
 * __useEntitiesUpdatedSinceQuery__
 *
 * To run a query within a React component, call `useEntitiesUpdatedSinceQuery` and pass it any options that fit your needs.
 * When your component renders, `useEntitiesUpdatedSinceQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEntitiesUpdatedSinceQuery({
 *   variables: {
 *      updatedSince: // value for 'updatedSince'
 *   },
 * });
 */
export function useEntitiesUpdatedSinceQuery(baseOptions: Apollo.QueryHookOptions<EntitiesUpdatedSinceQuery, EntitiesUpdatedSinceQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<EntitiesUpdatedSinceQuery, EntitiesUpdatedSinceQueryVariables>(EntitiesUpdatedSinceDocument, options);
      }
export function useEntitiesUpdatedSinceLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<EntitiesUpdatedSinceQuery, EntitiesUpdatedSinceQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<EntitiesUpdatedSinceQuery, EntitiesUpdatedSinceQueryVariables>(EntitiesUpdatedSinceDocument, options);
        }
export type EntitiesUpdatedSinceQueryHookResult = ReturnType<typeof useEntitiesUpdatedSinceQuery>;
export type EntitiesUpdatedSinceLazyQueryHookResult = ReturnType<typeof useEntitiesUpdatedSinceLazyQuery>;
export type EntitiesUpdatedSinceQueryResult = Apollo.QueryResult<EntitiesUpdatedSinceQuery, EntitiesUpdatedSinceQueryVariables>;
export const ToggleArchivedNoteDocument = gql`
    mutation ToggleArchivedNote($noteId: ID!) {
  toggleArchivedNote(noteId: $noteId) {
    ... on INote {
      _id
      archivedAt
    }
  }
}
    `;
export type ToggleArchivedNoteMutationFn = Apollo.MutationFunction<ToggleArchivedNoteMutation, ToggleArchivedNoteMutationVariables>;

/**
 * __useToggleArchivedNoteMutation__
 *
 * To run a mutation, you first call `useToggleArchivedNoteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useToggleArchivedNoteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [toggleArchivedNoteMutation, { data, loading, error }] = useToggleArchivedNoteMutation({
 *   variables: {
 *      noteId: // value for 'noteId'
 *   },
 * });
 */
export function useToggleArchivedNoteMutation(baseOptions?: Apollo.MutationHookOptions<ToggleArchivedNoteMutation, ToggleArchivedNoteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ToggleArchivedNoteMutation, ToggleArchivedNoteMutationVariables>(ToggleArchivedNoteDocument, options);
      }
export type ToggleArchivedNoteMutationHookResult = ReturnType<typeof useToggleArchivedNoteMutation>;
export type ToggleArchivedNoteMutationResult = Apollo.MutationResult<ToggleArchivedNoteMutation>;
export type ToggleArchivedNoteMutationOptions = Apollo.BaseMutationOptions<ToggleArchivedNoteMutation, ToggleArchivedNoteMutationVariables>;
export const ProfileDocument = gql`
    query Profile($currentVersion: String!) {
  currentUser {
    _id
    name
  }
  versions(currentVersion: $currentVersion) {
    current
    minimum
  }
}
    `;

/**
 * __useProfileQuery__
 *
 * To run a query within a React component, call `useProfileQuery` and pass it any options that fit your needs.
 * When your component renders, `useProfileQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProfileQuery({
 *   variables: {
 *      currentVersion: // value for 'currentVersion'
 *   },
 * });
 */
export function useProfileQuery(baseOptions: Apollo.QueryHookOptions<ProfileQuery, ProfileQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProfileQuery, ProfileQueryVariables>(ProfileDocument, options);
      }
export function useProfileLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProfileQuery, ProfileQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProfileQuery, ProfileQueryVariables>(ProfileDocument, options);
        }
export type ProfileQueryHookResult = ReturnType<typeof useProfileQuery>;
export type ProfileLazyQueryHookResult = ReturnType<typeof useProfileLazyQuery>;
export type ProfileQueryResult = Apollo.QueryResult<ProfileQuery, ProfileQueryVariables>;

      export interface PossibleTypesResultData {
        possibleTypes: {
          [key: string]: string[]
        }
      }
      const result: PossibleTypesResultData = {
  "possibleTypes": {
    "BaseObject": [
      "Link",
      "Tag",
      "Text",
      "User"
    ],
    "INote": [
      "Link",
      "Text"
    ],
    "Note": [
      "Link",
      "Text"
    ]
  }
};
      export default result;
    