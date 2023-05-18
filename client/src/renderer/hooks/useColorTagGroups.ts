import { INTERNAL_TAG_PREFIX } from '@structure/common';
import { useMemo } from 'react';
import { TagsQuery, TagsQueryVariables } from '../generated/graphql';
import { DataState, UseDataStateLazyQuery } from '../utils/useDataState';

type ColorTagGroups = {
  [color: string]: TagsQuery['tags'];
};

const useColorTagGroups = (
  tagsQuery: UseDataStateLazyQuery<TagsQuery, TagsQueryVariables>
) =>
  useMemo<ColorTagGroups>(() => {
    const groups: ColorTagGroups = {};

    if (tagsQuery.state === DataState.DATA) {
      tagsQuery.data?.tags.forEach((tag) => {
        if (tag.name.startsWith(INTERNAL_TAG_PREFIX)) {
          return;
        }
        if (!groups[tag.color]) {
          groups[tag.color] = [];
        }
        groups[tag.color].push(tag);
      });
    }

    return groups;
  }, [tagsQuery]);

export default useColorTagGroups;
