export type TagObject = {
  _id: string;
  createdAt: number;
  updatedAt: number;
  name: string;
  color: string;
};
export type NoteObject = {
  __typename: 'Link' | 'Text';
  _id: string;
  url?: string;
  domain?: string;
  name: string;
  description: string;
  tags: Array<TagObject>;
  createdAt: number; // todo: Date
  updatedAt: number; // todo: Date
  archivedAt: number | null; // todo: Date
};
