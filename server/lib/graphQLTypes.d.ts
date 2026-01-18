import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
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
  __typename?: 'Credentials';
  bookmarklet?: Maybe<Scalars['String']['output']>;
  rss?: Maybe<Scalars['String']['output']>;
};

export type EntitiesUpdatedSince = {
  __typename?: 'EntitiesUpdatedSince';
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
  __typename?: 'Mutation';
  addTagByNameToNote: Note;
  createNote: Note;
  createTag: Tag;
  permanentlyDeleteTag: Tag;
  removeTagByIdFromNote: Note;
  requestNewCredential: User;
  revokeCredential: User;
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
  __typename?: 'Note';
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
  __typename?: 'NotesPermissions';
  read: Scalars['Boolean']['output'];
  write: Scalars['Boolean']['output'];
};

export type Query = {
  __typename?: 'Query';
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
  __typename?: 'Tag';
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
  __typename?: 'TagPermissions';
  read: Scalars['Boolean']['output'];
  share: Scalars['Boolean']['output'];
  use: Scalars['Boolean']['output'];
  write: Scalars['Boolean']['output'];
};

export type User = BaseObject & {
  __typename?: 'User';
  _id: Scalars['ID']['output'];
  authenticationProvider?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Date']['output'];
  credentials?: Maybe<Credentials>;
  name: Scalars['String']['output'];
  updatedAt: Scalars['Date']['output'];
};

export type UserPermissions = {
  __typename?: 'UserPermissions';
  notes: NotesPermissions;
  tag: TagPermissions;
  user: User;
};

export type Versions = {
  __typename?: 'Versions';
  current: Scalars['String']['output'];
  minimum?: Maybe<Scalars['String']['output']>;
  /** @deprecated Upgrade to 0.20.0+ and use 'current' field */
  recommended?: Maybe<Scalars['String']['output']>;
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


/** Mapping of interface types */
export type ResolversInterfaceTypes<_RefType extends Record<string, unknown>> = {
  BaseObject: ( Note ) | ( Tag ) | ( User );
};

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  BaseObject: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['BaseObject']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Credentials: ResolverTypeWrapper<Credentials>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Date: ResolverTypeWrapper<Scalars['Date']['output']>;
  EntitiesUpdatedSince: ResolverTypeWrapper<EntitiesUpdatedSince>;
  InputNote: InputNote;
  InputTag: InputTag;
  Mutation: ResolverTypeWrapper<{}>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Note: ResolverTypeWrapper<Note>;
  NotesPermissions: ResolverTypeWrapper<NotesPermissions>;
  Query: ResolverTypeWrapper<{}>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Tag: ResolverTypeWrapper<Tag>;
  TagPermissions: ResolverTypeWrapper<TagPermissions>;
  User: ResolverTypeWrapper<User>;
  UserPermissions: ResolverTypeWrapper<UserPermissions>;
  Versions: ResolverTypeWrapper<Versions>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  BaseObject: ResolversInterfaceTypes<ResolversParentTypes>['BaseObject'];
  ID: Scalars['ID']['output'];
  Credentials: Credentials;
  String: Scalars['String']['output'];
  Date: Scalars['Date']['output'];
  EntitiesUpdatedSince: EntitiesUpdatedSince;
  InputNote: InputNote;
  InputTag: InputTag;
  Mutation: {};
  Boolean: Scalars['Boolean']['output'];
  Note: Note;
  NotesPermissions: NotesPermissions;
  Query: {};
  Int: Scalars['Int']['output'];
  Tag: Tag;
  TagPermissions: TagPermissions;
  User: User;
  UserPermissions: UserPermissions;
  Versions: Versions;
};

