import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: any; output: any; }
};

export type BaseObject = {
  _id: Scalars['ID']['output'];
  createdAt: Scalars['Date']['output'];
  updatedAt: Scalars['Date']['output'];
};

export type CreateTokenResult = {
  __typename: 'CreateTokenResult';
  rawToken: Scalars['String']['output'];
  user: User;
};

export type EntitiesUpdatedSince = {
  __typename: 'EntitiesUpdatedSince';
  addedNotes: Array<Note>;
  addedTags: Array<Tag>;
  cacheId: Scalars['ID']['output'];
  removedNoteIds: Array<Scalars['ID']['output']>;
  removedTagIds: Array<Scalars['ID']['output']>;
  updatedNotes: Array<Note>;
  updatedTags: Array<Tag>;
};

export type InputNote = {
  _id: Scalars['ID']['input'];
  archivedAt?: InputMaybe<Scalars['Date']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  domain?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  path?: InputMaybe<Scalars['String']['input']>;
  updatedAt: Scalars['Date']['input'];
  url?: InputMaybe<Scalars['String']['input']>;
};

export type InputTag = {
  _id: Scalars['ID']['input'];
  color: Scalars['String']['input'];
  name: Scalars['String']['input'];
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

export type Mutation = {
  __typename: 'Mutation';
  addTagByNameToNote: Note;
  createNote: Note;
  createTag: Tag;
  createToken: CreateTokenResult;
  permanentlyDeleteTag: Tag;
  removeTagByIdFromNote: Note;
  revokeToken: User;
  shareTag: Tag;
  toggleArchivedNote: Note;
  toggleDeletedNote: Note;
  unshareTag: Tag;
  updateNote: Note;
  updatePermissionOnTag: Tag;
  updateTag: Tag;
};


export type MutationAddTagByNameToNoteArgs = {
  name: Scalars['String']['input'];
  noteId: Scalars['ID']['input'];
};


export type MutationCreateNoteArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};


export type MutationCreateTagArgs = {
  color?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};


export type MutationCreateTokenArgs = {
  comment?: InputMaybe<Scalars['String']['input']>;
};


export type MutationPermanentlyDeleteTagArgs = {
  tagId: Scalars['ID']['input'];
};


export type MutationRemoveTagByIdFromNoteArgs = {
  noteId: Scalars['ID']['input'];
  tagId: Scalars['ID']['input'];
};


export type MutationRevokeTokenArgs = {
  tokenId: Scalars['ID']['input'];
};


export type MutationShareTagArgs = {
  tagId: Scalars['ID']['input'];
  username: Scalars['String']['input'];
};


export type MutationToggleArchivedNoteArgs = {
  noteId: Scalars['ID']['input'];
};


export type MutationToggleDeletedNoteArgs = {
  noteId: Scalars['ID']['input'];
};


