import { Button } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import { AdditionalNavigationItem } from '../containers/ComplexLayout';
import { UserAndMenuIndicator } from '../containers/ComplexLayout.style';
import { Menu } from './Menu';

const UserAndMenuIndicatorDesktop = ({
  additionalNavigationItems,
}: {
  additionalNavigationItems: Array<AdditionalNavigationItem>;
}) => (
  <UserAndMenuIndicator>
    <Menu>
      {additionalNavigationItems.map(({ label, path, icon }) => (
        <Button
          key={path}
          size="large"
          startIcon={icon}
          to={path}
          component={Link}
        >
          {label}
        </Button>
      ))}
    </Menu>
  </UserAndMenuIndicator>
);

export default React.memo(UserAndMenuIndicatorDesktop);
