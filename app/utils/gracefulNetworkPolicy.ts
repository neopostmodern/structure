import { WatchQueryFetchPolicy } from '@apollo/client'

const gracefulNetworkPolicy = (): WatchQueryFetchPolicy =>
  navigator.onLine ? 'cache-and-network' : 'cache-only'

export default gracefulNetworkPolicy
