import { MoreHoriz } from '@mui/icons-material';
import {
  FunctionComponent,
  LazyExoticComponent,
  NamedExoticComponent,
  Suspense,
} from 'react';

const suspenseWrap =
  <T,>(
    LazyComponent: LazyExoticComponent<
      FunctionComponent<T> | NamedExoticComponent<T>
    >,
    Fallback: FunctionComponent<Partial<T>> = () => <MoreHoriz />
  ) =>
  (props: T) =>
    (
      <Suspense fallback={<Fallback {...(props as any)} />}>
        <LazyComponent {...(props as any)} />
      </Suspense>
    );

export default suspenseWrap;
