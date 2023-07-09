import './index.css'
import { SkipNext, SkipPrevious } from '@mui/icons-material'
import { IconButton, Typography } from '@mui/material'

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
      <div className="empty-player-container">
        <span className="empty-player-motto">search your favorite artists.</span>
        <span className="empty-player-motto">listen to uplifting music.</span>
        <span className="empty-player-title">welcome to lift.</span>
      </div>

  const renderSpotifyPlayer = (uri: string) =>
    <div className="player-container">
      <Typography variant="h4">{ props.title }</Typography>
      <div className="player-content">
        <IconButton onClick={props.onPreviousClick} disabled={!props.hasPreviousTracks}><SkipPrevious /></IconButton>
        <iframe
          title="Spotify Player"
          className="player"
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
