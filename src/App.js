import React, { Component } from 'react'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'

import './App.css'
import Main from './main';

const theme = createMuiTheme({
  palette: {
    primary: { main: '#125ec8' },
    secondary: { main: '#f2f5f7' }, // This is just green.A700 as hex.
  },
  typography: {
    useNextVariants: true
  },
})

class App extends Component {

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Main/>
      </MuiThemeProvider>
    )
  }
}

export default App
