import React from 'react';
import ReactDOM from 'react-dom';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core';

import './index.css';
import Main from './main';

const theme = createMuiTheme({
  palette: {
    primary: { main: '#125ec8' },
    secondary: { main: '#f2f5f7' }, // This is just green.A700 as hex.
  },
  typography: {
    useNextVariants: true
  }
})

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <Main/>
  </MuiThemeProvider>,
  document.getElementById('root')
)