export type MutationUnshareTagArgs = {
  tagId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationUpdateNoteArgs = {
  note: InputNote;
};


export type MutationUpdatePermissionOnTagArgs = {
  granted: Scalars['Boolean']['input'];
  mode: Scalars['String']['input'];
  resource: Scalars['String']['input'];
  tagId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationUpdateTagArgs = {
  tag: InputTag;
};

export type Note = BaseObject & {
  __typename: 'Note';
  _id: Scalars['ID']['output'];
  archivedAt?: Maybe<Scalars['Date']['output']>;
  changedAt: Scalars['Date']['output'];
  createdAt: Scalars['Date']['output'];
  deletedAt?: Maybe<Scalars['Date']['output']>;
  description: Scalars['String']['output'];
  domain?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  path?: Maybe<Scalars['String']['output']>;
  tags: Array<Tag>;
  updatedAt: Scalars['Date']['output'];
  url?: Maybe<Scalars['String']['output']>;
  user: User;
};

export type NotesPermissions = {
  __typename: 'NotesPermissions';
  read: Scalars['Boolean']['output'];
  write: Scalars['Boolean']['output'];
};

export type Query = {
  __typename: 'Query';
  currentUser?: Maybe<User>;
  entitiesUpdatedSince: EntitiesUpdatedSince;
  note: Note;
  notes: Array<Note>;
  tag: Tag;
  tags: Array<Tag>;
  titleSuggestions: Array<Scalars['String']['output']>;
  versions: Versions;
};


export type QueryEntitiesUpdatedSinceArgs = {
  cacheId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryNoteArgs = {
  noteId: Scalars['ID']['input'];
};


export type QueryNotesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryTagArgs = {
  tagId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryTagsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryTitleSuggestionsArgs = {
  noteId: Scalars['ID']['input'];
};


export type QueryVersionsArgs = {
  currentVersion?: InputMaybe<Scalars['String']['input']>;
};

export type Tag = BaseObject & {
  __typename: 'Tag';
  _id: Scalars['ID']['output'];
  changedAt: Scalars['Date']['output'];
  color: Scalars['String']['output'];
  createdAt: Scalars['Date']['output'];
  name: Scalars['String']['output'];
  noteCount: Scalars['Int']['output'];
  notes?: Maybe<Array<Maybe<Note>>>;
  permissions: Array<UserPermissions>;
  updatedAt: Scalars['Date']['output'];
  user: User;
};


export type TagPermissionsArgs = {
  onlyMine?: InputMaybe<Scalars['Boolean']['input']>;
};

export type TagPermissions = {
  __typename: 'TagPermissions';
  read: Scalars['Boolean']['output'];
  share: Scalars['Boolean']['output'];
  use: Scalars['Boolean']['output'];
  write: Scalars['Boolean']['output'];
};

export type Token = {
  __typename: 'Token';
  _id: Scalars['ID']['output'];
  comment?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Date']['output'];
  purpose: Scalars['String']['output'];
};

export type User = BaseObject & {
  __typename: 'User';
  _id: Scalars['ID']['output'];
  authenticationProvider?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Date']['output'];
  name: Scalars['String']['output'];
  tokens: Array<Token>;
  updatedAt: Scalars['Date']['output'];
};

export type UserPermissions = {
  __typename: 'UserPermissions';
  notes: NotesPermissions;
  tag: TagPermissions;
  user: User;
};

export type Versions = {
  __typename: 'Versions';
  current: Scalars['String']['output'];
  minimum?: Maybe<Scalars['String']['output']>;
};

export type NotesListCacheSeedQueryVariables = Exact<{ [key: string]: never; }>;


export type NotesListCacheSeedQuery = { __typename: 'Query', notes: Array<{ __typename: 'Note', _id: string }> };

export type TagsWithCountsQueryVariables = Exact<{ [key: string]: never; }>;


export type TagsWithCountsQuery = { __typename: 'Query', tags: Array<{ __typename: 'Tag', noteCount: number, _id: string, createdAt: any, updatedAt: any, changedAt: any, name: string, color: string, user: { __typename: 'User', _id: string, name: string }, permissions: Array<{ __typename: 'UserPermissions', user: { __typename: 'User', _id: string, name: string }, tag: { __typename: 'TagPermissions', read: boolean, write: boolean, use: boolean, share: boolean }, notes: { __typename: 'NotesPermissions', read: boolean, write: boolean } }> }> };

export type VisitedNotesQueryVariables = Exact<{ [key: string]: never; }>;


export type VisitedNotesQuery = { __typename: 'Query', notes: Array<{ __typename: 'Note', _id: string, name: string }> };

export type NoteInListFragment = { __typename: 'Note', _id: string, name: string, url?: string | null, domain?: string | null, createdAt: any, updatedAt: any, changedAt: any, archivedAt?: any | null, deletedAt?: any | null, description: string, tags: Array<{ __typename: 'Tag', _id: string, createdAt: any, updatedAt: any, changedAt: any, name: string, color: string, user: { __typename: 'User', _id: string, name: string }, permissions: Array<{ __typename: 'UserPermissions', user: { __typename: 'User', _id: string, name: string }, tag: { __typename: 'TagPermissions', read: boolean, write: boolean, use: boolean, share: boolean }, notes: { __typename: 'NotesPermissions', read: boolean, write: boolean } }> }>, user: { __typename: 'User', _id: string, name: string } };

export type ShareTagMutationVariables = Exact<{
  tagId: Scalars['ID']['input'];
  username: Scalars['String']['input'];
}>;


export type ShareTagMutation = { __typename: 'Mutation', shareTag: { __typename: 'Tag', _id: string, updatedAt: any, permissions: Array<{ __typename: 'UserPermissions', user: { __typename: 'User', _id: string }, tag: { __typename: 'TagPermissions', read: boolean, write: boolean, use: boolean, share: boolean }, notes: { __typename: 'NotesPermissions', read: boolean, write: boolean } }> } };

export type UnshareTagMutationVariables = Exact<{
  tagId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
}>;


export type UnshareTagMutation = { __typename: 'Mutation', unshareTag: { __typename: 'Tag', _id: string, updatedAt: any, permissions: Array<{ __typename: 'UserPermissions', user: { __typename: 'User', _id: string }, tag: { __typename: 'TagPermissions', read: boolean, write: boolean, use: boolean, share: boolean }, notes: { __typename: 'NotesPermissions', read: boolean, write: boolean } }> } };

export type UpdatePermissionOnTagMutationVariables = Exact<{
  tagId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
  resource: Scalars['String']['input'];
  mode: Scalars['String']['input'];
  granted: Scalars['Boolean']['input'];
}>;


export type UpdatePermissionOnTagMutation = { __typename: 'Mutation', updatePermissionOnTag: { __typename: 'Tag', _id: string, updatedAt: any, permissions: Array<{ __typename: 'UserPermissions', user: { __typename: 'User', _id: string }, tag: { __typename: 'TagPermissions', read: boolean, write: boolean, use: boolean, share: boolean }, notes: { __typename: 'NotesPermissions', read: boolean, write: boolean } }> } };

export type RemoveTagByIdFromNoteMutationVariables = Exact<{
  noteId: Scalars['ID']['input'];
  tagId: Scalars['ID']['input'];
}>;


export type RemoveTagByIdFromNoteMutation = { __typename: 'Mutation', removeTagByIdFromNote: { __typename: 'Note', _id: string, updatedAt: any, user: { __typename: 'User', _id: string }, tags: Array<{ __typename: 'Tag', _id: string, createdAt: any, updatedAt: any, changedAt: any, name: string, color: string, notes?: Array<{ __typename: 'Note', _id: string } | null> | null, user: { __typename: 'User', _id: string, name: string }, permissions: Array<{ __typename: 'UserPermissions', user: { __typename: 'User', _id: string, name: string }, tag: { __typename: 'TagPermissions', read: boolean, write: boolean, use: boolean, share: boolean }, notes: { __typename: 'NotesPermissions', read: boolean, write: boolean } }> }> } };

export type TitleSuggestionsQueryVariables = Exact<{
  noteId: Scalars['ID']['input'];
}>;


export type TitleSuggestionsQuery = { __typename: 'Query', titleSuggestions: Array<string> };

export type TinyUserQueryVariables = Exact<{ [key: string]: never; }>;


export type TinyUserQuery = { __typename: 'Query', currentUser?: { __typename: 'User', _id: string } | null };

export type TagWithNotesQueryVariables = Exact<{
  tagId: Scalars['ID']['input'];
}>;


export type TagWithNotesQuery = { __typename: 'Query', tag: { __typename: 'Tag', _id: string, createdAt: any, updatedAt: any, changedAt: any, name: string, color: string, user: { __typename: 'User', _id: string, name: string }, notes?: Array<{ __typename: 'Note', _id: string } | null> | null, permissions: Array<{ __typename: 'UserPermissions', user: { __typename: 'User', _id: string, name: string }, tag: { __typename: 'TagPermissions', read: boolean, write: boolean, use: boolean, share: boolean }, notes: { __typename: 'NotesPermissions', read: boolean, write: boolean } }> } };

export type UpdateTagMutationVariables = Exact<{
  tag: InputTag;
}>;


export type UpdateTagMutation = { __typename: 'Mutation', updateTag: { __typename: 'Tag', _id: string, createdAt: any, updatedAt: any, changedAt: any, name: string, color: string, user: { __typename: 'User', _id: string, name: string }, permissions: Array<{ __typename: 'UserPermissions', user: { __typename: 'User', _id: string, name: string }, tag: { __typename: 'TagPermissions', read: boolean, write: boolean, use: boolean, share: boolean }, notes: { __typename: 'NotesPermissions', read: boolean, write: boolean } }> } };

export type DeleteTagMutationVariables = Exact<{
  tagId: Scalars['ID']['input'];
}>;


export type DeleteTagMutation = { __typename: 'Mutation', permanentlyDeleteTag: { __typename: 'Tag', _id: string, notes?: Array<{ __typename: 'Note', _id: string, tags: Array<{ __typename: 'Tag', _id: string }> } | null> | null } };

export type TagsQueryVariables = Exact<{ [key: string]: never; }>;


export type TagsQuery = { __typename: 'Query', tags: Array<{ __typename: 'Tag', _id: string, createdAt: any, updatedAt: any, changedAt: any, name: string, color: string, user: { __typename: 'User', _id: string, name: string }, permissions: Array<{ __typename: 'UserPermissions', user: { __typename: 'User', _id: string, name: string }, tag: { __typename: 'TagPermissions', read: boolean, write: boolean, use: boolean, share: boolean }, notes: { __typename: 'NotesPermissions', read: boolean, write: boolean } }> }> };

export type UpdateTag2MutationVariables = Exact<{
  tag: InputTag;
}>;


export type UpdateTag2Mutation = { __typename: 'Mutation', updateTag: { __typename: 'Tag', _id: string, createdAt: any, updatedAt: any, changedAt: any, name: string, color: string, user: { __typename: 'User', _id: string, name: string }, permissions: Array<{ __typename: 'UserPermissions', user: { __typename: 'User', _id: string, name: string }, tag: { __typename: 'TagPermissions', read: boolean, write: boolean, use: boolean, share: boolean }, notes: { __typename: 'NotesPermissions', read: boolean, write: boolean } }> } };

export type UserQueryVariables = Exact<{ [key: string]: never; }>;


export type UserQuery = { __typename: 'Query', currentUser?: { __typename: 'User', _id: string, authenticationProvider?: string | null, createdAt: any, name: string } | null };

export type UserTokensFragmentFragment = { __typename: 'User', _id: string, tokens: Array<{ __typename: 'Token', _id: string, purpose: string, comment?: string | null, createdAt: any }> };

export type UserTokensQueryVariables = Exact<{ [key: string]: never; }>;


export type UserTokensQuery = { __typename: 'Query', currentUser?: { __typename: 'User', _id: string, tokens: Array<{ __typename: 'Token', _id: string, purpose: string, comment?: string | null, createdAt: any }> } | null };

export type RevokeTokenMutationVariables = Exact<{
  tokenId: Scalars['ID']['input'];
}>;


export type RevokeTokenMutation = { __typename: 'Mutation', revokeToken: { __typename: 'User', _id: string, tokens: Array<{ __typename: 'Token', _id: string, purpose: string, comment?: string | null, createdAt: any }> } };

export type CreateTagMutationVariables = Exact<{
  name: Scalars['String']['input'];
  color?: InputMaybe<Scalars['String']['input']>;
}>;


export type CreateTagMutation = { __typename: 'Mutation', createTag: { __typename: 'Tag', _id: string, createdAt: any, updatedAt: any, changedAt: any, name: string, color: string, user: { __typename: 'User', _id: string, name: string }, permissions: Array<{ __typename: 'UserPermissions', user: { __typename: 'User', _id: string, name: string }, tag: { __typename: 'TagPermissions', read: boolean, write: boolean, use: boolean, share: boolean }, notes: { __typename: 'NotesPermissions', read: boolean, write: boolean } }> } };

export type ToggleDeletedNoteMutationVariables = Exact<{
  noteId: Scalars['ID']['input'];
}>;


export type ToggleDeletedNoteMutation = { __typename: 'Mutation', toggleDeletedNote: { __typename: 'Note', _id: string, deletedAt?: any | null } };

export type EntitiesUpdatedSinceQueryVariables = Exact<{
  cacheId?: InputMaybe<Scalars['ID']['input']>;
}>;


export type EntitiesUpdatedSinceQuery = { __typename: 'Query', entitiesUpdatedSince: { __typename: 'EntitiesUpdatedSince', removedNoteIds: Array<string>, removedTagIds: Array<string>, cacheId: string, addedNotes: Array<{ __typename: 'Note', _id: string, url?: string | null, domain?: string | null, name: string, createdAt: any, updatedAt: any, changedAt: any, archivedAt?: any | null, deletedAt?: any | null, description: string, tags: Array<{ __typename: 'Tag', _id: string }>, user: { __typename: 'User', _id: string, name: string } }>, updatedNotes: Array<{ __typename: 'Note', _id: string, url?: string | null, domain?: string | null, name: string, createdAt: any, updatedAt: any, changedAt: any, archivedAt?: any | null, deletedAt?: any | null, description: string, tags: Array<{ __typename: 'Tag', _id: string }>, user: { __typename: 'User', _id: string, name: string } }>, addedTags: Array<{ __typename: 'Tag', _id: string, createdAt: any, updatedAt: any, changedAt: any, name: string, color: string, user: { __typename: 'User', _id: string, name: string }, permissions: Array<{ __typename: 'UserPermissions', user: { __typename: 'User', _id: string, name: string }, tag: { __typename: 'TagPermissions', read: boolean, write: boolean, use: boolean, share: boolean }, notes: { __typename: 'NotesPermissions', read: boolean, write: boolean } }> }>, updatedTags: Array<{ __typename: 'Tag', _id: string, createdAt: any, updatedAt: any, changedAt: any, name: string, color: string, user: { __typename: 'User', _id: string, name: string }, permissions: Array<{ __typename: 'UserPermissions', user: { __typename: 'User', _id: string, name: string }, tag: { __typename: 'TagPermissions', read: boolean, write: boolean, use: boolean, share: boolean }, notes: { __typename: 'NotesPermissions', read: boolean, write: boolean } }> }> } };

export type PopulateNotesCacheQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type PopulateNotesCacheQueryQuery = { __typename: 'Query', notes: Array<{ __typename: 'Note', _id: string, url?: string | null, domain?: string | null, name: string, createdAt: any, updatedAt: any, changedAt: any, archivedAt?: any | null, deletedAt?: any | null, description: string, tags: Array<{ __typename: 'Tag', _id: string }>, user: { __typename: 'User', _id: string, name: string } }> };

export type WriteNoteToCacheQueryQueryVariables = Exact<{
  noteId: Scalars['ID']['input'];
}>;


export type WriteNoteToCacheQueryQuery = { __typename: 'Query', note: { __typename: 'Note', _id: string, url?: string | null, domain?: string | null, name: string, createdAt: any, updatedAt: any, changedAt: any, archivedAt?: any | null, deletedAt?: any | null, description: string, tags: Array<{ __typename: 'Tag', _id: string }>, user: { __typename: 'User', _id: string, name: string } } };

export type WriteTagToCacheQueryQueryVariables = Exact<{
  tagId: Scalars['ID']['input'];
}>;


export type WriteTagToCacheQueryQuery = { __typename: 'Query', tag: { __typename: 'Tag', _id: string, createdAt: any, updatedAt: any, changedAt: any, name: string, color: string, user: { __typename: 'User', _id: string, name: string }, permissions: Array<{ __typename: 'UserPermissions', user: { __typename: 'User', _id: string, name: string }, tag: { __typename: 'TagPermissions', read: boolean, write: boolean, use: boolean, share: boolean }, notes: { __typename: 'NotesPermissions', read: boolean, write: boolean } }> } };

export type NotesForSortAndFilterQueryVariables = Exact<{ [key: string]: never; }>;


export type NotesForSortAndFilterQuery = { __typename: 'Query', notes: Array<{ __typename: 'Note', _id: string, createdAt: any, updatedAt: any, changedAt: any, archivedAt?: any | null, name: string, url?: string | null, tags: Array<{ __typename: 'Tag', _id: string }> }> };

export type TagsForSearchQueryVariables = Exact<{ [key: string]: never; }>;


export type TagsForSearchQuery = { __typename: 'Query', tags: Array<{ __typename: 'Tag', _id: string, name: string }> };

export type ToggleArchivedNoteMutationVariables = Exact<{
  noteId: Scalars['ID']['input'];
}>;


export type ToggleArchivedNoteMutation = { __typename: 'Mutation', toggleArchivedNote: { __typename: 'Note', _id: string, archivedAt?: any | null, updatedAt: any } };

export type ProfileQueryVariables = Exact<{
  currentVersion: Scalars['String']['input'];
}>;


export type ProfileQuery = { __typename: 'Query', currentUser?: { __typename: 'User', _id: string, name: string } | null, versions: { __typename: 'Versions', current: string, minimum?: string | null } };

export type BaseUserFragment = { __typename: 'User', _id: string, name: string };

export type BaseTagFragment = { __typename: 'Tag', _id: string, createdAt: any, updatedAt: any, changedAt: any, name: string, color: string, user: { __typename: 'User', _id: string, name: string }, permissions: Array<{ __typename: 'UserPermissions', user: { __typename: 'User', _id: string, name: string }, tag: { __typename: 'TagPermissions', read: boolean, write: boolean, use: boolean, share: boolean }, notes: { __typename: 'NotesPermissions', read: boolean, write: boolean } }> };

export type BaseNoteFragment = { __typename: 'Note', _id: string, url?: string | null, domain?: string | null, name: string, createdAt: any, updatedAt: any, changedAt: any, archivedAt?: any | null, deletedAt?: any | null, description: string, tags: Array<{ __typename: 'Tag', _id: string }>, user: { __typename: 'User', _id: string, name: string } };

export type AddNoteMutationVariables = Exact<{
  url?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
}>;


export type AddNoteMutation = { __typename: 'Mutation', createNote: { __typename: 'Note', _id: string, url?: string | null, domain?: string | null, name: string, createdAt: any, updatedAt: any, changedAt: any, archivedAt?: any | null, deletedAt?: any | null, description: string, tags: Array<{ __typename: 'Tag', _id: string }>, user: { __typename: 'User', _id: string, name: string } } };

export type NoteQueryVariables = Exact<{
  noteId: Scalars['ID']['input'];
}>;


export type NoteQuery = { __typename: 'Query', note: { __typename: 'Note', _id: string, createdAt: any, updatedAt: any, changedAt: any, archivedAt?: any | null, url?: string | null, name: string, description: string, domain?: string | null, user: { __typename: 'User', _id: string, name: string }, tags: Array<{ __typename: 'Tag', _id: string, createdAt: any, updatedAt: any, changedAt: any, name: string, color: string, user: { __typename: 'User', _id: string, name: string }, permissions: Array<{ __typename: 'UserPermissions', user: { __typename: 'User', _id: string, name: string }, tag: { __typename: 'TagPermissions', read: boolean, write: boolean, use: boolean, share: boolean }, notes: { __typename: 'NotesPermissions', read: boolean, write: boolean } }> }> } };

export type UpdateNoteMutationVariables = Exact<{
  note: InputNote;
}>;


export type UpdateNoteMutation = { __typename: 'Mutation', updateNote: { __typename: 'Note', _id: string, createdAt: any, updatedAt: any, changedAt: any, url?: string | null, domain?: string | null, name: string, description: string, tags: Array<{ __typename: 'Tag', _id: string, name: string, color: string }> } };

export type AddTagByNameToNoteMutationVariables = Exact<{
  noteId: Scalars['ID']['input'];
  tagName: Scalars['String']['input'];
}>;


export type AddTagByNameToNoteMutation = { __typename: 'Mutation', addTagByNameToNote: { __typename: 'Note', _id: string, updatedAt: any, tags: Array<{ __typename: 'Tag', noteCount: number, _id: string, createdAt: any, updatedAt: any, changedAt: any, name: string, color: string, notes?: Array<{ __typename: 'Note', _id: string } | null> | null, user: { __typename: 'User', _id: string, name: string }, permissions: Array<{ __typename: 'UserPermissions', user: { __typename: 'User', _id: string, name: string }, tag: { __typename: 'TagPermissions', read: boolean, write: boolean, use: boolean, share: boolean }, notes: { __typename: 'NotesPermissions', read: boolean, write: boolean } }> }> } };

export const BaseTagFragmentDoc = gql`
    fragment BaseTag on Tag {
  _id
  createdAt
  updatedAt
  changedAt
  name
  color
  user {
    _id
    name
  }
  permissions {
    user {
      _id
      name
    }
    tag {
      read
      write
      use
      share
    }
    notes {
      read
      write
    }
  }
}
    `;
export const BaseUserFragmentDoc = gql`
    fragment BaseUser on User {
  _id
  name
}
    `;
export const NoteInListFragmentDoc = gql`
    fragment NoteInList on Note {
  _id
  name
  url
  domain
  createdAt
  updatedAt
  changedAt
  archivedAt
  deletedAt
  description
  tags {
    ...BaseTag
  }
  user {
    ...BaseUser
  }
}
    ${BaseTagFragmentDoc}
${BaseUserFragmentDoc}`;
export const UserTokensFragmentFragmentDoc = gql`
    fragment UserTokensFragment on User {
  _id
  tokens {
    _id
    purpose
    comment
    createdAt
  }
}
    `;
export const BaseNoteFragmentDoc = gql`
    fragment BaseNote on Note {
  _id
  url
  domain
  name
  createdAt
  updatedAt
  changedAt
  archivedAt
  deletedAt
  description
  tags {
    _id
  }
  user {
    ...BaseUser
  }
}
    ${BaseUserFragmentDoc}`;
export const NotesListCacheSeedDocument = gql`
    query NotesListCacheSeed {
  notes {
    _id
  }
}
    `;

/**
 * __useNotesListCacheSeedQuery__
 *
 * To run a query within a React component, call `useNotesListCacheSeedQuery` and pass it any options that fit your needs.
 * When your component renders, `useNotesListCacheSeedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNotesListCacheSeedQuery({
 *   variables: {
 *   },
 * });
 */
export function useNotesListCacheSeedQuery(baseOptions?: Apollo.QueryHookOptions<NotesListCacheSeedQuery, NotesListCacheSeedQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<NotesListCacheSeedQuery, NotesListCacheSeedQueryVariables>(NotesListCacheSeedDocument, options);
      }
export function useNotesListCacheSeedLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<NotesListCacheSeedQuery, NotesListCacheSeedQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<NotesListCacheSeedQuery, NotesListCacheSeedQueryVariables>(NotesListCacheSeedDocument, options);
        }
export function useNotesListCacheSeedSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<NotesListCacheSeedQuery, NotesListCacheSeedQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<NotesListCacheSeedQuery, NotesListCacheSeedQueryVariables>(NotesListCacheSeedDocument, options);
        }
export type NotesListCacheSeedQueryHookResult = ReturnType<typeof useNotesListCacheSeedQuery>;
export type NotesListCacheSeedLazyQueryHookResult = ReturnType<typeof useNotesListCacheSeedLazyQuery>;
export type NotesListCacheSeedSuspenseQueryHookResult = ReturnType<typeof useNotesListCacheSeedSuspenseQuery>;
export type NotesListCacheSeedQueryResult = Apollo.QueryResult<NotesListCacheSeedQuery, NotesListCacheSeedQueryVariables>;
export const TagsWithCountsDocument = gql`
    query TagsWithCounts {
  tags {
    ...BaseTag
    noteCount
  }
}
    ${BaseTagFragmentDoc}`;

/**
 * __useTagsWithCountsQuery__
 *
 * To run a query within a React component, call `useTagsWithCountsQuery` and pass it any options that fit your needs.
 * When your component renders, `useTagsWithCountsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTagsWithCountsQuery({
 *   variables: {
 *   },
 * });
 */
export function useTagsWithCountsQuery(baseOptions?: Apollo.QueryHookOptions<TagsWithCountsQuery, TagsWithCountsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TagsWithCountsQuery, TagsWithCountsQueryVariables>(TagsWithCountsDocument, options);
      }
export function useTagsWithCountsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TagsWithCountsQuery, TagsWithCountsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TagsWithCountsQuery, TagsWithCountsQueryVariables>(TagsWithCountsDocument, options);
        }
export function useTagsWithCountsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<TagsWithCountsQuery, TagsWithCountsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<TagsWithCountsQuery, TagsWithCountsQueryVariables>(TagsWithCountsDocument, options);
        }
