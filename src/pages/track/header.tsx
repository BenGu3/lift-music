import { FC } from 'react'
import { Typography } from '@mui/material'

import { css } from '../../../styled-system/css'

type TrackHeaderProps = {
  track?: SpotifyApi.TrackObjectFull
}

const TrackHeader: FC<TrackHeaderProps> = props => {
  const { track } = props

  const renderTrackHeader = (track: SpotifyApi.TrackObjectFull) => {
    const { url: albumImage, width: albumImageWidth, height: albumImageHeight } = track.album.images[1]

    return (
      <>
        <img src={albumImage} width={albumImageWidth} height={albumImageHeight} alt={track.album.name}/>
        <div className={trackInfoStyles}>
          <Typography variant="h3" className={titleContainerStyles}>{track.name}</Typography>
          <Typography variant="subtitle1">{track.artists[0].name} • {track.album.name}</Typography>
        </div>
      </>
    )
  }

  const renderNoTrack = () => <span>No audio features 😭</span>

  return (
    <div className={containerStyles}>
      {
        track
          ? renderTrackHeader(track)
          : renderNoTrack()
      }
    </div>
  )
}

export default TrackHeader

const containerStyles = css({
  flexDirection: 'column',
  alignItems: 'center',
  padding: '16px',
  display: 'flex',
  background: 'linear-gradient(transparent 0, rgba(0, 0, 0, .5) 100%)',

  md: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: '40px',
  },
})

const trackInfoStyles = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',

  md: {
    alignItems: 'start',
    marginLeft: '20px'
  },
})

const titleContainerStyles = css({
  padding: '8px 0'
})
