import { WatchQueryFetchPolicy } from '@apollo/client'

const gracefulNetworkPolicy = (
  onlineNetworkPolicy: WatchQueryFetchPolicy = 'cache-and-network',
): WatchQueryFetchPolicy =>
  navigator.onLine ? onlineNetworkPolicy : 'cache-only'

export default gracefulNetworkPolicy