export type TagsWithCountsQueryHookResult = ReturnType<typeof useTagsWithCountsQuery>;
export type TagsWithCountsLazyQueryHookResult = ReturnType<typeof useTagsWithCountsLazyQuery>;
export type TagsWithCountsSuspenseQueryHookResult = ReturnType<typeof useTagsWithCountsSuspenseQuery>;
export type TagsWithCountsQueryResult = Apollo.QueryResult<TagsWithCountsQuery, TagsWithCountsQueryVariables>;
export const VisitedNotesDocument = gql`
    query VisitedNotes {
  notes {
    _id
    name
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
export function useVisitedNotesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<VisitedNotesQuery, VisitedNotesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<VisitedNotesQuery, VisitedNotesQueryVariables>(VisitedNotesDocument, options);
        }
export type VisitedNotesQueryHookResult = ReturnType<typeof useVisitedNotesQuery>;
export type VisitedNotesLazyQueryHookResult = ReturnType<typeof useVisitedNotesLazyQuery>;
export type VisitedNotesSuspenseQueryHookResult = ReturnType<typeof useVisitedNotesSuspenseQuery>;
export type VisitedNotesQueryResult = Apollo.QueryResult<VisitedNotesQuery, VisitedNotesQueryVariables>;
export const ShareTagDocument = gql`
    mutation ShareTag($tagId: ID!, $username: String!) {
  shareTag(tagId: $tagId, username: $username) {
    _id
    updatedAt
    permissions {
      user {
        _id
      }
      tag {
        read
        write
        use
        share
      }
      notes {
        read
        write
      }
    }
  }
}
    `;
export type ShareTagMutationFn = Apollo.MutationFunction<ShareTagMutation, ShareTagMutationVariables>;

/**
 * __useShareTagMutation__
 *
 * To run a mutation, you first call `useShareTagMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useShareTagMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [shareTagMutation, { data, loading, error }] = useShareTagMutation({
 *   variables: {
 *      tagId: // value for 'tagId'
 *      username: // value for 'username'
 *   },
 * });
 */
