import Button from '@material-ui/core/Button'
import * as moment from 'moment'
import * as React from 'react'

import './index.css'

const spotifyAccessTokenKey = 'lift_spotify_token'
const spotifyAccessTokenExpireTimeKey = 'lift_spotify_token_expire_date'

function getAccessToken() {
  const accessToken = window.localStorage.getItem(spotifyAccessTokenKey)
  const accessTokenExpirationDate = window.localStorage.getItem(spotifyAccessTokenExpireTimeKey)
  const isTokenExpired = moment() > moment(accessTokenExpirationDate)

  if (isTokenExpired)
    redirectToSpotify()

  if (accessToken && !isTokenExpired)
    return accessToken

  const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/)
  const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/)
  if (accessTokenMatch && expiresInMatch) {
    window.localStorage.setItem(spotifyAccessTokenKey, accessTokenMatch[1])
    window.localStorage.setItem(spotifyAccessTokenExpireTimeKey, moment().add(expiresInMatch[1], 's').format())
    window.location.href = process.env.redirectUri

    return window.localStorage.getItem(spotifyAccessTokenKey)
  }
}

function handleLogin() {
  redirectToSpotify()
}

function redirectToSpotify() {
  const url = 'https://accounts.spotify.com/authorize?response_type=token'
    + '&client_id=' + encodeURIComponent(process.env.spotifyClientId)
    + '&scope=' + encodeURIComponent(process.env.spotifyApiScope)
    + '&redirect_uri=' + encodeURIComponent(process.env.redirectUri)

  window.location.href = url
}

export default function Login(props: LoginProps) {
  const accessToken = getAccessToken()

  if (accessToken) {
    props.onLogin(accessToken)
    return null
  }

  return (
    <div className='header-container'>
      <div className='lift-intro-container'>
        <span className='login-lift-motto'>search your favorite artists.</span>
        <span className='login-lift-motto'>access a curated playlist.</span>
        <span className='login-lift-motto'>listen to uplifting music.</span>
        <span className='login-lift-title'>welcome to lift.</span>
      </div>
      <Button variant='contained' color='primary' className='login-button' onClick={handleLogin}>
        Login with Spotify
      </Button>
    </div>
  )
}

interface LoginProps {
  onLogin: (accessToken: string) => void
}
