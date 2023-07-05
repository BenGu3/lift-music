import axios from 'axios'
import * as promise from 'bluebird'
import debounce from 'lodash/debounce'
import find from 'lodash/find'
import shuffle from 'lodash/shuffle'
import { FC, useEffect, useState } from 'react'

import spotifyApi from '../../api/spotify.ts'
import SpotifyPlayer from '../../components/player'
import PlaylistList from '../../components/playlist-list'
import ProgressDialog from '../../components/progress-dialog'
import ArtistSearch from '../../components/artist-search'

import './index.css'

const VALENCE_THRESHOLD = 0.6
const MAX_PLAYLIST_LENGTH = 30

type Props = {
  me: SpotifyApi.CurrentUsersProfileResponse
}

const Home: FC<Props> = props => {
  const [playlists, setPlaylists] = useState<SpotifyApi.PlaylistObjectSimplified[]>([])
  const [selectedPlaylist, setSelectedPlaylist] = useState<SpotifyApi.PlaylistObjectSimplified | null>(null)
  const [loadProgress, setLoadProgress] = useState(0)
  const [isProgressDialogOpen, setIsProgressDialogOpen] = useState(false)

  useEffect(() => {
    fetchUserLiftPlaylists()
  }, [])

  const fetchUserLiftPlaylists = async (): Promise<void> => {
    const { items: myPlaylists } = await spotifyApi.getUserPlaylists(props.me.id)
    const playlists = myPlaylists.filter((playlist: SpotifyApi.PlaylistObjectSimplified) => playlist.name.includes('(lift)'))
    setPlaylists(playlists)
    setSelectedPlaylist(playlists[0] || null)
  }

  const createLiftPlaylist = async (artist: SpotifyApi.ArtistObjectFull): Promise<void> => {
    const highValenceTracks: SpotifyApi.TrackObjectSimplified[] = []
    await addHighValenceTracksForArtist({ artist, highValenceTracks, isRelatedArtist: false })

    const { artists: relatedArtists } = await spotifyApi.getArtistRelatedArtists(artist.id)
    let artistIndex = 0
    while (highValenceTracks.length < MAX_PLAYLIST_LENGTH) {
      await addHighValenceTracksForArtist({ artist: relatedArtists[artistIndex], highValenceTracks, isRelatedArtist: true })
      artistIndex++
    }

    await createPlaylist(artist.name, highValenceTracks)
  }
  const addHighValenceTracksForArtist = async (params: { artist: SpotifyApi.ArtistObjectFull, highValenceTracks: SpotifyApi.TrackObjectSimplified[], isRelatedArtist: boolean }): Promise<void> => {
    const { artist, highValenceTracks, isRelatedArtist } = params
    if (highValenceTracks.length > MAX_PLAYLIST_LENGTH) return

    const { items: albums } = await spotifyApi.getArtistAlbums(artist.id, { limit: isRelatedArtist ? 3 : 5 })
    await promise.each(albums, async (album: SpotifyApi.AlbumObjectSimplified) => {
      if (highValenceTracks.length > MAX_PLAYLIST_LENGTH) return

      const { items: albumTracks } = await spotifyApi.getAlbumTracks(album.id)
      const { audio_features: audioFeatures } = await spotifyApi.getAudioFeaturesForTracks(albumTracks.map((track: SpotifyApi.TrackObjectSimplified) => track.id))

      const highValenceTracksForAlbum = albumTracks.filter((track: SpotifyApi.TrackObjectSimplified, index: number) => {
        if (highValenceTracks.length > MAX_PLAYLIST_LENGTH) return false
        if (find(highValenceTracks, highValenceTrack => highValenceTrack.name === track.name)) return false

        return audioFeatures[index].valence >= VALENCE_THRESHOLD
      })
      highValenceTracks.push(...highValenceTracksForAlbum)

      const progress = highValenceTracks.length * 100 / 30
      setLoadProgress(progress > 100 ? 100 : progress)
    })
  }
  const createPlaylist = async (artistName: string, tracks: SpotifyApi.TrackObjectSimplified[]): Promise<void> => {
    const { data: liftPlaylist } = await axios.post(
      'https://api.spotify.com/v1/users/' + props.me.id + '/playlists',
      { name: '(lift) ' + artistName }
    )
    // const liftPlaylist = await spotifyApi.createPlaylist({ name: '(lift) ' + artistName })

    await spotifyApi.addTracksToPlaylist(liftPlaylist.id, shuffle(tracks.map(track => track.uri)))
    await fetchUserLiftPlaylists()
  }

  const queryArtist = async (query: string): Promise<SpotifyApi.ArtistObjectFull[]> => {
    const queryResults = await spotifyApi.searchArtists(query)
    return queryResults.artists.items
  }

  const debouncedQueryArtist = debounce((searchTerm, callback) => {
    queryArtist(searchTerm)
      .then((result) => callback(result))
      .catch((error) => callback(error))
  }, 350)

  const handleQueryChange = async (selectedArtist: SpotifyApi.ArtistObjectFull) => {
    setIsProgressDialogOpen(true)
    await createLiftPlaylist(selectedArtist)
    setIsProgressDialogOpen(false)
    setLoadProgress(0)
  }
  const handlePlaylistClick = (selectedPlaylist: SpotifyApi.PlaylistObjectSimplified): void => setSelectedPlaylist(selectedPlaylist)
  const handleDeletePlaylist = (playlistId: string): void => {
    spotifyApi.unfollowPlaylist(playlistId)
    const updatedPlaylists = playlists.filter(playlist => playlist.id !== playlistId)
    setPlaylists(updatedPlaylists)
    setSelectedPlaylist(updatedPlaylists[0] || null)
  }

  return (
    <div className='main-container'>
      <ProgressDialog isOpen={isProgressDialogOpen} progress={loadProgress} />
      <PlaylistList
        playlists={playlists}
        onPlaylistClick={handlePlaylistClick}
        onDeletePlaylist={handleDeletePlaylist}
      />
      <div className='container'>
        <ArtistSearch onChange={handleQueryChange} loadArtists={debouncedQueryArtist}/>
        <SpotifyPlayer uri={selectedPlaylist?.uri} />
      </div>
    </div>
  )
}

export default Home
