import { Button, Tooltip } from '@mui/material';
import { FC, PropsWithChildren } from 'react';

const ButtonLike: FC<
  PropsWithChildren<{ startIcon: JSX.Element; tooltip?: string }>
> = ({ children, tooltip, startIcon }) => {
  const buttonLike = (
    <Button disabled startIcon={startIcon}>
      {children}
    </Button>
  );
  if (!tooltip) {
    return buttonLike;
  }
  return (
    <Tooltip title={tooltip} placement="top">
      <div>{buttonLike}</div>
    </Tooltip>
  );
};

export default ButtonLike;