export type BaseObjectResolvers<ContextType = any, ParentType extends ResolversParentTypes['BaseObject'] = ResolversParentTypes['BaseObject']> = {
  __resolveType: TypeResolveFn<'Note' | 'Tag' | 'User', ParentType, ContextType>;
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

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  addTagByNameToNote?: Resolver<ResolversTypes['Note'], ParentType, ContextType, RequireFields<MutationAddTagByNameToNoteArgs, 'name' | 'noteId'>>;
  createNote?: Resolver<ResolversTypes['Note'], ParentType, ContextType, Partial<MutationCreateNoteArgs>>;
  createTag?: Resolver<ResolversTypes['Tag'], ParentType, ContextType, RequireFields<MutationCreateTagArgs, 'name'>>;
  permanentlyDeleteTag?: Resolver<ResolversTypes['Tag'], ParentType, ContextType, RequireFields<MutationPermanentlyDeleteTagArgs, 'tagId'>>;
  removeTagByIdFromNote?: Resolver<ResolversTypes['Note'], ParentType, ContextType, RequireFields<MutationRemoveTagByIdFromNoteArgs, 'noteId' | 'tagId'>>;
  requestNewCredential?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationRequestNewCredentialArgs, 'purpose'>>;
  revokeCredential?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationRevokeCredentialArgs, 'purpose'>>;
  shareTag?: Resolver<ResolversTypes['Tag'], ParentType, ContextType, RequireFields<MutationShareTagArgs, 'tagId' | 'username'>>;
  toggleArchivedNote?: Resolver<ResolversTypes['Note'], ParentType, ContextType, RequireFields<MutationToggleArchivedNoteArgs, 'noteId'>>;
  toggleDeletedNote?: Resolver<ResolversTypes['Note'], ParentType, ContextType, RequireFields<MutationToggleDeletedNoteArgs, 'noteId'>>;
  unshareTag?: Resolver<ResolversTypes['Tag'], ParentType, ContextType, RequireFields<MutationUnshareTagArgs, 'tagId' | 'userId'>>;
  updateNote?: Resolver<ResolversTypes['Note'], ParentType, ContextType, RequireFields<MutationUpdateNoteArgs, 'note'>>;
  updatePermissionOnTag?: Resolver<ResolversTypes['Tag'], ParentType, ContextType, RequireFields<MutationUpdatePermissionOnTagArgs, 'granted' | 'mode' | 'resource' | 'tagId' | 'userId'>>;
  updateTag?: Resolver<ResolversTypes['Tag'], ParentType, ContextType, RequireFields<MutationUpdateTagArgs, 'tag'>>;
};

export type NoteResolvers<ContextType = any, ParentType extends ResolversParentTypes['Note'] = ResolversParentTypes['Note']> = {
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  archivedAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  changedAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  deletedAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  domain?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  path?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  tags?: Resolver<Array<ResolversTypes['Tag']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NotesPermissionsResolvers<ContextType = any, ParentType extends ResolversParentTypes['NotesPermissions'] = ResolversParentTypes['NotesPermissions']> = {
  read?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  write?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  currentUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  entitiesUpdatedSince?: Resolver<ResolversTypes['EntitiesUpdatedSince'], ParentType, ContextType, Partial<QueryEntitiesUpdatedSinceArgs>>;
  note?: Resolver<ResolversTypes['Note'], ParentType, ContextType, RequireFields<QueryNoteArgs, 'noteId'>>;
  notes?: Resolver<Array<ResolversTypes['Note']>, ParentType, ContextType, Partial<QueryNotesArgs>>;
  tag?: Resolver<ResolversTypes['Tag'], ParentType, ContextType, Partial<QueryTagArgs>>;
  tags?: Resolver<Array<ResolversTypes['Tag']>, ParentType, ContextType, Partial<QueryTagsArgs>>;
  titleSuggestions?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType, RequireFields<QueryTitleSuggestionsArgs, 'noteId'>>;
  versions?: Resolver<ResolversTypes['Versions'], ParentType, ContextType, Partial<QueryVersionsArgs>>;
};

export type TagResolvers<ContextType = any, ParentType extends ResolversParentTypes['Tag'] = ResolversParentTypes['Tag']> = {
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  changedAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  color?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  noteCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
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
  Mutation?: MutationResolvers<ContextType>;
  Note?: NoteResolvers<ContextType>;
  NotesPermissions?: NotesPermissionsResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Tag?: TagResolvers<ContextType>;
  TagPermissions?: TagPermissionsResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserPermissions?: UserPermissionsResolvers<ContextType>;
  Versions?: VersionsResolvers<ContextType>;
};

