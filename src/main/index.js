import React, { Component } from 'react'
import Button from '@material-ui/core/Button'
import axios from 'axios'

import './index.css'

class Main extends Component {

  constructor(props) {
    super(props)
    const params = this.getHashParams()
    this.state = {
      isLoggedIn: params.hasOwnProperty('error') || !Object.keys(params).length ? false : true,
      accessToken: !params.access_token ? '' : params.access_token
    }
  }

  getHashParams() {
    let hashParams = {}
    let e
    const r = /([^&;=]+)=?([^&;]*)/g
    const q = window.location.hash.substring(1)

    while (e = r.exec(q)) {
      hashParams[e[1]] = decodeURIComponent(e[2])
    }

    return hashParams
  }

  handleLogin() {
    var client_id = 'e335c760164e4352a2813e94f86921b4'
    var scope = 'user-read-private user-read-email'
    var redirect_uri =
      window.location.host === 'localhost:3000'
        ? 'http://localhost:3000/'
        : 'https://lift-music.herokuapp.com/';

    var url = 'https://accounts.spotify.com/authorize'
    url += '?response_type=token'
    url += '&client_id=' + encodeURIComponent(client_id)
    url += '&scope=' + encodeURIComponent(scope)
    url += '&redirect_uri=' + encodeURIComponent(redirect_uri)

    window.location = url
  }

  renderLogin() {
    return (
      <div className="header-container">
          <span className="header-title">
            lift.
            music.
          </span>
        <Button variant="contained" color="primary" className="login-button" onClick={this.handleLogin}>
          Login with Spotify
        </Button>
      </div>
    )
  }

  renderLift() {
    return (
      <span>Welcome to lift.</span>
    )
  }

  render() {
    return (
      <div className="main-container">
        {this.state.isLoggedIn ? this.renderLift() : this.renderLogin()}
      </div>
    )
  }
}

export default Main
