import { useMutation, useQuery } from '@apollo/client';
import { LocalOffer } from '@mui/icons-material';
import { Button } from '@mui/material';
import gql from 'graphql-tag';
import { FC, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled, { css } from 'styled-components';
import { changeTagsLayout, TagsLayout } from '../actions/userInterface';
import EmptyPageInfo from '../components/EmptyPageInfo';
import FatalApolloError from '../components/FatalApolloError';
import { Menu } from '../components/Menu';
import NetworkOperationsIndicator from '../components/NetworkOperationsIndicator';
import Tag from '../components/Tag';
import {
  TagsQuery,
  UpdateTag2Mutation,
  UpdateTag2MutationVariables,
} from '../generated/graphql';
import useEntitiesUpdatedSince from '../hooks/useEntitiesUpdatedSince';
import { RootState } from '../reducers';
import { breakpointDesktop } from '../styles/constants';
import colorTools, { ColorCache } from '../utils/colorTools';
import { stripTypename } from '../utils/graphQl';
import { BASE_TAG_FRAGMENT } from '../utils/sharedQueriesAndFragments';
import useDataState, { DataState } from '../utils/useDataState';
import ComplexLayout from './ComplexLayout';

const TagContainer = styled.div<{ color: string; droppable?: boolean }>`
  display: flex;
  flex-wrap: wrap;
  border-radius: ${({ theme }) => theme.shape.borderRadius}px;
  border: 1px solid transparent;
  ${({ droppable }) =>
    droppable &&
    css`
      border-color: ${({ color }) => color};
      .MuiChip-root {
        pointer-events: none;
      }
    `}

  padding: ${({ theme }) => theme.spacing(1)};
  gap: ${({ theme }) => theme.spacing(1)};
`;

const ColumnsContainer = styled.div`
  display: flex;
  align-items: stretch;

  max-width: 100vw;
  padding: ${({ theme }) => theme.spacing(2)};

  max-height: 80vh;
  overflow-x: auto;
  @media (min-width: ${breakpointDesktop}rem) {
    margin-top: 3rem;
  }

  ${TagContainer} {
    align-content: flex-start;
    flex-wrap: wrap;
    flex: 0 0.35 auto;

    .MuiChip-root {
      width: fit-content;
      max-width: 7em;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
`;

const ColumnIndicator = styled.div<{ color: string }>`
  position: sticky;
  top: 0;
  background-color: ${({ color }) => color};
  width: 100%;
  height: 0.5rem;
`;

export const layoutToName = (layout: TagsLayout): string => {
  switch (layout) {
    case TagsLayout.CHAOS_LAYOUT:
      return 'Chaos layout';
    case TagsLayout.COLOR_LIST_LAYOUT:
      return 'Color list layout';
    case TagsLayout.COLOR_COLUMN_LAYOUT:
      return 'Color column layout';
    default:
      console.error('Unknown layout', layout);
      return 'Unknown layout';
  }
};

export const TAGS_QUERY = gql`
  query Tags {
    tags {
      ...BaseTag
    }
  }
  ${BASE_TAG_FRAGMENT}
`;

const UPDATE_TAG_MUTATION = gql`
  mutation UpdateTag2($tag: InputTag!) {
    updateTag(tag: $tag) {
      ...BaseTag
    }
  }
  ${BASE_TAG_FRAGMENT}
`;

type ColorTagGroups = {
  [color: string]: TagsQuery['tags'];
};

const TagsPage: FC = () => {
  const dispatch = useDispatch();
  const layout = useSelector<RootState, TagsLayout>(
    (state) => state.userInterface.tagsLayout
  );
  const tagsQuery = useDataState(
    useQuery<TagsQuery>(TAGS_QUERY, { fetchPolicy: 'cache-only' })
  );

  const [updateTag] = useMutation<
    UpdateTag2Mutation,
    UpdateTag2MutationVariables
  >(UPDATE_TAG_MUTATION);

  const entitiesUpdatedSince = useEntitiesUpdatedSince();
  // todo: display something nice in case there are no tags in cache yet and
  // useEntitiesUpdatedSince actually performs the first fetch
  // see e.g. NotesPage, but less relevant here so pending for now
  // should find a universal solution

  const [draggedTag, setDraggedTag] = useState<TagsQuery['tags'][number]>();
  const [droppableColor, setDroppableColor] = useState<string | null>();
  const colorTagGroups = useMemo<ColorTagGroups>(() => {
    const groups: ColorTagGroups = {};

    if (tagsQuery.state === DataState.DATA) {
      tagsQuery.data?.tags.forEach((tag) => {
        if (!groups[tag.color]) {
          groups[tag.color] = [];
        }
        groups[tag.color].push(tag);
      });
    }

    return groups;
  }, [tagsQuery]);

  const selectNextLayout = (): void => {
    const layouts = Object.keys(TagsLayout);
    const nextLayoutIndex = (layouts.indexOf(layout) + 1) % layouts.length;
    dispatch(changeTagsLayout(TagsLayout[layouts[nextLayoutIndex]]));
  };

  const renderChaosLayout = (tags: TagsQuery['tags']): JSX.Element => {
    return (
      <TagContainer>
        {tags.map((tag) => (
          <Tag key={tag._id} tag={tag} ref={colorTools} />
        ))}
      </TagContainer>
    );
  };

  const renderColorListLayout = (horizontal = false): JSX.Element => {
    const colors = Object.keys(colorTagGroups)
      .map((color) => ({ color, h: ColorCache[color].hsl[0] }))
      .sort((color1, color2) => color2.h - color1.h)
      .map((color) => color.color);

    const tagContainers = colors.map((color) => (
      <TagContainer
        color={color}
        droppable={color === droppableColor}
        onDragOver={(event): void => {
          event.preventDefault();
          setDroppableColor(color);
        }}
        onDragLeave={(event): void => {
          event.preventDefault();
          setDroppableColor(null);
        }}
        onDrop={(): void => {
          if (!droppableColor || !draggedTag) {
            return;
          }
          const recoloredTag = {
            ...draggedTag,
            color: droppableColor,
          };
          updateTag({ variables: { tag: stripTypename(recoloredTag) } });
          setDroppableColor(null);
        }}
        key={color}
      >
        {horizontal && <ColumnIndicator color={color} />}
        {colorTagGroups[color].map((tag) => (
          <Tag
            key={tag._id}
            tag={tag}
            draggable
            onDragStart={(event): void => {
              // eslint-disable-next-line no-param-reassign
              event.dataTransfer.dropEffect = 'copy';
              setDraggedTag(tag);
            }}
          />
        ))}
      </TagContainer>
    ));

    if (horizontal) {
      return <ColumnsContainer>{tagContainers}</ColumnsContainer>;
    }

    return <>{tagContainers}</>;
  };

  const renderTags = (tags: TagsQuery['tags']): JSX.Element => {
    if (tags.length === 0) {
      return (
        <EmptyPageInfo
          icon={LocalOffer}
          title="You have not created any tags yet"
          subtitle="Tags are created on the fly when you add a tag that doesn't exist
            yet to a note."
        />
      );
    }

    switch (layout) {
      case TagsLayout.CHAOS_LAYOUT:
        return renderChaosLayout(tags);
      case TagsLayout.COLOR_LIST_LAYOUT:
        return renderColorListLayout();
      case TagsLayout.COLOR_COLUMN_LAYOUT:
        return renderColorListLayout(true);
      default:
        return <i>Unsupported layout.</i>;
    }
  };

  if (tagsQuery.state === DataState.LOADING) {
    return <ComplexLayout loading />;
  }

  if (tagsQuery.state === DataState.ERROR) {
    return (
      <ComplexLayout>
        <FatalApolloError key="error" query={tagsQuery} />
      </ComplexLayout>
    );
  }

  return (
    <ComplexLayout
      primaryActions={
        <Menu>
          <Button size="huge" onClick={selectNextLayout}>
            {layoutToName(layout)}
          </Button>
        </Menu>
      }
      wide={layout === TagsLayout.COLOR_COLUMN_LAYOUT}
    >
      <NetworkOperationsIndicator query={entitiesUpdatedSince} />
      {renderTags(tagsQuery.data.tags)}
    </ComplexLayout>
  );
};

export default TagsPage;
