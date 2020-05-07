import { createMuiTheme, MuiThemeProvider } from '@material-ui/core'
import * as React from 'react'
import * as ReactDOM from 'react-dom'

import './index.css'
import App from './app'

const theme = createMuiTheme({
  palette: {
    primary: { main: '#125ec8' },
    secondary: { main: '#f2f5f7' }
  },
  typography: {
    useNextVariants: true
  }
})

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <App />
  </MuiThemeProvider>,
  document.getElementById('root')
)