export function useShareTagMutation(baseOptions?: Apollo.MutationHookOptions<ShareTagMutation, ShareTagMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ShareTagMutation, ShareTagMutationVariables>(ShareTagDocument, options);
      }
export type ShareTagMutationHookResult = ReturnType<typeof useShareTagMutation>;
export type ShareTagMutationResult = Apollo.MutationResult<ShareTagMutation>;
export type ShareTagMutationOptions = Apollo.BaseMutationOptions<ShareTagMutation, ShareTagMutationVariables>;
export const UnshareTagDocument = gql`
    mutation UnshareTag($tagId: ID!, $userId: ID!) {
  unshareTag(tagId: $tagId, userId: $userId) {
    _id
    updatedAt
    permissions {
      user {
        _id
      }
      tag {
        read
        write
        use
        share
      }
      notes {
        read
        write
      }
    }
  }
}
    `;
export type UnshareTagMutationFn = Apollo.MutationFunction<UnshareTagMutation, UnshareTagMutationVariables>;

/**
 * __useUnshareTagMutation__
 *
 * To run a mutation, you first call `useUnshareTagMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnshareTagMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unshareTagMutation, { data, loading, error }] = useUnshareTagMutation({
 *   variables: {
 *      tagId: // value for 'tagId'
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useUnshareTagMutation(baseOptions?: Apollo.MutationHookOptions<UnshareTagMutation, UnshareTagMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UnshareTagMutation, UnshareTagMutationVariables>(UnshareTagDocument, options);
      }
export type UnshareTagMutationHookResult = ReturnType<typeof useUnshareTagMutation>;
export type UnshareTagMutationResult = Apollo.MutationResult<UnshareTagMutation>;
export type UnshareTagMutationOptions = Apollo.BaseMutationOptions<UnshareTagMutation, UnshareTagMutationVariables>;
export const UpdatePermissionOnTagDocument = gql`
    mutation UpdatePermissionOnTag($tagId: ID!, $userId: ID!, $resource: String!, $mode: String!, $granted: Boolean!) {
  updatePermissionOnTag(
    tagId: $tagId
    userId: $userId
    resource: $resource
    mode: $mode
    granted: $granted
  ) {
    _id
    updatedAt
    permissions {
      user {
        _id
      }
      tag {
        read
        write
        use
        share
      }
      notes {
        read
        write
      }
    }
  }
}
    `;
export type UpdatePermissionOnTagMutationFn = Apollo.MutationFunction<UpdatePermissionOnTagMutation, UpdatePermissionOnTagMutationVariables>;

/**
 * __useUpdatePermissionOnTagMutation__
 *
 * To run a mutation, you first call `useUpdatePermissionOnTagMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePermissionOnTagMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePermissionOnTagMutation, { data, loading, error }] = useUpdatePermissionOnTagMutation({
 *   variables: {
 *      tagId: // value for 'tagId'
 *      userId: // value for 'userId'
 *      resource: // value for 'resource'
 *      mode: // value for 'mode'
 *      granted: // value for 'granted'
 *   },
 * });
 */
