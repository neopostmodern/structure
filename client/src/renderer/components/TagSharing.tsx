import { TagsQuery } from '../generated/graphql';
import TagSharingTable from './TagSharingTable';

type TagType = TagsQuery['tags'][number];

const TagSharing = ({ tag }: { tag: TagType }) => {
  return (
    <div>
      <TagSharingTable tag={tag} />
      {/* todo: UI to share tag with a user */}
    </div>
  );
};

export default TagSharing;
