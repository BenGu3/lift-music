import { FC } from 'react'
import { Card, CardActionArea, CardContent, CardMedia, Typography, Unstable_Grid2 as Grid } from '@mui/material'
import { Link } from 'react-router-dom'

import { css } from '../../../styled-system/css'

type ArtistContentProps = {
  artistAlbums?: SpotifyApi.AlbumObjectSimplified[]
}

const ArtistContent: FC<ArtistContentProps> = props => {
  const { artistAlbums } = props

  const renderAlbum = (album: SpotifyApi.AlbumObjectSimplified) => {
    const { url: albumImage } = album.images[1]

    return (
      <Grid xs={6} sm={3} md={2}>
        <Card sx={{ background: 'rgba(18, 94 ,200, 0.3)' }}>
          <CardActionArea component={Link} to={`/album/${album.id}`}>
            <CardMedia
              component="img"
              image={albumImage}
              className={albumImageStyles}
            />
            <CardContent>
              <Typography variant="subtitle1" component="div" className={albumNameStyles}>
                {album.name}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
    )
  }

  const renderArtistAlbums = (artistAlbums: SpotifyApi.AlbumObjectSimplified[]) => {
    return (
      <Grid container spacing={2}>
        {artistAlbums.map(renderAlbum)}
      </Grid>
    )
  }

  const renderNoAlbums = () => <span>No albums 😭</span>

  return (
    <div className={containerStyles}>
      {
        artistAlbums
          ? renderArtistAlbums(artistAlbums)
          : renderNoAlbums()
      }
    </div>
  )
}

export default ArtistContent

const containerStyles = css({
  padding: '32px 40px',
  background: 'linear-gradient(rgba(0, 0, 0, .6) 0, #121212 100%)',
})

const albumImageStyles = css({
  padding: '16px 16px 0 16px',
})

const albumNameStyles = css({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})
