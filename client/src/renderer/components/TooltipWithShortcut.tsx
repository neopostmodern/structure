import { Tooltip, TooltipProps } from '@mui/material';
import { Fragment } from 'react';
import styled from 'styled-components';
import { getKeyForDisplay, GLOBAL } from '../utils/keyboard';

const Key = styled.div`
  display: inline-block;
  padding: 0.1em 0.4em;
  border-radius: 2px;
  background-color: #222;
`;

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
        {shortcut[0]
          .replace(GLOBAL, '')
          .split('+')
          .map((part, partIndex, allParts) => (
            <Fragment key={part}>
              <Key>{getKeyForDisplay(part)}</Key>
              {partIndex < allParts.length - 1 && ' + '}
            </Fragment>
          ))}
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
