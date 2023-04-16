import { Tooltip, TooltipProps } from '@mui/material';
import Shortcut from './Shortcut';

const TooltipWithShortcut = ({
  title,
  shortcut,
  adjustVerticalDistance,
  children,
  ...props
}: TooltipProps & {
  shortcut?: Array<string>;
  adjustVerticalDistance?: number;
}) => {
  let combinedTitle = title;
  if (shortcut) {
    combinedTitle = (
      <div style={{ textAlign: 'center' }}>
        {title}
        {title && <br />}
        <Shortcut shortcuts={shortcut} />
      </div>
    );
  }
  return (
    <Tooltip
      title={combinedTitle}
      PopperProps={
        adjustVerticalDistance
          ? {
              modifiers: [
                {
                  name: 'offset',
                  options: { offset: [0, adjustVerticalDistance] },
                },
              ],
            }
          : undefined
      }
      {...props}
    >
      {children}
    </Tooltip>
  );
};

export default TooltipWithShortcut;
