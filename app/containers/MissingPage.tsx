import React from 'react'
import { useLocation } from 'react-router'

import Centered from '../components/Centered'

const MissingPage: React.FC<{}> = () => {
  const location = useLocation()
  return <Centered>No idea where to find ${location.pathname}</Centered>
}

export default MissingPage
