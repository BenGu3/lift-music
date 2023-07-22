import { createContext, FC, ReactNode, useEffect, useState } from 'react'
import { DateTime, Duration } from 'luxon'
import axios from 'axios'

import { spotifyRedirectUri } from '../constants'
import spotifyApi from '../api/spotify'

const spotifyAccessTokenKey = 'lift_spotify_token'
const spotifyAccessTokenExpireTimeKey = 'lift_spotify_token_expire_date'

const parseHashParams = (url: string) => {
  const urlObj = new URL(url)
  const hash = urlObj.hash.slice(1)
  const searchParams = new URLSearchParams(hash)

  return Array.from(searchParams.entries()).reduce<Record<string, string>>((params, [key, value]) => {
    params[key] = value
    return params
  }, {})
}

const getAccessToken = () => {
  const hashParams = parseHashParams(window.location.href)
  const expiresInParam = hashParams['expires_in']
  const accessTokenParam = hashParams['access_token']
  if (expiresInParam && accessTokenParam) {
    const duration = Duration.fromMillis(parseInt(expiresInParam) * 1000)
    const expiresTime = DateTime.now().plus(duration).toISO() ?? ''
    window.localStorage.setItem(spotifyAccessTokenExpireTimeKey, expiresTime)
    window.localStorage.setItem(spotifyAccessTokenKey, accessTokenParam)
    window.history.replaceState(null, '', spotifyRedirectUri)

    return window.localStorage.getItem(spotifyAccessTokenKey)
  }

  const accessToken = window.localStorage.getItem(spotifyAccessTokenKey)
  const accessTokenExpirationDate = window.localStorage.getItem(spotifyAccessTokenExpireTimeKey)
  const isTokenExpired = accessTokenExpirationDate ? DateTime.now() > DateTime.fromISO(accessTokenExpirationDate) : true

  if (isTokenExpired)
    return null

  if (accessToken && !isTokenExpired)
    return accessToken
}

export const AuthProvider: FC<{ children: ReactNode }> = props => {
  const [user, setUser] = useState<SpotifyApi.CurrentUsersProfileResponse | null>(null)
  const accessToken = getAccessToken()

  useEffect(() => {
    if (!accessToken) return

    axios.defaults.headers.common.Authorization = 'Bearer ' + accessToken
    spotifyApi.setAccessToken(accessToken)
    spotifyApi.getMe().then(me => setUser(me))
  }, [accessToken])

  const context: AuthContextType = {
    user,
    isLoggedIn: !!accessToken
  }

  return (
    <AuthContext.Provider value={context}>
      {props.children}
    </AuthContext.Provider>
  )
}

export const AuthContext = createContext<AuthContextType>({ user: null, isLoggedIn: false })

type AuthContextType = {
  user: SpotifyApi.CurrentUsersProfileResponse | null
  isLoggedIn: boolean
}
