import { FC } from 'react'
import { useLocation } from 'react-router'
import { Navigate } from 'react-router-dom'
import Centered from '../components/Centered'
import ComplexLayout from './ComplexLayout'

const MissingPage: FC = () => {
  const location = useLocation()

  // redirects old routes
  // <Route path='/texts/:textId' element={<TextPage />} />
  // <Route path='/links/:linkId' element={<NotePage />} />
  if (location.pathname.startsWith('/texts/')) {
    return <Navigate replace to={location.pathname.replace('texts', 'notes')} />
  }
  if (location.pathname.startsWith('/links/')) {
    return <Navigate replace to={location.pathname.replace('links', 'notes')} />
  }

  return (
    <ComplexLayout>
      <Centered>No idea where to find {location.pathname}</Centered>
    </ComplexLayout>
  )
}

export default MissingPage
