import { FC, lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'

import { AuthProvider } from './context/auth'

const AuthLayout = lazy(() => import('./pages/auth'))
const LoginPage = lazy(() => import('./pages/login'))
const HomePage = lazy(() => import('./pages/home'))
const TrackPage = lazy(() => import('./pages/track'))
const AlbumPage = lazy(() => import('./pages/album'))
const ArtistPage = lazy(() => import('./pages/artist'))

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#125ec8' },
    secondary: { main: '#f2f5f7' }
  },
})

const router = createBrowserRouter([
  {
    element: <AuthLayout/>,
    children: [
      {
        path: '/',
        element: <HomePage/>

      },
      {
        path: '/track/:trackId',
        element: <TrackPage/>
      },
      {
        path: '/album/:albumId',
        element: <AlbumPage/>
      },
      {
        path: '/artist/:artistId',
        element: <ArtistPage/>
      }
    ]
  },
  {
    path: '/login',
    element: <LoginPage/>,
  },
])

const App: FC = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline/>
    <AuthProvider>
      <Suspense>
        <RouterProvider router={router}/>
      </Suspense>
    </AuthProvider>
  </ThemeProvider>
)

export default App
