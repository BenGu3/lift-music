import Button from '@mui/material/Button'

import * as css from './index.css'
import { spotifyClientId, spotifyApiScope, spotifyRedirectUri } from '../../constants.ts'

const Login = () => {
  const handleLogin = () => {
    const url = 'https://accounts.spotify.com/authorize?response_type=token'
      + '&client_id=' + encodeURIComponent(spotifyClientId)
      + '&scope=' + encodeURIComponent(spotifyApiScope)
      + '&redirect_uri=' + encodeURIComponent(spotifyRedirectUri)

    window.location.href = url
  }

  return (
    <div className={css.headerContainer}>
      <div className={css.liftIntroContainer}>
        <span className={css.loginLiftMotto}>search your favorite artists.</span>
        <span className={css.loginLiftMotto}>access a curated playlist.</span>
        <span className={css.loginLiftMotto}>listen to uplifting music.</span>
        <span className={css.loginLiftTitle}>welcome to lift.</span>
      </div>
      <Button variant="contained" color="primary" onClick={handleLogin}>
        Login with Spotify
      </Button>
    </div>
  )
}

export default Login
