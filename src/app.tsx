import { DateTime, Duration } from 'luxon'
import { FC, lazy, useEffect, useState } from 'react'
import SpotifyWebApiJs from 'spotify-web-api-js'

const Login = lazy(() => import('./pages/login'))
const Home = lazy(() => import('./pages/home'))

const spotifyAccessTokenKey = 'lift_spotify_token'
const spotifyAccessTokenExpireTimeKey = 'lift_spotify_token_expire_date'

const parseHashParams = (url: string) => {
  const urlObj = new URL(url)
  const hash = urlObj.hash.slice(1)
  const searchParams = new URLSearchParams(hash)

  return Array.from(searchParams.entries()).reduce<Record<string, string>>((params, [key, value]) => {
    params[key] = value;
    return params;
  }, {});
}

const getAccessToken = () => {
  const hashParams = parseHashParams(window.location.href)
  const expiresInParam = hashParams['expires_in']
  const accessTokenParam = hashParams['access_token']
  if (expiresInParam && accessTokenParam) {
    const duration = Duration.fromMillis(parseInt(expiresInParam) * 1000)
    console.log('duration', duration)
    const expiresTime = DateTime.now().plus(duration).toISO() ?? ''
    console.log('expiresTime', expiresTime)
    window.localStorage.setItem(spotifyAccessTokenExpireTimeKey, expiresTime)
    window.localStorage.setItem(spotifyAccessTokenKey, accessTokenParam)
    window.history.replaceState(null, '', import.meta.env.VITE_REDIRECT_URI)

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

const App: FC = () => {
  const [me, setMe] = useState<SpotifyApi.CurrentUsersProfileResponse | null>(null)
  const accessToken = getAccessToken()

  useEffect(() => {
    if (!accessToken) return

    const spotifyApi = new SpotifyWebApiJs()
    spotifyApi.setAccessToken(accessToken)
    spotifyApi.getMe().then(me => setMe(me))
  }, [accessToken])

  if (!accessToken)
    return <Login/>

  if (!me) {
    return null
  }

  return <Home me={me} accessToken={accessToken}/>
}

export default App
