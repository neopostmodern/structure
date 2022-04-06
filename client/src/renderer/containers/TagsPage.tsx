import { useMutation, useQuery } from '@apollo/client';
import { Button } from '@mui/material';
import gql from 'graphql-tag';
import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled, { css } from 'styled-components';
import { changeTagsLayout, TagsLayout } from '../actions/userInterface';
import { Menu } from '../components/Menu';
import Tag from '../components/Tag';
import { TagsQuery, TagsQuery_tags } from '../generated/TagsQuery';
import { UpdateTag2, UpdateTag2Variables } from '../generated/UpdateTag2';
import { RootState } from '../reducers';
import { breakpointDesktop } from '../styles/constants';
import colorTools, { ColorCache } from '../utils/colorTools';
import { stripTypename } from '../utils/graphQl';
import ComplexLayout from './ComplexLayout';

const TagContainer = styled.div<{ droppable?: boolean }>`
  display: flex;
  flex-wrap: wrap;
  border-radius: ${({ theme }) => theme.shape.borderRadius}px;
  border: 1px solid transparent;
  ${({ droppable }): string =>
    droppable
      ? css`
          border-color: gray;
          .MuiChip-root {
            pointer-events: none;
          }
        `
      : ''}

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
    margin-top: 8rem;
  }

  ${TagContainer} {
    align-content: flex-start;
    flex-wrap: wrap;

    .MuiChip-root {
      width: fit-content;
      max-width: 7em;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
`;

export const layoutToName = (layout: TagsLayout): string => {
  switch (layout) {
    case TagsLayout.CHAOS_LAYOUT:
      return 'Chaos layout';
    case TagsLayout.COLOR_LIST_LAYOUT:
      return 'Color list layout';
    case TagsLayout.COLOR_COLUMN_LAYOUT:
      return 'Color column layout';
    case TagsLayout.COLOR_WHEEL_LAYOUT:
      return 'Color wheel layout';
    default:
      console.error('Unknown layout', layout);
      return 'Unknown layout';
  }
};

export const TAGS_QUERY = gql`
  query TagsQuery {
    tags {
      _id
      name
      color
    }
  }
`;

const UPDATE_TAG_MUTATION = gql`
  mutation UpdateTag2($tag: InputTag!) {
    updateTag(tag: $tag) {
      _id
      name
      color
    }
  }
`;

type ColorTagGroups = {
  [color: string]: Array<TagsQuery_tags>;
};

const TagsPage: React.FC<{}> = () => {
  const dispatch = useDispatch();
  const layout = useSelector<RootState, TagsLayout>(
    (state) => state.userInterface.tagsLayout
  );
  const tagsQuery = useQuery<TagsQuery>(TAGS_QUERY);

  const [updateTag] = useMutation<UpdateTag2, UpdateTag2Variables>(
    UPDATE_TAG_MUTATION
  );

  const [draggedTag, setDraggedTag] = useState<TagsQuery_tags>();
  const [droppableColor, setDroppableColor] = useState<string | null>();
  const colorTagGroups = useMemo<ColorTagGroups>(() => {
    const groups: ColorTagGroups = {};

    tagsQuery.data?.tags.forEach((tag) => {
      if (!groups[tag.color]) {
        groups[tag.color] = [];
      }
      groups[tag.color].push(tag);
    });

    return groups;
  }, [tagsQuery]);

  const selectNextLayout = (): void => {
    const layouts = Object.keys(TagsLayout);
    const nextLayoutIndex = (layouts.indexOf(layout) + 1) % layouts.length;
    dispatch(changeTagsLayout(TagsLayout[layouts[nextLayoutIndex]]));
  };

  const renderChaosLayout = (): JSX.Element => {
    return (
      <TagContainer>
        {tagsQuery.data.tags.map((tag) => (
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
          if (!droppableColor) {
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

  const renderTags = (): JSX.Element => {
    switch (layout) {
      case TagsLayout.CHAOS_LAYOUT:
        return renderChaosLayout();
      case TagsLayout.COLOR_LIST_LAYOUT:
        return renderColorListLayout();
      case TagsLayout.COLOR_COLUMN_LAYOUT:
        return renderColorListLayout(true);
      default:
        return <i>Unsupported layout.</i>;
    }
  };

  return (
    <ComplexLayout
      loading={tagsQuery.loading}
      primaryActions={
        <Menu>
          <Button size="huge" onClick={selectNextLayout}>
            {layoutToName(layout)}
          </Button>
        </Menu>
      }
      wide={layout === TagsLayout.COLOR_COLUMN_LAYOUT}
    >
      {!tagsQuery.loading && renderTags()}
    </ComplexLayout>
  );
};

export default TagsPage;
