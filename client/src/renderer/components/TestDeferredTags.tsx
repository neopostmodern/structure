import { useEffect, useState } from 'react';
import { Skeleton } from '@mui/material';
import deferUntilIdle from '../utils/deferUntilIdle';
import Tags, { TagContainer } from './Tags';

// todo: completely include in regular Tags component and make opt-out only

const TestDeferredTags = ({ tags, noteId }) => {
  const [showSkeleton, setShowSkeleton] = useState(true);
  useEffect(() => {
    deferUntilIdle(() => setShowSkeleton(false), 1000);
  }, [setShowSkeleton]);

  if (showSkeleton) {
    return (
      <TagContainer>
        {tags.map((tag) => (
          <Skeleton key={tag._id} variant="text" height={'2.2rem'}>
            <div>{tag.name}</div>
          </Skeleton>
        ))}
      </TagContainer>
    );
  }

  return <Tags tags={tags} noteId={noteId} />;
};

export default TestDeferredTags;
