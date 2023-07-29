import { FC, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import spotifyApi from '../../api/spotify.ts'
import { css } from '../../../styled-system/css'
import AlbumHeader from './header'
import AlbumContent from './content'

const AlbumPage: FC = () => {
  const { albumId } = useParams()
  const [album, setAlbum] = useState<SpotifyApi.AlbumObjectFull>()
  const [albumTracks, setAlbumTracks] = useState<SpotifyApi.TrackObjectSimplified[]>()

  useEffect(() => {
    if (!albumId) return

    spotifyApi.getAlbum(albumId).then(album => {
      setAlbum(album)
      setAlbumTracks(album.tracks.items)
    })
  }, [albumId])

  return (
    <div className={containerStyles}>
      <AlbumHeader album={album} />
      <AlbumContent albumTracks={albumTracks} />
    </div>
  )
}

export default AlbumPage

const containerStyles = css({
  backgroundColor: '#125ec8'
})