export function useUpdatePermissionOnTagMutation(baseOptions?: Apollo.MutationHookOptions<UpdatePermissionOnTagMutation, UpdatePermissionOnTagMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdatePermissionOnTagMutation, UpdatePermissionOnTagMutationVariables>(UpdatePermissionOnTagDocument, options);
      }
export type UpdatePermissionOnTagMutationHookResult = ReturnType<typeof useUpdatePermissionOnTagMutation>;
export type UpdatePermissionOnTagMutationResult = Apollo.MutationResult<UpdatePermissionOnTagMutation>;
export type UpdatePermissionOnTagMutationOptions = Apollo.BaseMutationOptions<UpdatePermissionOnTagMutation, UpdatePermissionOnTagMutationVariables>;
export const RemoveTagByIdFromNoteDocument = gql`
    mutation RemoveTagByIdFromNote($noteId: ID!, $tagId: ID!) {
  removeTagByIdFromNote(noteId: $noteId, tagId: $tagId) {
    _id
    updatedAt
    user {
      _id
    }
    tags {
      ...BaseTag
      notes {
        _id
      }
    }
  }
}
    ${BaseTagFragmentDoc}`;
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
    query TitleSuggestions($noteId: ID!) {
  titleSuggestions(noteId: $noteId)
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
 *      noteId: // value for 'noteId'
 *   },
 * });
 */
export function useTitleSuggestionsQuery(baseOptions: Apollo.QueryHookOptions<TitleSuggestionsQuery, TitleSuggestionsQueryVariables> & ({ variables: TitleSuggestionsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TitleSuggestionsQuery, TitleSuggestionsQueryVariables>(TitleSuggestionsDocument, options);
      }
export function useTitleSuggestionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TitleSuggestionsQuery, TitleSuggestionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TitleSuggestionsQuery, TitleSuggestionsQueryVariables>(TitleSuggestionsDocument, options);
        }
export function useTitleSuggestionsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<TitleSuggestionsQuery, TitleSuggestionsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<TitleSuggestionsQuery, TitleSuggestionsQueryVariables>(TitleSuggestionsDocument, options);
        }
export type TitleSuggestionsQueryHookResult = ReturnType<typeof useTitleSuggestionsQuery>;
export type TitleSuggestionsLazyQueryHookResult = ReturnType<typeof useTitleSuggestionsLazyQuery>;
export type TitleSuggestionsSuspenseQueryHookResult = ReturnType<typeof useTitleSuggestionsSuspenseQuery>;
export type TitleSuggestionsQueryResult = Apollo.QueryResult<TitleSuggestionsQuery, TitleSuggestionsQueryVariables>;
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
export function useTinyUserSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<TinyUserQuery, TinyUserQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<TinyUserQuery, TinyUserQueryVariables>(TinyUserDocument, options);
        }
export type TinyUserQueryHookResult = ReturnType<typeof useTinyUserQuery>;
export type TinyUserLazyQueryHookResult = ReturnType<typeof useTinyUserLazyQuery>;
export type TinyUserSuspenseQueryHookResult = ReturnType<typeof useTinyUserSuspenseQuery>;
export type TinyUserQueryResult = Apollo.QueryResult<TinyUserQuery, TinyUserQueryVariables>;
export const TagWithNotesDocument = gql`
    query TagWithNotes($tagId: ID!) {
  tag(tagId: $tagId) {
    ...BaseTag
    user {
      ...BaseUser
    }
    notes {
      _id
    }
  }
}
    ${BaseTagFragmentDoc}
${BaseUserFragmentDoc}`;

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
export function useTagWithNotesQuery(baseOptions: Apollo.QueryHookOptions<TagWithNotesQuery, TagWithNotesQueryVariables> & ({ variables: TagWithNotesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TagWithNotesQuery, TagWithNotesQueryVariables>(TagWithNotesDocument, options);
      }
export function useTagWithNotesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TagWithNotesQuery, TagWithNotesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TagWithNotesQuery, TagWithNotesQueryVariables>(TagWithNotesDocument, options);
        }
export function useTagWithNotesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<TagWithNotesQuery, TagWithNotesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<TagWithNotesQuery, TagWithNotesQueryVariables>(TagWithNotesDocument, options);
        }
export type TagWithNotesQueryHookResult = ReturnType<typeof useTagWithNotesQuery>;
export type TagWithNotesLazyQueryHookResult = ReturnType<typeof useTagWithNotesLazyQuery>;
export type TagWithNotesSuspenseQueryHookResult = ReturnType<typeof useTagWithNotesSuspenseQuery>;
export type TagWithNotesQueryResult = Apollo.QueryResult<TagWithNotesQuery, TagWithNotesQueryVariables>;
export const UpdateTagDocument = gql`
    mutation UpdateTag($tag: InputTag!) {
  updateTag(tag: $tag) {
    ...BaseTag
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
export const DeleteTagDocument = gql`
    mutation DeleteTag($tagId: ID!) {
  permanentlyDeleteTag(tagId: $tagId) {
    _id
    notes {
      _id
      tags {
        _id
      }
    }
  }
}
    `;
export type DeleteTagMutationFn = Apollo.MutationFunction<DeleteTagMutation, DeleteTagMutationVariables>;

/**
 * __useDeleteTagMutation__
 *
 * To run a mutation, you first call `useDeleteTagMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteTagMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteTagMutation, { data, loading, error }] = useDeleteTagMutation({
 *   variables: {
 *      tagId: // value for 'tagId'
 *   },
 * });
 */
