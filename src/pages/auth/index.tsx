import { FC } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { useAuth } from '../../hooks/useAuth'

const AuthLayout: FC = () => {
  const auth = useAuth()
  const location = useLocation()

  if (!auth.isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet/>
}

export default AuthLayout
