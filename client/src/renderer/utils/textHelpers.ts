import { ArchiveState, LinkLayout } from '../actions/userInterface';

export const layoutToName = (layout: LinkLayout): string => {
  switch (layout) {
    case LinkLayout.GRID_LAYOUT:
      return 'Grid layout';
    case LinkLayout.LIST_LAYOUT:
      return 'List layout';
    default:
      console.error('Unkown layout', layout);
      return 'Unknown layout';
  }
};

export const archiveStateToName = (archiveState: ArchiveState): string => {
  switch (archiveState) {
    case ArchiveState.ONLY_ARCHIVE:
      return 'Only archive';
    case ArchiveState.BOTH:
      return 'Including archive';
    case ArchiveState.NO_ARCHIVE:
      return 'Without archive';
    default:
      console.error('Unkown layout', archiveState);
      return 'Unknown layout';
  }
};

/* BEGIN: from @palast-jetzt/common */
export const leadingZeros = (number: number | string, digits = 2) =>
  number.toString().padStart(digits, '0');

export type DateOrTimestamp = Date | number;
export const ensureDateObject = (date: DateOrTimestamp): Date =>
  typeof date === 'number' ? new Date(date) : date;

export const dateToShortISO8601 = (date: DateOrTimestamp): string => {
  const dateObject = ensureDateObject(date);

  return `${dateObject.getFullYear()}-${leadingZeros(
    dateObject.getMonth() + 1
  )}-${leadingZeros(dateObject.getDate())}`;
};

export const dateToISO8601Time = (date: DateOrTimestamp): string => {
  const dateObject = ensureDateObject(date);

  return `${leadingZeros(dateObject.getHours())}:${leadingZeros(
    dateObject.getMinutes()
  )}:${leadingZeros(dateObject.getSeconds())}`;
};

export const dateToCustomizedLongISO8061 = (date: DateOrTimestamp): string =>
  `${dateToShortISO8601(date)} ${dateToISO8601Time(date)}`;

export const capitalize = (text: string) =>
  text[0].toUpperCase() + text.slice(1);
/* END: from @palast-jetzt/common */
