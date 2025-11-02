import { MoreHoriz } from '@mui/icons-material'
import {
  FunctionComponent,
  LazyExoticComponent,
  NamedExoticComponent,
  Suspense,
} from 'react'

const suspenseWrap =
  <T,>(
    LazyComponent: LazyExoticComponent<
      FunctionComponent<T> | NamedExoticComponent<T>
    >,
    Fallback = () => <MoreHoriz />,
  ) =>
  (props: T) => (
    <Suspense fallback={<Fallback />}>
      <LazyComponent {...(props as any)} />
    </Suspense>
  )

export default suspenseWrap
