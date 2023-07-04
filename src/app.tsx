import { DateTime, Duration } from 'luxon'
import { FC } from 'react'

import Login from './pages/login'
import Home from './pages/home'

const spotifyAccessTokenKey = 'lift_spotify_token'
const spotifyAccessTokenExpireTimeKey = 'lift_spotify_token_expire_date'

function getAccessToken() {
  const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/)
  const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/)
  if (accessTokenMatch && expiresInMatch) {
    window.localStorage.setItem(spotifyAccessTokenKey, accessTokenMatch[1])
    window.localStorage.setItem(spotifyAccessTokenExpireTimeKey, DateTime.now().plus(Duration.fromMillis(parseInt(expiresInMatch[1]) * 1000)).toISO())
    window.history.replaceState(null, '', import.meta.env.VITE_REDIRECT_URI)

    return window.localStorage.getItem(spotifyAccessTokenKey)
  }

  const accessToken = window.localStorage.getItem(spotifyAccessTokenKey)
  const accessTokenExpirationDate = window.localStorage.getItem(spotifyAccessTokenExpireTimeKey)
  const isTokenExpired = DateTime.now() > DateTime.fromISO(accessTokenExpirationDate)

  if (isTokenExpired)
    return null

  if (accessToken && !isTokenExpired)
    return accessToken
}

const App: FC = () => {
  const accessToken = getAccessToken()

  if (!accessToken)
    return <Login />

  return <Home accessToken={accessToken} />
}

export default App
