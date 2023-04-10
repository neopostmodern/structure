import { ArrowForward } from '@mui/icons-material';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
} from '@mui/material';
import { FC } from 'react';
import styled from 'styled-components';
import useShortcut from '../hooks/useShortcut';
import TooltipWithShortcut from './TooltipWithShortcut';

const CardButton = styled(Button)`
  text-transform: uppercase;
`;
const CardText = styled.pre`
  margin: 0;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  max-height: 5.5em;
  overflow-y: scroll;
`;

const AddNoteCard: FC<{
  suggestion?: string;
  title: string;
  subtitle?: string;
  icon: JSX.Element;
  action?: () => void;
  actionShortcut?: Array<string>;
  actions?: { [label: string]: () => void };
  additionalActions?: JSX.Element;
}> = ({
  suggestion,
  title,
  subtitle,
  icon,
  action,
  actionShortcut,
  actions,
  additionalActions,
}) => {
  useShortcut(actionShortcut, action || (() => {}), true);

  return (
    <Card
      variant="outlined"
      sx={{
        backgroundColor: 'initial',
        cursor: action ? 'pointer' : undefined,
      }}
      onClick={action}
    >
      <CardHeader
        avatar={icon}
        titleTypographyProps={{ fontSize: 'initial' }}
        title={title}
        subheader={subtitle}
        action={
          <>
            {additionalActions}
            {action && (
              <TooltipWithShortcut title="" shortcut={actionShortcut}>
                <IconButton>
                  <ArrowForward />
                </IconButton>
              </TooltipWithShortcut>
            )}
          </>
        }
      />
      {suggestion && (
        <CardContent sx={{ paddingTop: 0, paddingBottom: 0 }}>
          <CardText>{suggestion}</CardText>
        </CardContent>
      )}
      {actions && (
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          {Object.entries(actions).map(([label, action]) => (
            <CardButton key={label} onClick={action}>
              {label}
            </CardButton>
          ))}
        </CardActions>
      )}
    </Card>
  );
};

export default AddNoteCard;
