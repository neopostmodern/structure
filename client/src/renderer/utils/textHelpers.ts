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
