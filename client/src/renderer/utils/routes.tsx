export const noteUrl = (note: { __typename: string; _id: string }): string =>
  `/${note.__typename.toLowerCase()}s/${note._id}`;