export function useDeleteTagMutation(baseOptions?: Apollo.MutationHookOptions<DeleteTagMutation, DeleteTagMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteTagMutation, DeleteTagMutationVariables>(DeleteTagDocument, options);
      }
export type DeleteTagMutationHookResult = ReturnType<typeof useDeleteTagMutation>;
export type DeleteTagMutationResult = Apollo.MutationResult<DeleteTagMutation>;
export type DeleteTagMutationOptions = Apollo.BaseMutationOptions<DeleteTagMutation, DeleteTagMutationVariables>;
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
export function useTagsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<TagsQuery, TagsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<TagsQuery, TagsQueryVariables>(TagsDocument, options);
        }
export type TagsQueryHookResult = ReturnType<typeof useTagsQuery>;
export type TagsLazyQueryHookResult = ReturnType<typeof useTagsLazyQuery>;
export type TagsSuspenseQueryHookResult = ReturnType<typeof useTagsSuspenseQuery>;
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
export function useUserSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<UserQuery, UserQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<UserQuery, UserQueryVariables>(UserDocument, options);
        }
export type UserQueryHookResult = ReturnType<typeof useUserQuery>;
export type UserLazyQueryHookResult = ReturnType<typeof useUserLazyQuery>;
export type UserSuspenseQueryHookResult = ReturnType<typeof useUserSuspenseQuery>;
export type UserQueryResult = Apollo.QueryResult<UserQuery, UserQueryVariables>;
export const UserTokensDocument = gql`
    query UserTokens {
  currentUser {
    ...UserTokensFragment
  }
}
    ${UserTokensFragmentFragmentDoc}`;

/**
 * __useUserTokensQuery__
 *
 * To run a query within a React component, call `useUserTokensQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserTokensQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserTokensQuery({
 *   variables: {
 *   },
 * });
 */
export function useUserTokensQuery(baseOptions?: Apollo.QueryHookOptions<UserTokensQuery, UserTokensQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UserTokensQuery, UserTokensQueryVariables>(UserTokensDocument, options);
      }
export function useUserTokensLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserTokensQuery, UserTokensQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UserTokensQuery, UserTokensQueryVariables>(UserTokensDocument, options);
        }
export function useUserTokensSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<UserTokensQuery, UserTokensQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<UserTokensQuery, UserTokensQueryVariables>(UserTokensDocument, options);
        }
export type UserTokensQueryHookResult = ReturnType<typeof useUserTokensQuery>;
export type UserTokensLazyQueryHookResult = ReturnType<typeof useUserTokensLazyQuery>;
export type UserTokensSuspenseQueryHookResult = ReturnType<typeof useUserTokensSuspenseQuery>;
export type UserTokensQueryResult = Apollo.QueryResult<UserTokensQuery, UserTokensQueryVariables>;
export const RevokeTokenDocument = gql`
    mutation RevokeToken($tokenId: ID!) {
  revokeToken(tokenId: $tokenId) {
    ...UserTokensFragment
  }
}
    ${UserTokensFragmentFragmentDoc}`;
export type RevokeTokenMutationFn = Apollo.MutationFunction<RevokeTokenMutation, RevokeTokenMutationVariables>;

/**
 * __useRevokeTokenMutation__
 *
 * To run a mutation, you first call `useRevokeTokenMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRevokeTokenMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [revokeTokenMutation, { data, loading, error }] = useRevokeTokenMutation({
 *   variables: {
 *      tokenId: // value for 'tokenId'
 *   },
 * });
 */
export function useRevokeTokenMutation(baseOptions?: Apollo.MutationHookOptions<RevokeTokenMutation, RevokeTokenMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RevokeTokenMutation, RevokeTokenMutationVariables>(RevokeTokenDocument, options);
      }
export type RevokeTokenMutationHookResult = ReturnType<typeof useRevokeTokenMutation>;
export type RevokeTokenMutationResult = Apollo.MutationResult<RevokeTokenMutation>;
export type RevokeTokenMutationOptions = Apollo.BaseMutationOptions<RevokeTokenMutation, RevokeTokenMutationVariables>;
export const CreateTagDocument = gql`
    mutation CreateTag($name: String!, $color: String) {
  createTag(name: $name, color: $color) {
    ...BaseTag
  }
}
    ${BaseTagFragmentDoc}`;
export type CreateTagMutationFn = Apollo.MutationFunction<CreateTagMutation, CreateTagMutationVariables>;

/**
 * __useCreateTagMutation__
 *
 * To run a mutation, you first call `useCreateTagMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTagMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTagMutation, { data, loading, error }] = useCreateTagMutation({
 *   variables: {
 *      name: // value for 'name'
 *      color: // value for 'color'
 *   },
 * });
 */
export function useCreateTagMutation(baseOptions?: Apollo.MutationHookOptions<CreateTagMutation, CreateTagMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTagMutation, CreateTagMutationVariables>(CreateTagDocument, options);
      }
