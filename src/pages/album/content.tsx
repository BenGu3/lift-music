import { FC } from 'react'
import { List, ListItem, ListItemButton, ListItemText, Divider } from '@mui/material'
import { Duration } from 'luxon'
import { Link } from 'react-router-dom'

import { css } from '../../../styled-system/css'

type AlbumContentProps = {
  albumTracks?: SpotifyApi.TrackObjectSimplified[]
}

const AlbumContent: FC<AlbumContentProps> = props => {
  const { albumTracks } = props

  const renderTrack = (track: SpotifyApi.TrackObjectSimplified) => {
    const duration = Duration.fromMillis(track.duration_ms).toFormat('mm:ss')

    return (
      <ListItemButton key={track.id} component={Link} to={`/track/${track.id}`}>
        <ListItemText className={trackNumberColumnStyles}>{track.track_number}</ListItemText>
        <ListItemText secondary={track.artists[0].name}>
          <div className={trackNameColumnStyles}>{track.name}</div>
        </ListItemText>
        <ListItemText className={durationColumnStyles}>{duration}</ListItemText>
      </ListItemButton>
    )
  }

  const renderAlbumTracks = (albumTracks: SpotifyApi.TrackObjectSimplified[]) => {
    return (
      <List>
        <ListItem className={headerContainerStyles}>
          <ListItemText className={trackNumberColumnStyles}>#</ListItemText>
          <ListItemText>Title</ListItemText>
          <ListItemText className={durationColumnStyles}>Duration</ListItemText>
        </ListItem>
        <Divider />

        {albumTracks.map(renderTrack)}
      </List>
    )
  }

  const renderNoAudioFeatures = () => <span>No tracks 😭</span>

  return (
    <div className={containerStyles}>
      {
        albumTracks
          ? renderAlbumTracks(albumTracks)
          : renderNoAudioFeatures()
      }
    </div>
  )
}

export default AlbumContent

const containerStyles = css({
  padding: '32px 40px',
  background: 'linear-gradient(rgba(0, 0, 0, .6) 0, #121212 100%)',
})

const headerContainerStyles = css({
  width: '100%',
})

const trackNumberColumnStyles = css({
  width: '32px',
  minWidth: '32px !important',
  maxWidth: '32px',
})

const trackNameColumnStyles = css({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

const durationColumnStyles = css({
  textAlign: 'end',
  hideBelow: 'sm',
})
