import { createTheme, ThemeProvider } from '@mui/material/styles'
import { createRoot } from 'react-dom/client';

import './index.css'
import App from './app'

const theme = createTheme({
  palette: {
    primary: { main: '#125ec8' },
    secondary: { main: '#f2f5f7' }
  },
})

const root = createRoot(document.getElementById('root'))

root.render(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>
)
