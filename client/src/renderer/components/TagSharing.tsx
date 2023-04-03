import { TagsQuery } from '../generated/graphql';
import useHasPermission from '../hooks/useHasPermission';
import TagSharingTable from './TagSharingTable';

type TagType = TagsQuery['tags'][number];

const TagSharing = ({ tag }: { tag: TagType }) => {
  const hasSharePermission = useHasPermission({ tags: [tag] }, 'tag', 'share');
  return (
    <div>
      <TagSharingTable tag={tag} readOnly={!hasSharePermission} />
      {/* todo: UI to share tag with a user */}
    </div>
  );
};

export default TagSharing;
