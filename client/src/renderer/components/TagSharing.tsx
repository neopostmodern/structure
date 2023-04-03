import { TagsQuery } from '../generated/graphql';
import useHasPermission from '../hooks/useHasPermission';
import Gap from './Gap';
import TagSharingAdd from './TagSharingAdd';
import TagSharingTable from './TagSharingTable';

type TagType = TagsQuery['tags'][number];

const TagSharing = ({ tag }: { tag: TagType }) => {
  const hasSharePermission = useHasPermission({ tags: [tag] }, 'tag', 'share');
  return (
    <div>
      <TagSharingTable tag={tag} readOnly={!hasSharePermission} />
      {hasSharePermission && (
        <>
          <Gap vertical={1} />
          <TagSharingAdd tag={tag} />
        </>
      )}
    </div>
  );
};

export default TagSharing;
