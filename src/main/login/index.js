import Button from '@material-ui/core/Button'
import React, { Component } from 'react'

import './index.css'

export default class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      params: this.getHashParams()
    }
  }

  getHashParams() {
    const hashParams = {}
    let e
    const r = /([^&;=]+)=?([^&;]*)/g
    const q = window.location.hash.substring(1)

    // eslint-disable-next-line no-cond-assign
    while (e = r.exec(q)) {
      hashParams[e[1]] = decodeURIComponent(e[2])
    }

    return hashParams
  }

  handleLogin() {
    const clientId = 'e335c760164e4352a2813e94f86921b4'
    const scope = 'user-read-private user-read-email playlist-modify-public'
    const redirectUri =
      window.location.host === 'localhost:3000'
        ? 'http://localhost:3000/'
        : 'https://lift-music.herokuapp.com/'

    const url = `https://accounts.spotify.com/authorize?response_type=token&client_id=${encodeURIComponent(clientId)}&scope=${encodeURIComponent(scope)}&redirect_uri=${encodeURIComponent(redirectUri)}`
    window.location = url
  }

  render() {
    if (this.state.params.access_token) {
      this.props.onLogin(this.state.params.access_token)
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