export type CreateTagMutationHookResult = ReturnType<typeof useCreateTagMutation>;
export type CreateTagMutationResult = Apollo.MutationResult<CreateTagMutation>;
export type CreateTagMutationOptions = Apollo.BaseMutationOptions<CreateTagMutation, CreateTagMutationVariables>;
export const ToggleDeletedNoteDocument = gql`
    mutation ToggleDeletedNote($noteId: ID!) {
  toggleDeletedNote(noteId: $noteId) {
    _id
    deletedAt
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
    query EntitiesUpdatedSince($cacheId: ID) {
  entitiesUpdatedSince(cacheId: $cacheId) {
    addedNotes {
      ...BaseNote
    }
    updatedNotes {
      ...BaseNote
    }
    removedNoteIds
    addedTags {
      ...BaseTag
    }
    updatedTags {
      ...BaseTag
    }
    removedTagIds
    cacheId
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
 *      cacheId: // value for 'cacheId'
 *   },
 * });
 */
export function useEntitiesUpdatedSinceQuery(baseOptions?: Apollo.QueryHookOptions<EntitiesUpdatedSinceQuery, EntitiesUpdatedSinceQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<EntitiesUpdatedSinceQuery, EntitiesUpdatedSinceQueryVariables>(EntitiesUpdatedSinceDocument, options);
      }
export function useEntitiesUpdatedSinceLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<EntitiesUpdatedSinceQuery, EntitiesUpdatedSinceQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<EntitiesUpdatedSinceQuery, EntitiesUpdatedSinceQueryVariables>(EntitiesUpdatedSinceDocument, options);
        }
export function useEntitiesUpdatedSinceSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<EntitiesUpdatedSinceQuery, EntitiesUpdatedSinceQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<EntitiesUpdatedSinceQuery, EntitiesUpdatedSinceQueryVariables>(EntitiesUpdatedSinceDocument, options);
        }
export type EntitiesUpdatedSinceQueryHookResult = ReturnType<typeof useEntitiesUpdatedSinceQuery>;
export type EntitiesUpdatedSinceLazyQueryHookResult = ReturnType<typeof useEntitiesUpdatedSinceLazyQuery>;
export type EntitiesUpdatedSinceSuspenseQueryHookResult = ReturnType<typeof useEntitiesUpdatedSinceSuspenseQuery>;
export type EntitiesUpdatedSinceQueryResult = Apollo.QueryResult<EntitiesUpdatedSinceQuery, EntitiesUpdatedSinceQueryVariables>;
export const PopulateNotesCacheQueryDocument = gql`
    query PopulateNotesCacheQuery {
  notes {
    ...BaseNote
    tags {
      _id
    }
  }
}
    ${BaseNoteFragmentDoc}`;

/**
 * __usePopulateNotesCacheQueryQuery__
 *
 * To run a query within a React component, call `usePopulateNotesCacheQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `usePopulateNotesCacheQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePopulateNotesCacheQueryQuery({
 *   variables: {
 *   },
 * });
 */
export function usePopulateNotesCacheQueryQuery(baseOptions?: Apollo.QueryHookOptions<PopulateNotesCacheQueryQuery, PopulateNotesCacheQueryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PopulateNotesCacheQueryQuery, PopulateNotesCacheQueryQueryVariables>(PopulateNotesCacheQueryDocument, options);
      }
export function usePopulateNotesCacheQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PopulateNotesCacheQueryQuery, PopulateNotesCacheQueryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PopulateNotesCacheQueryQuery, PopulateNotesCacheQueryQueryVariables>(PopulateNotesCacheQueryDocument, options);
        }
export function usePopulateNotesCacheQuerySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<PopulateNotesCacheQueryQuery, PopulateNotesCacheQueryQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<PopulateNotesCacheQueryQuery, PopulateNotesCacheQueryQueryVariables>(PopulateNotesCacheQueryDocument, options);
        }
export type PopulateNotesCacheQueryQueryHookResult = ReturnType<typeof usePopulateNotesCacheQueryQuery>;
export type PopulateNotesCacheQueryLazyQueryHookResult = ReturnType<typeof usePopulateNotesCacheQueryLazyQuery>;
export type PopulateNotesCacheQuerySuspenseQueryHookResult = ReturnType<typeof usePopulateNotesCacheQuerySuspenseQuery>;
export type PopulateNotesCacheQueryQueryResult = Apollo.QueryResult<PopulateNotesCacheQueryQuery, PopulateNotesCacheQueryQueryVariables>;
export const WriteNoteToCacheQueryDocument = gql`
    query WriteNoteToCacheQuery($noteId: ID!) {
  note(noteId: $noteId) {
    ...BaseNote
    tags {
      _id
    }
  }
}
    ${BaseNoteFragmentDoc}`;

/**
 * __useWriteNoteToCacheQueryQuery__
 *
 * To run a query within a React component, call `useWriteNoteToCacheQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useWriteNoteToCacheQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWriteNoteToCacheQueryQuery({
 *   variables: {
 *      noteId: // value for 'noteId'
 *   },
 * });
 */
export function useWriteNoteToCacheQueryQuery(baseOptions: Apollo.QueryHookOptions<WriteNoteToCacheQueryQuery, WriteNoteToCacheQueryQueryVariables> & ({ variables: WriteNoteToCacheQueryQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<WriteNoteToCacheQueryQuery, WriteNoteToCacheQueryQueryVariables>(WriteNoteToCacheQueryDocument, options);
      }
export function useWriteNoteToCacheQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<WriteNoteToCacheQueryQuery, WriteNoteToCacheQueryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<WriteNoteToCacheQueryQuery, WriteNoteToCacheQueryQueryVariables>(WriteNoteToCacheQueryDocument, options);
        }
export function useWriteNoteToCacheQuerySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<WriteNoteToCacheQueryQuery, WriteNoteToCacheQueryQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<WriteNoteToCacheQueryQuery, WriteNoteToCacheQueryQueryVariables>(WriteNoteToCacheQueryDocument, options);
        }
export type WriteNoteToCacheQueryQueryHookResult = ReturnType<typeof useWriteNoteToCacheQueryQuery>;
export type WriteNoteToCacheQueryLazyQueryHookResult = ReturnType<typeof useWriteNoteToCacheQueryLazyQuery>;
export type WriteNoteToCacheQuerySuspenseQueryHookResult = ReturnType<typeof useWriteNoteToCacheQuerySuspenseQuery>;
export type WriteNoteToCacheQueryQueryResult = Apollo.QueryResult<WriteNoteToCacheQueryQuery, WriteNoteToCacheQueryQueryVariables>;
export const WriteTagToCacheQueryDocument = gql`
    query WriteTagToCacheQuery($tagId: ID!) {
  tag(tagId: $tagId) {
    ...BaseTag
  }
}
    ${BaseTagFragmentDoc}`;

/**
 * __useWriteTagToCacheQueryQuery__
 *
 * To run a query within a React component, call `useWriteTagToCacheQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useWriteTagToCacheQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWriteTagToCacheQueryQuery({
 *   variables: {
 *      tagId: // value for 'tagId'
 *   },
 * });
 */
export function useWriteTagToCacheQueryQuery(baseOptions: Apollo.QueryHookOptions<WriteTagToCacheQueryQuery, WriteTagToCacheQueryQueryVariables> & ({ variables: WriteTagToCacheQueryQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<WriteTagToCacheQueryQuery, WriteTagToCacheQueryQueryVariables>(WriteTagToCacheQueryDocument, options);
      }
export function useWriteTagToCacheQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<WriteTagToCacheQueryQuery, WriteTagToCacheQueryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<WriteTagToCacheQueryQuery, WriteTagToCacheQueryQueryVariables>(WriteTagToCacheQueryDocument, options);
        }
export function useWriteTagToCacheQuerySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<WriteTagToCacheQueryQuery, WriteTagToCacheQueryQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<WriteTagToCacheQueryQuery, WriteTagToCacheQueryQueryVariables>(WriteTagToCacheQueryDocument, options);
        }
export type WriteTagToCacheQueryQueryHookResult = ReturnType<typeof useWriteTagToCacheQueryQuery>;
export type WriteTagToCacheQueryLazyQueryHookResult = ReturnType<typeof useWriteTagToCacheQueryLazyQuery>;
export type WriteTagToCacheQuerySuspenseQueryHookResult = ReturnType<typeof useWriteTagToCacheQuerySuspenseQuery>;
export type WriteTagToCacheQueryQueryResult = Apollo.QueryResult<WriteTagToCacheQueryQuery, WriteTagToCacheQueryQueryVariables>;
export const NotesForSortAndFilterDocument = gql`
    query NotesForSortAndFilter {
  notes {
    _id
    createdAt
    updatedAt
    changedAt
    archivedAt
    name
    url
    tags {
      _id
    }
  }
}
    `;

/**
 * __useNotesForSortAndFilterQuery__
 *
 * To run a query within a React component, call `useNotesForSortAndFilterQuery` and pass it any options that fit your needs.
 * When your component renders, `useNotesForSortAndFilterQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNotesForSortAndFilterQuery({
 *   variables: {
 *   },
 * });
 */
export function useNotesForSortAndFilterQuery(baseOptions?: Apollo.QueryHookOptions<NotesForSortAndFilterQuery, NotesForSortAndFilterQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<NotesForSortAndFilterQuery, NotesForSortAndFilterQueryVariables>(NotesForSortAndFilterDocument, options);
      }
export function useNotesForSortAndFilterLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<NotesForSortAndFilterQuery, NotesForSortAndFilterQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<NotesForSortAndFilterQuery, NotesForSortAndFilterQueryVariables>(NotesForSortAndFilterDocument, options);
        }
export function useNotesForSortAndFilterSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<NotesForSortAndFilterQuery, NotesForSortAndFilterQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<NotesForSortAndFilterQuery, NotesForSortAndFilterQueryVariables>(NotesForSortAndFilterDocument, options);
        }
