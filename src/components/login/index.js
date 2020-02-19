import Button from '@material-ui/core/Button'
import { func } from 'prop-types'
import React, { Component } from 'react'

import './index.css'

export default class Login extends Component {
  static propTypes = {
    onLogin: func.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      accessToken: this.getAccessToken()
    }
  }

  getAccessToken = () => {
    const hashParams = {}
    let e
    const r = /([^&;=]+)=?([^&;]*)/g
    const q = window.location.hash.substring(1)

    // eslint-disable-next-line no-cond-assign
    while (e = r.exec(q)) {
      hashParams[e[1]] = decodeURIComponent(e[2])
    }

    return hashParams.access_token
  }

  handleLogin = () => {
    const url = 'https://accounts.spotify.com/authorize?response_type=token' +
      '&client_id=' + encodeURIComponent(process.env.spotifyClientId) +
      '&scope=' + encodeURIComponent(process.env.spotifyApiScope) +
      '&redirect_uri=' + encodeURIComponent(process.env.redirectUri)
    window.location = url
  }

  render() {
    if (this.state.accessToken) {
      this.props.onLogin(this.state.accessToken)
      return (<div />)
    }
    return (
      <div className="header-container">
        <div className="lift-intro-container">
          <span className="login-lift-motto">search your favorite artists.</span>
          <span className="login-lift-motto">access a curated playlist.</span>
          <span className="login-lift-motto">listen to uplifting music.</span>
          <span className="login-lift-title">welcome to lift.</span>
        </div>
        <Button variant="contained" color="primary" className="login-button" onClick={this.handleLogin}>
          Login with Spotify
        </Button>
      </div>
    )
  }
}
