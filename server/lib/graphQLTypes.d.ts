import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
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
  __typename?: 'Credentials';
  bookmarklet?: Maybe<Scalars['String']>;
  rss?: Maybe<Scalars['String']>;
};

export type EntitiesUpdatedSince = {
  __typename?: 'EntitiesUpdatedSince';
  addedNotes: Array<Note>;
  addedTags: Array<Tag>;
  cacheId: Scalars['ID'];
  removedNoteIds: Array<Scalars['ID']>;
  removedTagIds: Array<Scalars['ID']>;
  updatedNotes: Array<Note>;
  updatedTags: Array<Tag>;
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
  __typename?: 'Link';
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
  __typename?: 'Mutation';
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
  name: Scalars['String'];
  noteId: Scalars['ID'];
};


export type MutationCreateTagArgs = {
  color?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
};


export type MutationCreateTextArgs = {
  description?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
};


export type MutationPermanentlyDeleteTagArgs = {
  tagId: Scalars['ID'];
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


export type MutationShareTagArgs = {
  tagId: Scalars['ID'];
  username: Scalars['String'];
};


export type MutationSubmitLinkArgs = {
  description?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
  url: Scalars['String'];
};


export type MutationToggleArchivedNoteArgs = {
  noteId: Scalars['ID'];
};


export type MutationToggleDeletedNoteArgs = {
  noteId: Scalars['ID'];
};


export type MutationUnshareTagArgs = {
  tagId: Scalars['ID'];
  userId: Scalars['ID'];
};


export type MutationUpdateLinkArgs = {
  link: InputLink;
};


export type MutationUpdatePermissionOnTagArgs = {
  granted: Scalars['Boolean'];
  mode: Scalars['String'];
  resource: Scalars['String'];
  tagId: Scalars['ID'];
  userId: Scalars['ID'];
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
  __typename?: 'NotesPermissions';
  read: Scalars['Boolean'];
  write: Scalars['Boolean'];
};

export type Query = {
  __typename?: 'Query';
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
  cacheId?: InputMaybe<Scalars['ID']>;
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
  __typename?: 'Tag';
  _id: Scalars['ID'];
  color: Scalars['String'];
  createdAt: Scalars['Date'];
  name: Scalars['String'];
  notes?: Maybe<Array<Maybe<Note>>>;
  permissions: Array<UserPermissions>;
  updatedAt: Scalars['Date'];
  user: User;
};


export type TagPermissionsArgs = {
  onlyMine?: InputMaybe<Scalars['Boolean']>;
};

export type TagPermissions = {
  __typename?: 'TagPermissions';
  read: Scalars['Boolean'];
  share: Scalars['Boolean'];
  use: Scalars['Boolean'];
  write: Scalars['Boolean'];
};

export type Text = BaseObject & INote & {
  __typename?: 'Text';
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
  __typename?: 'User';
  _id: Scalars['ID'];
  authenticationProvider?: Maybe<Scalars['String']>;
  createdAt: Scalars['Date'];
  credentials?: Maybe<Credentials>;
  name: Scalars['String'];
  updatedAt: Scalars['Date'];
};

export type UserPermissions = {
  __typename?: 'UserPermissions';
  notes: NotesPermissions;
  tag: TagPermissions;
  user: User;
};

export type Versions = {
  __typename?: 'Versions';
  current: Scalars['String'];
  minimum?: Maybe<Scalars['String']>;
  /** @deprecated Upgrade to 0.20.0+ and use 'current' field */
  recommended?: Maybe<Scalars['String']>;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping of union types */
export type ResolversUnionTypes = {
  Note: ( Link ) | ( Text );
};

/** Mapping of union parent types */
export type ResolversUnionParentTypes = {
  Note: ( Link ) | ( Text );
};

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  BaseObject: ResolversTypes['Link'] | ResolversTypes['Tag'] | ResolversTypes['Text'] | ResolversTypes['User'];
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Credentials: ResolverTypeWrapper<Credentials>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Date: ResolverTypeWrapper<Scalars['Date']>;
  EntitiesUpdatedSince: ResolverTypeWrapper<Omit<EntitiesUpdatedSince, 'addedNotes' | 'updatedNotes'> & { addedNotes: Array<ResolversTypes['Note']>, updatedNotes: Array<ResolversTypes['Note']> }>;
  INote: ResolversTypes['Link'] | ResolversTypes['Text'];
  InputLink: InputLink;
  InputTag: InputTag;
  InputText: InputText;
  Link: ResolverTypeWrapper<Link>;
  Mutation: ResolverTypeWrapper<{}>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Note: ResolverTypeWrapper<ResolversUnionTypes['Note']>;
  NoteType: NoteType;
  NotesPermissions: ResolverTypeWrapper<NotesPermissions>;
  Query: ResolverTypeWrapper<{}>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Tag: ResolverTypeWrapper<Omit<Tag, 'notes'> & { notes?: Maybe<Array<Maybe<ResolversTypes['Note']>>> }>;
  TagPermissions: ResolverTypeWrapper<TagPermissions>;
  Text: ResolverTypeWrapper<Text>;
  User: ResolverTypeWrapper<User>;
  UserPermissions: ResolverTypeWrapper<UserPermissions>;
  Versions: ResolverTypeWrapper<Versions>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  BaseObject: ResolversParentTypes['Link'] | ResolversParentTypes['Tag'] | ResolversParentTypes['Text'] | ResolversParentTypes['User'];
  ID: Scalars['ID'];
  Credentials: Credentials;
  String: Scalars['String'];
  Date: Scalars['Date'];
  EntitiesUpdatedSince: Omit<EntitiesUpdatedSince, 'addedNotes' | 'updatedNotes'> & { addedNotes: Array<ResolversParentTypes['Note']>, updatedNotes: Array<ResolversParentTypes['Note']> };
  INote: ResolversParentTypes['Link'] | ResolversParentTypes['Text'];
  InputLink: InputLink;
  InputTag: InputTag;
  InputText: InputText;
  Link: Link;
  Mutation: {};
  Boolean: Scalars['Boolean'];
  Note: ResolversUnionParentTypes['Note'];
  NotesPermissions: NotesPermissions;
  Query: {};
  Int: Scalars['Int'];
  Tag: Omit<Tag, 'notes'> & { notes?: Maybe<Array<Maybe<ResolversParentTypes['Note']>>> };
  TagPermissions: TagPermissions;
  Text: Text;
  User: User;
  UserPermissions: UserPermissions;
  Versions: Versions;
};

export type BaseObjectResolvers<ContextType = any, ParentType extends ResolversParentTypes['BaseObject'] = ResolversParentTypes['BaseObject']> = {
  __resolveType: TypeResolveFn<'Link' | 'Tag' | 'Text' | 'User', ParentType, ContextType>;
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
};

export type CredentialsResolvers<ContextType = any, ParentType extends ResolversParentTypes['Credentials'] = ResolversParentTypes['Credentials']> = {
  bookmarklet?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  rss?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export type EntitiesUpdatedSinceResolvers<ContextType = any, ParentType extends ResolversParentTypes['EntitiesUpdatedSince'] = ResolversParentTypes['EntitiesUpdatedSince']> = {
  addedNotes?: Resolver<Array<ResolversTypes['Note']>, ParentType, ContextType>;
  addedTags?: Resolver<Array<ResolversTypes['Tag']>, ParentType, ContextType>;
  cacheId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  removedNoteIds?: Resolver<Array<ResolversTypes['ID']>, ParentType, ContextType>;
  removedTagIds?: Resolver<Array<ResolversTypes['ID']>, ParentType, ContextType>;
  updatedNotes?: Resolver<Array<ResolversTypes['Note']>, ParentType, ContextType>;
  updatedTags?: Resolver<Array<ResolversTypes['Tag']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type INoteResolvers<ContextType = any, ParentType extends ResolversParentTypes['INote'] = ResolversParentTypes['INote']> = {
  __resolveType: TypeResolveFn<'Link' | 'Text', ParentType, ContextType>;
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  archivedAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  deletedAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tags?: Resolver<Array<ResolversTypes['Tag']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['NoteType'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
};

export type LinkResolvers<ContextType = any, ParentType extends ResolversParentTypes['Link'] = ResolversParentTypes['Link']> = {
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  archivedAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  deletedAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  domain?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  path?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tags?: Resolver<Array<ResolversTypes['Tag']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['NoteType'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  addTagByNameToNote?: Resolver<ResolversTypes['Note'], ParentType, ContextType, RequireFields<MutationAddTagByNameToNoteArgs, 'name' | 'noteId'>>;
  createTag?: Resolver<ResolversTypes['Tag'], ParentType, ContextType, RequireFields<MutationCreateTagArgs, 'name'>>;
  createText?: Resolver<ResolversTypes['Text'], ParentType, ContextType, Partial<MutationCreateTextArgs>>;
  permanentlyDeleteTag?: Resolver<ResolversTypes['Tag'], ParentType, ContextType, RequireFields<MutationPermanentlyDeleteTagArgs, 'tagId'>>;
  removeTagByIdFromNote?: Resolver<ResolversTypes['Note'], ParentType, ContextType, RequireFields<MutationRemoveTagByIdFromNoteArgs, 'noteId' | 'tagId'>>;
  requestNewCredential?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationRequestNewCredentialArgs, 'purpose'>>;
  revokeCredential?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationRevokeCredentialArgs, 'purpose'>>;
  shareTag?: Resolver<ResolversTypes['Tag'], ParentType, ContextType, RequireFields<MutationShareTagArgs, 'tagId' | 'username'>>;
  submitLink?: Resolver<ResolversTypes['Link'], ParentType, ContextType, RequireFields<MutationSubmitLinkArgs, 'url'>>;
  toggleArchivedNote?: Resolver<ResolversTypes['Note'], ParentType, ContextType, RequireFields<MutationToggleArchivedNoteArgs, 'noteId'>>;
  toggleDeletedNote?: Resolver<ResolversTypes['Note'], ParentType, ContextType, RequireFields<MutationToggleDeletedNoteArgs, 'noteId'>>;
  unshareTag?: Resolver<ResolversTypes['Tag'], ParentType, ContextType, RequireFields<MutationUnshareTagArgs, 'tagId' | 'userId'>>;
  updateLink?: Resolver<ResolversTypes['Link'], ParentType, ContextType, RequireFields<MutationUpdateLinkArgs, 'link'>>;
  updatePermissionOnTag?: Resolver<ResolversTypes['Tag'], ParentType, ContextType, RequireFields<MutationUpdatePermissionOnTagArgs, 'granted' | 'mode' | 'resource' | 'tagId' | 'userId'>>;
  updateTag?: Resolver<ResolversTypes['Tag'], ParentType, ContextType, RequireFields<MutationUpdateTagArgs, 'tag'>>;
  updateText?: Resolver<ResolversTypes['Text'], ParentType, ContextType, RequireFields<MutationUpdateTextArgs, 'text'>>;
};

export type NoteResolvers<ContextType = any, ParentType extends ResolversParentTypes['Note'] = ResolversParentTypes['Note']> = {
  __resolveType: TypeResolveFn<'Link' | 'Text', ParentType, ContextType>;
};

export type NotesPermissionsResolvers<ContextType = any, ParentType extends ResolversParentTypes['NotesPermissions'] = ResolversParentTypes['NotesPermissions']> = {
  read?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  write?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  currentUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  entitiesUpdatedSince?: Resolver<ResolversTypes['EntitiesUpdatedSince'], ParentType, ContextType, Partial<QueryEntitiesUpdatedSinceArgs>>;
  link?: Resolver<ResolversTypes['Link'], ParentType, ContextType, Partial<QueryLinkArgs>>;
  links?: Resolver<Array<ResolversTypes['Link']>, ParentType, ContextType, Partial<QueryLinksArgs>>;
  notes?: Resolver<Array<ResolversTypes['Note']>, ParentType, ContextType, Partial<QueryNotesArgs>>;
  tag?: Resolver<ResolversTypes['Tag'], ParentType, ContextType, Partial<QueryTagArgs>>;
  tags?: Resolver<Array<ResolversTypes['Tag']>, ParentType, ContextType, Partial<QueryTagsArgs>>;
  text?: Resolver<ResolversTypes['Text'], ParentType, ContextType, Partial<QueryTextArgs>>;
  titleSuggestions?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType, RequireFields<QueryTitleSuggestionsArgs, 'linkId'>>;
  versions?: Resolver<ResolversTypes['Versions'], ParentType, ContextType, Partial<QueryVersionsArgs>>;
};

export type TagResolvers<ContextType = any, ParentType extends ResolversParentTypes['Tag'] = ResolversParentTypes['Tag']> = {
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  color?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  notes?: Resolver<Maybe<Array<Maybe<ResolversTypes['Note']>>>, ParentType, ContextType>;
  permissions?: Resolver<Array<ResolversTypes['UserPermissions']>, ParentType, ContextType, Partial<TagPermissionsArgs>>;
  updatedAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TagPermissionsResolvers<ContextType = any, ParentType extends ResolversParentTypes['TagPermissions'] = ResolversParentTypes['TagPermissions']> = {
  read?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  share?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  use?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  write?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TextResolvers<ContextType = any, ParentType extends ResolversParentTypes['Text'] = ResolversParentTypes['Text']> = {
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  archivedAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  deletedAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tags?: Resolver<Array<ResolversTypes['Tag']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['NoteType'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  authenticationProvider?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  credentials?: Resolver<Maybe<ResolversTypes['Credentials']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserPermissionsResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserPermissions'] = ResolversParentTypes['UserPermissions']> = {
  notes?: Resolver<ResolversTypes['NotesPermissions'], ParentType, ContextType>;
  tag?: Resolver<ResolversTypes['TagPermissions'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type VersionsResolvers<ContextType = any, ParentType extends ResolversParentTypes['Versions'] = ResolversParentTypes['Versions']> = {
  current?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  minimum?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  recommended?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  BaseObject?: BaseObjectResolvers<ContextType>;
  Credentials?: CredentialsResolvers<ContextType>;
  Date?: GraphQLScalarType;
  EntitiesUpdatedSince?: EntitiesUpdatedSinceResolvers<ContextType>;
  INote?: INoteResolvers<ContextType>;
  Link?: LinkResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Note?: NoteResolvers<ContextType>;
  NotesPermissions?: NotesPermissionsResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Tag?: TagResolvers<ContextType>;
  TagPermissions?: TagPermissionsResolvers<ContextType>;
  Text?: TextResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserPermissions?: UserPermissionsResolvers<ContextType>;
  Versions?: VersionsResolvers<ContextType>;
};

