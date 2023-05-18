import { AddCircleOutline as PlusIcon } from '@mui/icons-material';
import { Button, IconButton } from '@mui/material';
import { INTERNAL_TAG_PREFIX } from '@structure/common';
import { lazy, useCallback, useState } from 'react';
import useShortcut from '../hooks/useShortcut';
import { SHORTCUTS } from '../utils/keyboard';
import suspenseWrap from '../utils/suspenseWrap';
import type { AddTagFormProps } from './AddTagForm';
import TooltipWithShortcut from './TooltipWithShortcut';

const AddTagForm = suspenseWrap(
  lazy(() => import(/* webpackPrefetch: true */ './AddTagForm'))
);

const AddTagButtonOrForm = ({
  currentTags,
  withShortcuts,
  ...tagFormProps
}: AddTagFormProps & {
  withShortcuts?: boolean;
}) => {
  const [addingNew, setAddingNew] = useState<boolean>(false);

  const showNewTagForm = useCallback((): void => {
    setAddingNew(true);
  }, [setAddingNew]);

  const hideNewTagForm = useCallback((): void => {
    setAddingNew(false);
  }, [setAddingNew]);

  useShortcut(withShortcuts ? SHORTCUTS.ADD_TAG : null, showNewTagForm, true);

  if (addingNew) {
    return (
      <AddTagForm
        currentTags={currentTags}
        onHideTagForm={hideNewTagForm}
        {...tagFormProps}
      />
    );
  }

  if (
    currentTags.filter((tag) => !tag.name.startsWith(INTERNAL_TAG_PREFIX))
      .length === 0
  ) {
    return (
      <TooltipWithShortcut
        title=""
        shortcut={withShortcuts ? SHORTCUTS.ADD_TAG : undefined}
      >
        <Button variant="outlined" size="small" onClick={showNewTagForm}>
          Add tag
        </Button>
      </TooltipWithShortcut>
    );
  }

  return (
    <TooltipWithShortcut
      title="Add tag"
      shortcut={withShortcuts ? SHORTCUTS.ADD_TAG : undefined}
    >
      <IconButton size="small" onClick={showNewTagForm}>
        <PlusIcon />
      </IconButton>
    </TooltipWithShortcut>
  );
};

export default AddTagButtonOrForm;