export type NotesForSortAndFilterQueryHookResult = ReturnType<typeof useNotesForSortAndFilterQuery>;
export type NotesForSortAndFilterLazyQueryHookResult = ReturnType<typeof useNotesForSortAndFilterLazyQuery>;
export type NotesForSortAndFilterSuspenseQueryHookResult = ReturnType<typeof useNotesForSortAndFilterSuspenseQuery>;
export type NotesForSortAndFilterQueryResult = Apollo.QueryResult<NotesForSortAndFilterQuery, NotesForSortAndFilterQueryVariables>;
export const TagsForSearchDocument = gql`
    query TagsForSearch {
  tags {
    _id
    name
  }
}
    `;

/**
 * __useTagsForSearchQuery__
 *
 * To run a query within a React component, call `useTagsForSearchQuery` and pass it any options that fit your needs.
 * When your component renders, `useTagsForSearchQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTagsForSearchQuery({
 *   variables: {
 *   },
 * });
 */
export function useTagsForSearchQuery(baseOptions?: Apollo.QueryHookOptions<TagsForSearchQuery, TagsForSearchQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TagsForSearchQuery, TagsForSearchQueryVariables>(TagsForSearchDocument, options);
      }
export function useTagsForSearchLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TagsForSearchQuery, TagsForSearchQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TagsForSearchQuery, TagsForSearchQueryVariables>(TagsForSearchDocument, options);
        }
export function useTagsForSearchSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<TagsForSearchQuery, TagsForSearchQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<TagsForSearchQuery, TagsForSearchQueryVariables>(TagsForSearchDocument, options);
        }
export type TagsForSearchQueryHookResult = ReturnType<typeof useTagsForSearchQuery>;
export type TagsForSearchLazyQueryHookResult = ReturnType<typeof useTagsForSearchLazyQuery>;
export type TagsForSearchSuspenseQueryHookResult = ReturnType<typeof useTagsForSearchSuspenseQuery>;
export type TagsForSearchQueryResult = Apollo.QueryResult<TagsForSearchQuery, TagsForSearchQueryVariables>;
export const ToggleArchivedNoteDocument = gql`
    mutation ToggleArchivedNote($noteId: ID!) {
  toggleArchivedNote(noteId: $noteId) {
    _id
    archivedAt
    updatedAt
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
export function useProfileQuery(baseOptions: Apollo.QueryHookOptions<ProfileQuery, ProfileQueryVariables> & ({ variables: ProfileQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProfileQuery, ProfileQueryVariables>(ProfileDocument, options);
      }
export function useProfileLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProfileQuery, ProfileQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProfileQuery, ProfileQueryVariables>(ProfileDocument, options);
        }
export function useProfileSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ProfileQuery, ProfileQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ProfileQuery, ProfileQueryVariables>(ProfileDocument, options);
        }
export type ProfileQueryHookResult = ReturnType<typeof useProfileQuery>;
export type ProfileLazyQueryHookResult = ReturnType<typeof useProfileLazyQuery>;
export type ProfileSuspenseQueryHookResult = ReturnType<typeof useProfileSuspenseQuery>;
export type ProfileQueryResult = Apollo.QueryResult<ProfileQuery, ProfileQueryVariables>;
export const AddNoteDocument = gql`
    mutation AddNote($url: String, $title: String, $description: String) {
  createNote(url: $url, title: $title, description: $description) {
    ...BaseNote
  }
}
    ${BaseNoteFragmentDoc}`;
export type AddNoteMutationFn = Apollo.MutationFunction<AddNoteMutation, AddNoteMutationVariables>;

/**
 * __useAddNoteMutation__
 *
 * To run a mutation, you first call `useAddNoteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddNoteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addNoteMutation, { data, loading, error }] = useAddNoteMutation({
 *   variables: {
 *      url: // value for 'url'
 *      title: // value for 'title'
 *      description: // value for 'description'
 *   },
 * });
 */
export function useAddNoteMutation(baseOptions?: Apollo.MutationHookOptions<AddNoteMutation, AddNoteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddNoteMutation, AddNoteMutationVariables>(AddNoteDocument, options);
      }
export type AddNoteMutationHookResult = ReturnType<typeof useAddNoteMutation>;
export type AddNoteMutationResult = Apollo.MutationResult<AddNoteMutation>;
export type AddNoteMutationOptions = Apollo.BaseMutationOptions<AddNoteMutation, AddNoteMutationVariables>;
export const NoteDocument = gql`
    query Note($noteId: ID!) {
  note(noteId: $noteId) {
    _id
    createdAt
    updatedAt
    changedAt
    archivedAt
    user {
      ...BaseUser
    }
    url
    name
    description
    domain
    tags {
      ...BaseTag
    }
  }
}
    ${BaseUserFragmentDoc}
${BaseTagFragmentDoc}`;

/**
 * __useNoteQuery__
 *
 * To run a query within a React component, call `useNoteQuery` and pass it any options that fit your needs.
 * When your component renders, `useNoteQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNoteQuery({
 *   variables: {
 *      noteId: // value for 'noteId'
 *   },
 * });
 */
export function useNoteQuery(baseOptions: Apollo.QueryHookOptions<NoteQuery, NoteQueryVariables> & ({ variables: NoteQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<NoteQuery, NoteQueryVariables>(NoteDocument, options);
      }
export function useNoteLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<NoteQuery, NoteQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<NoteQuery, NoteQueryVariables>(NoteDocument, options);
        }
export function useNoteSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<NoteQuery, NoteQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<NoteQuery, NoteQueryVariables>(NoteDocument, options);
        }
export type NoteQueryHookResult = ReturnType<typeof useNoteQuery>;
export type NoteLazyQueryHookResult = ReturnType<typeof useNoteLazyQuery>;
export type NoteSuspenseQueryHookResult = ReturnType<typeof useNoteSuspenseQuery>;
export type NoteQueryResult = Apollo.QueryResult<NoteQuery, NoteQueryVariables>;
export const UpdateNoteDocument = gql`
    mutation UpdateNote($note: InputNote!) {
  updateNote(note: $note) {
    _id
    createdAt
    updatedAt
    changedAt
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
export type UpdateNoteMutationFn = Apollo.MutationFunction<UpdateNoteMutation, UpdateNoteMutationVariables>;

/**
 * __useUpdateNoteMutation__
 *
 * To run a mutation, you first call `useUpdateNoteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateNoteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateNoteMutation, { data, loading, error }] = useUpdateNoteMutation({
 *   variables: {
 *      note: // value for 'note'
 *   },
 * });
 */
export function useUpdateNoteMutation(baseOptions?: Apollo.MutationHookOptions<UpdateNoteMutation, UpdateNoteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateNoteMutation, UpdateNoteMutationVariables>(UpdateNoteDocument, options);
      }
export type UpdateNoteMutationHookResult = ReturnType<typeof useUpdateNoteMutation>;
export type UpdateNoteMutationResult = Apollo.MutationResult<UpdateNoteMutation>;
export type UpdateNoteMutationOptions = Apollo.BaseMutationOptions<UpdateNoteMutation, UpdateNoteMutationVariables>;
export const AddTagByNameToNoteDocument = gql`
    mutation AddTagByNameToNote($noteId: ID!, $tagName: String!) {
  addTagByNameToNote(noteId: $noteId, name: $tagName) {
    _id
    updatedAt
    tags {
      ...BaseTag
      noteCount
      notes {
        _id
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

      export interface PossibleTypesResultData {
        possibleTypes: {
          [key: string]: string[]
        }
      }
      const result: PossibleTypesResultData = {
  "possibleTypes": {
    "BaseObject": [
      "Note",
      "Tag",
      "User"
    ]
  }
};
      export default result;
    