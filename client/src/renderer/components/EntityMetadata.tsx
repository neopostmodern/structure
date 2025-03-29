import { AccountCircle, Add, Edit } from '@mui/icons-material';
import {
  DateOrTimestamp,
  dateToCustomizedLongISO8061,
  dateToShortISO8601,
} from '../utils/textHelpers';
import ButtonLike from './ButtonLike';

const EntityMetadata = ({
  entity,
}: {
  entity: {
    createdAt: DateOrTimestamp;
    updatedAt: DateOrTimestamp;
    changedAt: DateOrTimestamp;
    user: {
      name: string;
    };
  };
}) => (
  <>
    <ButtonLike
      startIcon={<AccountCircle />}
      tooltip={`Owned by ${entity.user.name}`}
    >
      {entity.user.name}
    </ButtonLike>
    <ButtonLike
      startIcon={<Add />}
      tooltip={`Created at ${dateToCustomizedLongISO8061(entity.createdAt)}`}
    >
      Created {dateToShortISO8601(entity.createdAt)}
    </ButtonLike>
    <ButtonLike
      startIcon={<Edit />}
      tooltip={`Changed at ${dateToCustomizedLongISO8061(
        entity.changedAt
      )} (last database update at ${dateToCustomizedLongISO8061(
        entity.updatedAt
      )})`}
    >
      Changed {dateToShortISO8601(entity.changedAt)}
    </ButtonLike>
  </>
);

export default EntityMetadata;
