import { FC, lazy } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { createTheme, ThemeProvider } from '@mui/material/styles'

import { AuthProvider } from './context/auth'

const AuthLayout = lazy(() => import('./pages/auth'))
const Login = lazy(() => import('./pages/login'))
const Home = lazy(() => import('./pages/home'))

const theme = createTheme({
  palette: {
    primary: { main: '#125ec8' },
    secondary: { main: '#f2f5f7' }
  },
})

const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/',
        element: <Home />
      }
    ]
  },
  {
    path: '/login',
    element: <Login />,
  },
])

const App: FC = () => (
  <ThemeProvider theme={theme}>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </ThemeProvider>
)

export default App
