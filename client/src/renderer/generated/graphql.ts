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

export type Credentials = {
  __typename: 'Credentials';
  bookmarklet?: Maybe<Scalars['String']['output']>;
  rss?: Maybe<Scalars['String']['output']>;
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

export type INote = {
  _id: Scalars['ID']['output'];
  archivedAt?: Maybe<Scalars['Date']['output']>;
  changedAt: Scalars['Date']['output'];
  createdAt: Scalars['Date']['output'];
  deletedAt?: Maybe<Scalars['Date']['output']>;
  description: Scalars['String']['output'];
  name: Scalars['String']['output'];
  tags: Array<Tag>;
  type: NoteType;
  updatedAt: Scalars['Date']['output'];
  user: User;
};

export type InputLink = {
  _id: Scalars['ID']['input'];
  archivedAt?: InputMaybe<Scalars['Date']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  domain?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  path?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type InputTag = {
  _id: Scalars['ID']['input'];
  color: Scalars['String']['input'];
  name: Scalars['String']['input'];
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

export type InputText = {
  _id: Scalars['ID']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

export type Link = BaseObject & INote & {
  __typename: 'Link';
  _id: Scalars['ID']['output'];
  archivedAt?: Maybe<Scalars['Date']['output']>;
  changedAt: Scalars['Date']['output'];
  createdAt: Scalars['Date']['output'];
  deletedAt?: Maybe<Scalars['Date']['output']>;
  description: Scalars['String']['output'];
  domain: Scalars['String']['output'];
  name: Scalars['String']['output'];
  path: Scalars['String']['output'];
  tags: Array<Tag>;
  type: NoteType;
  updatedAt: Scalars['Date']['output'];
  url: Scalars['String']['output'];
  user: User;
};

export type Mutation = {
  __typename: 'Mutation';
  addTagByNameToNote: Note;
  createTag: Tag;
  createText: Text;
  permanentlyDeleteTag: Tag;
  removeTagByIdFromNote: Note;
  requestNewCredential: User;
  revokeCredential: User;
  shareTag: Tag;
  submitLink: Link;
  toggleArchivedNote: Note;
  toggleDeletedNote: Note;
  unshareTag: Tag;
  updateLink: Link;
  updatePermissionOnTag: Tag;
  updateTag: Tag;
  updateText: Text;
};


export type MutationAddTagByNameToNoteArgs = {
  name: Scalars['String']['input'];
  noteId: Scalars['ID']['input'];
};


export type MutationCreateTagArgs = {
  color?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};


export type MutationCreateTextArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};


export type MutationPermanentlyDeleteTagArgs = {
  tagId: Scalars['ID']['input'];
};


export type MutationRemoveTagByIdFromNoteArgs = {
  noteId: Scalars['ID']['input'];
  tagId: Scalars['ID']['input'];
};


export type MutationRequestNewCredentialArgs = {
  purpose: Scalars['String']['input'];
};


export type MutationRevokeCredentialArgs = {
  purpose: Scalars['String']['input'];
};


export type MutationShareTagArgs = {
  tagId: Scalars['ID']['input'];
  username: Scalars['String']['input'];
};


export type MutationSubmitLinkArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  url: Scalars['String']['input'];
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


export type MutationUpdateLinkArgs = {
  link: InputLink;
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


export type MutationUpdateTextArgs = {
  text: InputText;
};

export type Note = Link | Text;

export enum NoteType {
  Link = 'LINK',
  Text = 'TEXT'
}

export type NotesPermissions = {
  __typename: 'NotesPermissions';
  read: Scalars['Boolean']['output'];
  write: Scalars['Boolean']['output'];
};

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
  titleSuggestions: Array<Scalars['String']['output']>;
  versions: Versions;
};


export type QueryEntitiesUpdatedSinceArgs = {
  cacheId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryLinkArgs = {
  linkId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryLinksArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
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


export type QueryTextArgs = {
  textId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryTitleSuggestionsArgs = {
  linkId: Scalars['ID']['input'];
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

export type Text = BaseObject & INote & {
  __typename: 'Text';
  _id: Scalars['ID']['output'];
  archivedAt?: Maybe<Scalars['Date']['output']>;
  changedAt: Scalars['Date']['output'];
  createdAt: Scalars['Date']['output'];
  deletedAt?: Maybe<Scalars['Date']['output']>;
  description: Scalars['String']['output'];
  name: Scalars['String']['output'];
  tags: Array<Tag>;
  type: NoteType;
  updatedAt: Scalars['Date']['output'];
  user: User;
};

export type User = BaseObject & {
  __typename: 'User';
  _id: Scalars['ID']['output'];
  authenticationProvider?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Date']['output'];
  credentials?: Maybe<Credentials>;
  name: Scalars['String']['output'];
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
  /** @deprecated Upgrade to 0.20.0+ and use 'current' field */
  recommended?: Maybe<Scalars['String']['output']>;
};

export type TagsWithCountsQueryVariables = Exact<{ [key: string]: never; }>;


export type TagsWithCountsQuery = { __typename: 'Query', tags: Array<{ __typename: 'Tag', noteCount: number, _id: string, createdAt: any, updatedAt: any, changedAt: any, name: string, color: string, user: { __typename: 'User', _id: string, name: string }, permissions: Array<{ __typename: 'UserPermissions', user: { __typename: 'User', _id: string, name: string }, tag: { __typename: 'TagPermissions', read: boolean, write: boolean, use: boolean, share: boolean }, notes: { __typename: 'NotesPermissions', read: boolean, write: boolean } }> }> };

export type VisitedNotesQueryVariables = Exact<{ [key: string]: never; }>;


export type VisitedNotesQuery = { __typename: 'Query', notes: Array<{ __typename: 'Link', _id: string, name: string } | { __typename: 'Text', _id: string, name: string }> };

type NoteInList_Link_Fragment = { __typename: 'Link', _id: string, name: string, createdAt: any, updatedAt: any, changedAt: any, archivedAt?: any | null, deletedAt?: any | null, description: string, url: string, domain: string, tags: Array<{ __typename: 'Tag', _id: string, createdAt: any, updatedAt: any, changedAt: any, name: string, color: string, user: { __typename: 'User', _id: string, name: string }, permissions: Array<{ __typename: 'UserPermissions', user: { __typename: 'User', _id: string, name: string }, tag: { __typename: 'TagPermissions', read: boolean, write: boolean, use: boolean, share: boolean }, notes: { __typename: 'NotesPermissions', read: boolean, write: boolean } }> }>, user: { __typename: 'User', _id: string, name: string } };

type NoteInList_Text_Fragment = { __typename: 'Text', _id: string, name: string, createdAt: any, updatedAt: any, changedAt: any, archivedAt?: any | null, deletedAt?: any | null, description: string, tags: Array<{ __typename: 'Tag', _id: string, createdAt: any, updatedAt: any, changedAt: any, name: string, color: string, user: { __typename: 'User', _id: string, name: string }, permissions: Array<{ __typename: 'UserPermissions', user: { __typename: 'User', _id: string, name: string }, tag: { __typename: 'TagPermissions', read: boolean, write: boolean, use: boolean, share: boolean }, notes: { __typename: 'NotesPermissions', read: boolean, write: boolean } }> }>, user: { __typename: 'User', _id: string, name: string } };

export type NoteInListFragment = NoteInList_Link_Fragment | NoteInList_Text_Fragment;

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


export type RemoveTagByIdFromNoteMutation = { __typename: 'Mutation', removeTagByIdFromNote: { __typename: 'Link', _id: string, updatedAt: any, user: { __typename: 'User', _id: string }, tags: Array<{ __typename: 'Tag', _id: string, createdAt: any, updatedAt: any, changedAt: any, name: string, color: string, notes?: Array<{ __typename: 'Link', _id: string } | { __typename: 'Text', _id: string } | null> | null, user: { __typename: 'User', _id: string, name: string }, permissions: Array<{ __typename: 'UserPermissions', user: { __typename: 'User', _id: string, name: string }, tag: { __typename: 'TagPermissions', read: boolean, write: boolean, use: boolean, share: boolean }, notes: { __typename: 'NotesPermissions', read: boolean, write: boolean } }> }> } | { __typename: 'Text', _id: string, updatedAt: any, user: { __typename: 'User', _id: string }, tags: Array<{ __typename: 'Tag', _id: string, createdAt: any, updatedAt: any, changedAt: any, name: string, color: string, notes?: Array<{ __typename: 'Link', _id: string } | { __typename: 'Text', _id: string } | null> | null, user: { __typename: 'User', _id: string, name: string }, permissions: Array<{ __typename: 'UserPermissions', user: { __typename: 'User', _id: string, name: string }, tag: { __typename: 'TagPermissions', read: boolean, write: boolean, use: boolean, share: boolean }, notes: { __typename: 'NotesPermissions', read: boolean, write: boolean } }> }> } };

export type TitleSuggestionsQueryVariables = Exact<{
  linkId: Scalars['ID']['input'];
}>;


export type TitleSuggestionsQuery = { __typename: 'Query', titleSuggestions: Array<string> };

export type LinkQueryVariables = Exact<{
  linkId?: InputMaybe<Scalars['ID']['input']>;
}>;


export type LinkQuery = { __typename: 'Query', link: { __typename: 'Link', _id: string, createdAt: any, updatedAt: any, changedAt: any, archivedAt?: any | null, url: string, name: string, description: string, domain: string, user: { __typename: 'User', _id: string, name: string }, tags: Array<{ __typename: 'Tag', _id: string, createdAt: any, updatedAt: any, changedAt: any, name: string, color: string, user: { __typename: 'User', _id: string, name: string }, permissions: Array<{ __typename: 'UserPermissions', user: { __typename: 'User', _id: string, name: string }, tag: { __typename: 'TagPermissions', read: boolean, write: boolean, use: boolean, share: boolean }, notes: { __typename: 'NotesPermissions', read: boolean, write: boolean } }> }> } };

export type UpdateLinkMutationVariables = Exact<{
  link: InputLink;
}>;


export type UpdateLinkMutation = { __typename: 'Mutation', updateLink: { __typename: 'Link', _id: string, createdAt: any, updatedAt: any, changedAt: any, url: string, domain: string, name: string, description: string, tags: Array<{ __typename: 'Tag', _id: string, name: string, color: string }> } };

export type NotesForListQueryVariables = Exact<{ [key: string]: never; }>;


export type NotesForListQuery = { __typename: 'Query', notes: Array<{ __typename: 'Link', _id: string, name: string, createdAt: any, updatedAt: any, changedAt: any, archivedAt?: any | null, deletedAt?: any | null, description: string, url: string, domain: string, tags: Array<{ __typename: 'Tag', _id: string, createdAt: any, updatedAt: any, changedAt: any, name: string, color: string, user: { __typename: 'User', _id: string, name: string }, permissions: Array<{ __typename: 'UserPermissions', user: { __typename: 'User', _id: string, name: string }, tag: { __typename: 'TagPermissions', read: boolean, write: boolean, use: boolean, share: boolean }, notes: { __typename: 'NotesPermissions', read: boolean, write: boolean } }> }>, user: { __typename: 'User', _id: string, name: string } } | { __typename: 'Text', _id: string, name: string, createdAt: any, updatedAt: any, changedAt: any, archivedAt?: any | null, deletedAt?: any | null, description: string, tags: Array<{ __typename: 'Tag', _id: string, createdAt: any, updatedAt: any, changedAt: any, name: string, color: string, user: { __typename: 'User', _id: string, name: string }, permissions: Array<{ __typename: 'UserPermissions', user: { __typename: 'User', _id: string, name: string }, tag: { __typename: 'TagPermissions', read: boolean, write: boolean, use: boolean, share: boolean }, notes: { __typename: 'NotesPermissions', read: boolean, write: boolean } }> }>, user: { __typename: 'User', _id: string, name: string } }> };

export type TinyUserQueryVariables = Exact<{ [key: string]: never; }>;


export type TinyUserQuery = { __typename: 'Query', currentUser?: { __typename: 'User', _id: string } | null };

export type TagWithNotesQueryVariables = Exact<{
  tagId: Scalars['ID']['input'];
}>;


export type TagWithNotesQuery = { __typename: 'Query', tag: { __typename: 'Tag', _id: string, createdAt: any, updatedAt: any, changedAt: any, name: string, color: string, user: { __typename: 'User', _id: string, name: string }, notes?: Array<{ __typename: 'Link', _id: string, name: string, createdAt: any, updatedAt: any, changedAt: any, archivedAt?: any | null, deletedAt?: any | null, description: string, url: string, domain: string, tags: Array<{ __typename: 'Tag', _id: string, createdAt: any, updatedAt: any, changedAt: any, name: string, color: string, user: { __typename: 'User', _id: string, name: string }, permissions: Array<{ __typename: 'UserPermissions', user: { __typename: 'User', _id: string, name: string }, tag: { __typename: 'TagPermissions', read: boolean, write: boolean, use: boolean, share: boolean }, notes: { __typename: 'NotesPermissions', read: boolean, write: boolean } }> }>, user: { __typename: 'User', _id: string, name: string } } | { __typename: 'Text', _id: string, name: string, createdAt: any, updatedAt: any, changedAt: any, archivedAt?: any | null, deletedAt?: any | null, description: string, tags: Array<{ __typename: 'Tag', _id: string, createdAt: any, updatedAt: any, changedAt: any, name: string, color: string, user: { __typename: 'User', _id: string, name: string }, permissions: Array<{ __typename: 'UserPermissions', user: { __typename: 'User', _id: string, name: string }, tag: { __typename: 'TagPermissions', read: boolean, write: boolean, use: boolean, share: boolean }, notes: { __typename: 'NotesPermissions', read: boolean, write: boolean } }> }>, user: { __typename: 'User', _id: string, name: string } } | null> | null, permissions: Array<{ __typename: 'UserPermissions', user: { __typename: 'User', _id: string, name: string }, tag: { __typename: 'TagPermissions', read: boolean, write: boolean, use: boolean, share: boolean }, notes: { __typename: 'NotesPermissions', read: boolean, write: boolean } }> } };

export type UpdateTagMutationVariables = Exact<{
  tag: InputTag;
}>;


export type UpdateTagMutation = { __typename: 'Mutation', updateTag: { __typename: 'Tag', _id: string, createdAt: any, updatedAt: any, changedAt: any, name: string, color: string, notes?: Array<{ __typename: 'Link', type: NoteType, _id: string, name: string, createdAt: any, archivedAt?: any | null, changedAt: any, description: string, url: string, domain: string, tags: Array<{ __typename: 'Tag', _id: string, name: string, color: string }> } | { __typename: 'Text', type: NoteType, _id: string, name: string, createdAt: any, archivedAt?: any | null, changedAt: any, description: string, tags: Array<{ __typename: 'Tag', _id: string, name: string, color: string }> } | null> | null, user: { __typename: 'User', _id: string, name: string }, permissions: Array<{ __typename: 'UserPermissions', user: { __typename: 'User', _id: string, name: string }, tag: { __typename: 'TagPermissions', read: boolean, write: boolean, use: boolean, share: boolean }, notes: { __typename: 'NotesPermissions', read: boolean, write: boolean } }> } };

export type DeleteTagMutationVariables = Exact<{
  tagId: Scalars['ID']['input'];
}>;


export type DeleteTagMutation = { __typename: 'Mutation', permanentlyDeleteTag: { __typename: 'Tag', _id: string, notes?: Array<{ __typename: 'Link', _id: string, tags: Array<{ __typename: 'Tag', _id: string }> } | { __typename: 'Text', _id: string, tags: Array<{ __typename: 'Tag', _id: string }> } | null> | null } };

export type TagsQueryVariables = Exact<{ [key: string]: never; }>;


export type TagsQuery = { __typename: 'Query', tags: Array<{ __typename: 'Tag', _id: string, createdAt: any, updatedAt: any, changedAt: any, name: string, color: string, user: { __typename: 'User', _id: string, name: string }, permissions: Array<{ __typename: 'UserPermissions', user: { __typename: 'User', _id: string, name: string }, tag: { __typename: 'TagPermissions', read: boolean, write: boolean, use: boolean, share: boolean }, notes: { __typename: 'NotesPermissions', read: boolean, write: boolean } }> }> };

export type UpdateTag2MutationVariables = Exact<{
  tag: InputTag;
}>;


export type UpdateTag2Mutation = { __typename: 'Mutation', updateTag: { __typename: 'Tag', _id: string, createdAt: any, updatedAt: any, changedAt: any, name: string, color: string, user: { __typename: 'User', _id: string, name: string }, permissions: Array<{ __typename: 'UserPermissions', user: { __typename: 'User', _id: string, name: string }, tag: { __typename: 'TagPermissions', read: boolean, write: boolean, use: boolean, share: boolean }, notes: { __typename: 'NotesPermissions', read: boolean, write: boolean } }> } };

export type TextQueryVariables = Exact<{
  textId?: InputMaybe<Scalars['ID']['input']>;
}>;


export type TextQuery = { __typename: 'Query', text: { __typename: 'Text', _id: string, createdAt: any, updatedAt: any, changedAt: any, archivedAt?: any | null, name: string, description: string, user: { __typename: 'User', _id: string, name: string }, tags: Array<{ __typename: 'Tag', _id: string, createdAt: any, updatedAt: any, changedAt: any, name: string, color: string, user: { __typename: 'User', _id: string, name: string }, permissions: Array<{ __typename: 'UserPermissions', user: { __typename: 'User', _id: string, name: string }, tag: { __typename: 'TagPermissions', read: boolean, write: boolean, use: boolean, share: boolean }, notes: { __typename: 'NotesPermissions', read: boolean, write: boolean } }> }> } };

export type UpdateTextMutationVariables = Exact<{
  text: InputText;
}>;


export type UpdateTextMutation = { __typename: 'Mutation', updateText: { __typename: 'Text', _id: string, createdAt: any, updatedAt: any, changedAt: any, archivedAt?: any | null, name: string, description: string, tags: Array<{ __typename: 'Tag', _id: string, name: string, color: string }> } };

export type UserQueryVariables = Exact<{ [key: string]: never; }>;


export type UserQuery = { __typename: 'Query', currentUser?: { __typename: 'User', _id: string, authenticationProvider?: string | null, createdAt: any, name: string } | null };

export type UserCredentialsFragmentFragment = { __typename: 'User', _id: string, credentials?: { __typename: 'Credentials', bookmarklet?: string | null, rss?: string | null } | null };

export type UserCredentialsQueryVariables = Exact<{ [key: string]: never; }>;


export type UserCredentialsQuery = { __typename: 'Query', currentUser?: { __typename: 'User', _id: string, credentials?: { __typename: 'Credentials', bookmarklet?: string | null, rss?: string | null } | null } | null };

export type RequestNewCredentialMutationVariables = Exact<{
  purpose: Scalars['String']['input'];
}>;


export type RequestNewCredentialMutation = { __typename: 'Mutation', requestNewCredential: { __typename: 'User', _id: string, credentials?: { __typename: 'Credentials', bookmarklet?: string | null, rss?: string | null } | null } };

export type RevokeCredentialMutationVariables = Exact<{
  purpose: Scalars['String']['input'];
}>;


export type RevokeCredentialMutation = { __typename: 'Mutation', revokeCredential: { __typename: 'User', _id: string, credentials?: { __typename: 'Credentials', bookmarklet?: string | null, rss?: string | null } | null } };

export type CreateTagMutationVariables = Exact<{
  name: Scalars['String']['input'];
  color?: InputMaybe<Scalars['String']['input']>;
}>;


export type CreateTagMutation = { __typename: 'Mutation', createTag: { __typename: 'Tag', _id: string, createdAt: any, updatedAt: any, changedAt: any, name: string, color: string, user: { __typename: 'User', _id: string, name: string }, permissions: Array<{ __typename: 'UserPermissions', user: { __typename: 'User', _id: string, name: string }, tag: { __typename: 'TagPermissions', read: boolean, write: boolean, use: boolean, share: boolean }, notes: { __typename: 'NotesPermissions', read: boolean, write: boolean } }> } };

export type ToggleDeletedNoteMutationVariables = Exact<{
  noteId: Scalars['ID']['input'];
}>;


export type ToggleDeletedNoteMutation = { __typename: 'Mutation', toggleDeletedNote: { __typename: 'Link', _id: string, deletedAt?: any | null } | { __typename: 'Text', _id: string, deletedAt?: any | null } };

export type EntitiesUpdatedSinceQueryVariables = Exact<{
  cacheId?: InputMaybe<Scalars['ID']['input']>;
}>;


export type EntitiesUpdatedSinceQuery = { __typename: 'Query', entitiesUpdatedSince: { __typename: 'EntitiesUpdatedSince', removedNoteIds: Array<string>, removedTagIds: Array<string>, cacheId: string, addedNotes: Array<{ __typename: 'Link', _id: string, name: string, createdAt: any, updatedAt: any, changedAt: any, archivedAt?: any | null, deletedAt?: any | null, description: string, url: string, domain: string, tags: Array<{ __typename: 'Tag', _id: string }>, user: { __typename: 'User', _id: string, name: string } } | { __typename: 'Text', _id: string, name: string, createdAt: any, updatedAt: any, changedAt: any, archivedAt?: any | null, deletedAt?: any | null, description: string, tags: Array<{ __typename: 'Tag', _id: string }>, user: { __typename: 'User', _id: string, name: string } }>, updatedNotes: Array<{ __typename: 'Link', _id: string, name: string, createdAt: any, updatedAt: any, changedAt: any, archivedAt?: any | null, deletedAt?: any | null, description: string, url: string, domain: string, tags: Array<{ __typename: 'Tag', _id: string }>, user: { __typename: 'User', _id: string, name: string } } | { __typename: 'Text', _id: string, name: string, createdAt: any, updatedAt: any, changedAt: any, archivedAt?: any | null, deletedAt?: any | null, description: string, tags: Array<{ __typename: 'Tag', _id: string }>, user: { __typename: 'User', _id: string, name: string } }>, addedTags: Array<{ __typename: 'Tag', _id: string, createdAt: any, updatedAt: any, changedAt: any, name: string, color: string, user: { __typename: 'User', _id: string, name: string }, permissions: Array<{ __typename: 'UserPermissions', user: { __typename: 'User', _id: string, name: string }, tag: { __typename: 'TagPermissions', read: boolean, write: boolean, use: boolean, share: boolean }, notes: { __typename: 'NotesPermissions', read: boolean, write: boolean } }> }>, updatedTags: Array<{ __typename: 'Tag', _id: string, createdAt: any, updatedAt: any, changedAt: any, name: string, color: string, user: { __typename: 'User', _id: string, name: string }, permissions: Array<{ __typename: 'UserPermissions', user: { __typename: 'User', _id: string, name: string }, tag: { __typename: 'TagPermissions', read: boolean, write: boolean, use: boolean, share: boolean }, notes: { __typename: 'NotesPermissions', read: boolean, write: boolean } }> }> } };

export type UpdatedNotesCacheQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type UpdatedNotesCacheQueryQuery = { __typename: 'Query', notes: Array<{ __typename: 'Link', _id: string, name: string, createdAt: any, updatedAt: any, changedAt: any, archivedAt?: any | null, deletedAt?: any | null, description: string, url: string, domain: string, tags: Array<{ __typename: 'Tag', _id: string }>, user: { __typename: 'User', _id: string, name: string } } | { __typename: 'Text', _id: string, name: string, createdAt: any, updatedAt: any, changedAt: any, archivedAt?: any | null, deletedAt?: any | null, description: string, tags: Array<{ __typename: 'Tag', _id: string }>, user: { __typename: 'User', _id: string, name: string } }> };

export type TagWithNoteIdsQueryVariables = Exact<{
  tagId: Scalars['ID']['input'];
}>;


export type TagWithNoteIdsQuery = { __typename: 'Query', tag: { __typename: 'Tag', _id: string, notes?: Array<{ __typename: 'Link', _id: string } | { __typename: 'Text', _id: string } | null> | null } };

export type NotesForSortAndFilterQueryVariables = Exact<{ [key: string]: never; }>;


export type NotesForSortAndFilterQuery = { __typename: 'Query', notes: Array<{ __typename: 'Link', _id: string, createdAt: any, updatedAt: any, changedAt: any, archivedAt?: any | null, name: string, url: string, tags: Array<{ __typename: 'Tag', _id: string }> } | { __typename: 'Text', _id: string, createdAt: any, updatedAt: any, changedAt: any, archivedAt?: any | null, name: string, tags: Array<{ __typename: 'Tag', _id: string }> }> };

export type TagsForSearchQueryVariables = Exact<{ [key: string]: never; }>;


export type TagsForSearchQuery = { __typename: 'Query', tags: Array<{ __typename: 'Tag', _id: string, name: string }> };

export type ToggleArchivedNoteMutationVariables = Exact<{
  noteId: Scalars['ID']['input'];
}>;


export type ToggleArchivedNoteMutation = { __typename: 'Mutation', toggleArchivedNote: { __typename: 'Link', _id: string, archivedAt?: any | null, updatedAt: any } | { __typename: 'Text', _id: string, archivedAt?: any | null, updatedAt: any } };

export type ProfileQueryVariables = Exact<{
  currentVersion: Scalars['String']['input'];
}>;


export type ProfileQuery = { __typename: 'Query', currentUser?: { __typename: 'User', _id: string, name: string } | null, versions: { __typename: 'Versions', current: string, minimum?: string | null } };

export type BaseUserFragment = { __typename: 'User', _id: string, name: string };

export type BaseTagFragment = { __typename: 'Tag', _id: string, createdAt: any, updatedAt: any, changedAt: any, name: string, color: string, user: { __typename: 'User', _id: string, name: string }, permissions: Array<{ __typename: 'UserPermissions', user: { __typename: 'User', _id: string, name: string }, tag: { __typename: 'TagPermissions', read: boolean, write: boolean, use: boolean, share: boolean }, notes: { __typename: 'NotesPermissions', read: boolean, write: boolean } }> };

type BaseNote_Link_Fragment = { __typename: 'Link', _id: string, name: string, createdAt: any, updatedAt: any, changedAt: any, archivedAt?: any | null, deletedAt?: any | null, description: string, url: string, domain: string, tags: Array<{ __typename: 'Tag', _id: string }>, user: { __typename: 'User', _id: string, name: string } };

type BaseNote_Text_Fragment = { __typename: 'Text', _id: string, name: string, createdAt: any, updatedAt: any, changedAt: any, archivedAt?: any | null, deletedAt?: any | null, description: string, tags: Array<{ __typename: 'Tag', _id: string }>, user: { __typename: 'User', _id: string, name: string } };

export type BaseNoteFragment = BaseNote_Link_Fragment | BaseNote_Text_Fragment;

export type AddLinkMutationVariables = Exact<{
  url: Scalars['String']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
}>;


export type AddLinkMutation = { __typename: 'Mutation', submitLink: { __typename: 'Link', _id: string, name: string, createdAt: any, updatedAt: any, changedAt: any, archivedAt?: any | null, deletedAt?: any | null, description: string, url: string, domain: string, tags: Array<{ __typename: 'Tag', _id: string }>, user: { __typename: 'User', _id: string, name: string } } };

export type AddTextMutationVariables = Exact<{
  title?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
}>;


export type AddTextMutation = { __typename: 'Mutation', createText: { __typename: 'Text', _id: string, name: string, createdAt: any, updatedAt: any, changedAt: any, archivedAt?: any | null, deletedAt?: any | null, description: string, tags: Array<{ __typename: 'Tag', _id: string }>, user: { __typename: 'User', _id: string, name: string } } };

export type AddTagByNameToNoteMutationVariables = Exact<{
  noteId: Scalars['ID']['input'];
  tagName: Scalars['String']['input'];
}>;


export type AddTagByNameToNoteMutation = { __typename: 'Mutation', addTagByNameToNote: { __typename: 'Link', _id: string, updatedAt: any, tags: Array<{ __typename: 'Tag', noteCount: number, _id: string, createdAt: any, updatedAt: any, changedAt: any, name: string, color: string, notes?: Array<{ __typename: 'Link', _id: string } | { __typename: 'Text', _id: string } | null> | null, user: { __typename: 'User', _id: string, name: string }, permissions: Array<{ __typename: 'UserPermissions', user: { __typename: 'User', _id: string, name: string }, tag: { __typename: 'TagPermissions', read: boolean, write: boolean, use: boolean, share: boolean }, notes: { __typename: 'NotesPermissions', read: boolean, write: boolean } }> }> } | { __typename: 'Text', _id: string, updatedAt: any, tags: Array<{ __typename: 'Tag', noteCount: number, _id: string, createdAt: any, updatedAt: any, changedAt: any, name: string, color: string, notes?: Array<{ __typename: 'Link', _id: string } | { __typename: 'Text', _id: string } | null> | null, user: { __typename: 'User', _id: string, name: string }, permissions: Array<{ __typename: 'UserPermissions', user: { __typename: 'User', _id: string, name: string }, tag: { __typename: 'TagPermissions', read: boolean, write: boolean, use: boolean, share: boolean }, notes: { __typename: 'NotesPermissions', read: boolean, write: boolean } }> }> } };

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
    fragment NoteInList on INote {
  ... on INote {
    _id
    name
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
  ... on Link {
    url
    domain
  }
}
    ${BaseTagFragmentDoc}
${BaseUserFragmentDoc}`;
export const UserCredentialsFragmentFragmentDoc = gql`
    fragment UserCredentialsFragment on User {
  _id
  credentials {
    bookmarklet
    rss
  }
}
    `;
export const BaseNoteFragmentDoc = gql`
    fragment BaseNote on INote {
  ... on INote {
    _id
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
  ... on Link {
    url
    domain
  }
}
    ${BaseUserFragmentDoc}`;
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
    ... on INote {
      _id
      updatedAt
      user {
        _id
      }
      tags {
        ...BaseTag
        notes {
          ... on INote {
            _id
          }
        }
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
export const LinkDocument = gql`
    query Link($linkId: ID) {
  link(linkId: $linkId) {
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
export function useLinkSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<LinkQuery, LinkQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<LinkQuery, LinkQueryVariables>(LinkDocument, options);
        }
export type LinkQueryHookResult = ReturnType<typeof useLinkQuery>;
export type LinkLazyQueryHookResult = ReturnType<typeof useLinkLazyQuery>;
export type LinkSuspenseQueryHookResult = ReturnType<typeof useLinkSuspenseQuery>;
export type LinkQueryResult = Apollo.QueryResult<LinkQuery, LinkQueryVariables>;
export const UpdateLinkDocument = gql`
    mutation UpdateLink($link: InputLink!) {
  updateLink(link: $link) {
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
    ... on INote {
      tags {
        ...BaseTag
      }
    }
  }
}
    ${BaseNoteFragmentDoc}
${BaseTagFragmentDoc}`;

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
export function useNotesForListSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<NotesForListQuery, NotesForListQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<NotesForListQuery, NotesForListQueryVariables>(NotesForListDocument, options);
        }
export type NotesForListQueryHookResult = ReturnType<typeof useNotesForListQuery>;
export type NotesForListLazyQueryHookResult = ReturnType<typeof useNotesForListLazyQuery>;
export type NotesForListSuspenseQueryHookResult = ReturnType<typeof useNotesForListSuspenseQuery>;
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
      ...BaseNote
      ... on INote {
        tags {
          ...BaseTag
        }
      }
    }
  }
}
    ${BaseTagFragmentDoc}
${BaseUserFragmentDoc}
${BaseNoteFragmentDoc}`;

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
    notes {
      ... on INote {
        type
        _id
        name
        createdAt
        archivedAt
        changedAt
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
export const DeleteTagDocument = gql`
    mutation DeleteTag($tagId: ID!) {
  permanentlyDeleteTag(tagId: $tagId) {
    _id
    notes {
      ... on INote {
        _id
        tags {
          _id
        }
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
export const TextDocument = gql`
    query Text($textId: ID) {
  text(textId: $textId) {
    _id
    createdAt
    updatedAt
    changedAt
    archivedAt
    user {
      ...BaseUser
    }
    name
    description
    tags {
      ...BaseTag
    }
  }
}
    ${BaseUserFragmentDoc}
${BaseTagFragmentDoc}`;

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
export function useTextSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<TextQuery, TextQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<TextQuery, TextQueryVariables>(TextDocument, options);
        }
export type TextQueryHookResult = ReturnType<typeof useTextQuery>;
export type TextLazyQueryHookResult = ReturnType<typeof useTextLazyQuery>;
export type TextSuspenseQueryHookResult = ReturnType<typeof useTextSuspenseQuery>;
export type TextQueryResult = Apollo.QueryResult<TextQuery, TextQueryVariables>;
export const UpdateTextDocument = gql`
    mutation UpdateText($text: InputText!) {
  updateText(text: $text) {
    _id
    createdAt
    updatedAt
    changedAt
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
export function useUserSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<UserQuery, UserQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<UserQuery, UserQueryVariables>(UserDocument, options);
        }
export type UserQueryHookResult = ReturnType<typeof useUserQuery>;
export type UserLazyQueryHookResult = ReturnType<typeof useUserLazyQuery>;
export type UserSuspenseQueryHookResult = ReturnType<typeof useUserSuspenseQuery>;
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
export function useUserCredentialsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<UserCredentialsQuery, UserCredentialsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<UserCredentialsQuery, UserCredentialsQueryVariables>(UserCredentialsDocument, options);
        }
export type UserCredentialsQueryHookResult = ReturnType<typeof useUserCredentialsQuery>;
export type UserCredentialsLazyQueryHookResult = ReturnType<typeof useUserCredentialsLazyQuery>;
export type UserCredentialsSuspenseQueryHookResult = ReturnType<typeof useUserCredentialsSuspenseQuery>;
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
export const UpdatedNotesCacheQueryDocument = gql`
    query UpdatedNotesCacheQuery {
  notes {
    ...BaseNote
    ... on INote {
      tags {
        _id
      }
    }
  }
}
    ${BaseNoteFragmentDoc}`;

/**
 * __useUpdatedNotesCacheQueryQuery__
 *
 * To run a query within a React component, call `useUpdatedNotesCacheQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useUpdatedNotesCacheQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUpdatedNotesCacheQueryQuery({
 *   variables: {
 *   },
 * });
 */
export function useUpdatedNotesCacheQueryQuery(baseOptions?: Apollo.QueryHookOptions<UpdatedNotesCacheQueryQuery, UpdatedNotesCacheQueryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UpdatedNotesCacheQueryQuery, UpdatedNotesCacheQueryQueryVariables>(UpdatedNotesCacheQueryDocument, options);
      }
export function useUpdatedNotesCacheQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UpdatedNotesCacheQueryQuery, UpdatedNotesCacheQueryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UpdatedNotesCacheQueryQuery, UpdatedNotesCacheQueryQueryVariables>(UpdatedNotesCacheQueryDocument, options);
        }
export function useUpdatedNotesCacheQuerySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<UpdatedNotesCacheQueryQuery, UpdatedNotesCacheQueryQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<UpdatedNotesCacheQueryQuery, UpdatedNotesCacheQueryQueryVariables>(UpdatedNotesCacheQueryDocument, options);
        }
export type UpdatedNotesCacheQueryQueryHookResult = ReturnType<typeof useUpdatedNotesCacheQueryQuery>;
export type UpdatedNotesCacheQueryLazyQueryHookResult = ReturnType<typeof useUpdatedNotesCacheQueryLazyQuery>;
export type UpdatedNotesCacheQuerySuspenseQueryHookResult = ReturnType<typeof useUpdatedNotesCacheQuerySuspenseQuery>;
export type UpdatedNotesCacheQueryQueryResult = Apollo.QueryResult<UpdatedNotesCacheQueryQuery, UpdatedNotesCacheQueryQueryVariables>;
export const TagWithNoteIdsDocument = gql`
    query TagWithNoteIds($tagId: ID!) {
  tag(tagId: $tagId) {
    _id
    notes {
      ... on INote {
        _id
      }
    }
  }
}
    `;

/**
 * __useTagWithNoteIdsQuery__
 *
 * To run a query within a React component, call `useTagWithNoteIdsQuery` and pass it any options that fit your needs.
 * When your component renders, `useTagWithNoteIdsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTagWithNoteIdsQuery({
 *   variables: {
 *      tagId: // value for 'tagId'
 *   },
 * });
 */
export function useTagWithNoteIdsQuery(baseOptions: Apollo.QueryHookOptions<TagWithNoteIdsQuery, TagWithNoteIdsQueryVariables> & ({ variables: TagWithNoteIdsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TagWithNoteIdsQuery, TagWithNoteIdsQueryVariables>(TagWithNoteIdsDocument, options);
      }
export function useTagWithNoteIdsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TagWithNoteIdsQuery, TagWithNoteIdsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TagWithNoteIdsQuery, TagWithNoteIdsQueryVariables>(TagWithNoteIdsDocument, options);
        }
export function useTagWithNoteIdsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<TagWithNoteIdsQuery, TagWithNoteIdsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<TagWithNoteIdsQuery, TagWithNoteIdsQueryVariables>(TagWithNoteIdsDocument, options);
        }
export type TagWithNoteIdsQueryHookResult = ReturnType<typeof useTagWithNoteIdsQuery>;
export type TagWithNoteIdsLazyQueryHookResult = ReturnType<typeof useTagWithNoteIdsLazyQuery>;
export type TagWithNoteIdsSuspenseQueryHookResult = ReturnType<typeof useTagWithNoteIdsSuspenseQuery>;
export type TagWithNoteIdsQueryResult = Apollo.QueryResult<TagWithNoteIdsQuery, TagWithNoteIdsQueryVariables>;
export const NotesForSortAndFilterDocument = gql`
    query NotesForSortAndFilter {
  notes {
    ... on INote {
      _id
      createdAt
      updatedAt
      changedAt
      archivedAt
      name
      tags {
        _id
      }
    }
    ... on Link {
      url
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
    ... on INote {
      _id
      archivedAt
      updatedAt
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
export const AddLinkDocument = gql`
    mutation AddLink($url: String!, $title: String, $description: String) {
  submitLink(url: $url, title: $title, description: $description) {
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
 *      title: // value for 'title'
 *      description: // value for 'description'
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
export const AddTagByNameToNoteDocument = gql`
    mutation AddTagByNameToNote($noteId: ID!, $tagName: String!) {
  addTagByNameToNote(noteId: $noteId, name: $tagName) {
    ... on INote {
      _id
      updatedAt
      tags {
        ...BaseTag
        noteCount
        notes {
          ... on INote {
            _id
          }
        }
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
    