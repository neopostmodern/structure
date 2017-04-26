// @flow

export type LinkType = {
  _id: string,
  url: string,
  domain: string,
  name: string,
  description: string,
  tags: Array<TagType>
};

export type TagType = {
  _id: string,
  name: string,
  color: string,
  links: Array<LinkType>
};
