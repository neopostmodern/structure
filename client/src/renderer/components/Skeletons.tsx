import { Skeleton, Stack } from '@mui/material';

export const SkeletonTag = () => (
  <Skeleton height={35} width={100} sx={{ borderRadius: '13px/18px' }} />
);

export const SkeletonNote = () => (
  <div>
    <Stack gap={4} direction="row" alignItems="center">
      <Skeleton height={40} width="100%" />
      <Skeleton width={80} />
    </Stack>
    <Skeleton height={15} width={150} />
    <Stack gap={2} direction="row">
      <SkeletonTag />
      <SkeletonTag />
    </Stack>
  </div>
);

export const SkeletonNoteList = () => (
  <Stack gap={4}>
    <SkeletonNote />
    <SkeletonNote />
    <SkeletonNote />
    <SkeletonNote />
    <SkeletonNote />
    <SkeletonNote />
    <SkeletonNote />
  </Stack>
);
