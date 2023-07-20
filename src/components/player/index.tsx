import { SkipNext, SkipPrevious } from '@mui/icons-material'
import { IconButton, Typography } from '@mui/material'

import * as css from './index.css'

type SpotifyPlayerProps = {
  title: string | null,
  uri: string | null,
  hasPreviousTracks: boolean
  hasNextTracks: boolean
  onPreviousClick: () => void
  onNextClick: () => void
}

const getUrlFromUri = (uri: string): string => {
  const [_, type, id] = uri.split(':')
  return `https://open.spotify.com/embed/${type}/${id}`
}


const SpotifyPlayer = (props: SpotifyPlayerProps) => {
  const renderEmptyPlayerMessage = () =>
      <div className={css.emptyPlayerContainer}>
        <span className={css.emptyPlayerMotto}>search your favorite artists.</span>
        <span className={css.emptyPlayerMotto}>listen to uplifting music.</span>
        <span className={css.emptyPlayerTitle}>welcome to lift.</span>
      </div>

  const renderSpotifyPlayer = (uri: string) =>
    <div className={css.playerContainer}>
      <Typography variant="h4">{ props.title }</Typography>
      <div className={css.playerContent}>
        <IconButton onClick={props.onPreviousClick} disabled={!props.hasPreviousTracks}><SkipPrevious /></IconButton>
        <iframe
          title="Spotify Player"
          className={css.player}
          src={getUrlFromUri(uri)}
          allow="encrypted-media"
        />
        <IconButton onClick={props.onNextClick} disabled={!props.hasNextTracks}><SkipNext /></IconButton>
      </div>
    </div>

  return props.uri ? renderSpotifyPlayer(props.uri) : renderEmptyPlayerMessage()
}

export default SpotifyPlayer

// TODO add disclaimer when only preview is show
// https://developer.spotify.com/documentation/embeds/tutorials/troubleshooting
