import { FC } from 'react'
import { Typography } from '@mui/material'

import { css } from '../../../styled-system/css'

type TrackHeaderProps = {
  album?: SpotifyApi.AlbumObjectFull
}

const TrackHeader: FC<TrackHeaderProps> = props => {
  const { album } = props

  const renderTrackHeader = (album: SpotifyApi.AlbumObjectFull) => {
    const { url: albumImage, width: albumImageWidth, height: albumImageHeight } = album.images[1]

    return (
      <>
        <img src={albumImage} width={albumImageWidth} height={albumImageHeight} alt={album.name}/>
        <div className={albumInfoStyles}>
          <Typography variant="h3" className={titleContainerStyles}>{album.name}</Typography>
          <Typography variant="subtitle1">{album.artists[0].name}</Typography>
        </div>
      </>
    )
  }

  const renderNoTrack = () => <span>No album 😭</span>

  return (
    <div className={containerStyles}>
      {
        album
          ? renderTrackHeader(album)
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

const albumInfoStyles = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',

  md: {
    alignItems: 'start',
    marginLeft: '20px'
  },
})

const titleContainerStyles = css({
  padding: '8px 0',
  textAlign: 'center',

  md: {
    textAlign: 'unset'
  }
})
