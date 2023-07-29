import { FC, lazy } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'

import { AuthProvider } from './context/auth'

const AuthLayout = lazy(() => import('./pages/auth'))
const LoginPage = lazy(() => import('./pages/login'))
const HomePage = lazy(() => import('./pages/home'))
const TrackPage = lazy(() => import('./pages/track'))

const theme = createTheme({
  palette: {
    mode: 'dark',
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
        element: <HomePage />
      },
      {
        path: '/track/:trackId',
        element: <TrackPage />
      }
    ]
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
])

const App: FC = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </ThemeProvider>
)

export default App
