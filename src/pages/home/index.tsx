import axios from 'axios'
import * as promise from 'bluebird'
import { find, shuffle } from 'lodash'
import * as React from 'react'
import * as SpotifyWebApiJs from 'spotify-web-api-js'

import NoTracksDialog from '../../components/no-tracks-dialog'
import SpotifyPlayer from '../../components/player'
import PlaylistList from '../../components/playlist-list'
import ProgressDialog from '../../components/progress-dialog'
import ArtistSearch from '../../components/artist-search'

import './index.css'

const VALENCE_THRESHOLD = 0.6
const MAX_PLAYLIST_LENGTH = 30

interface AppProps {
  accessToken: string
}

interface AppState {
  isCreatingPlaylist: boolean,
  isNoHighValenceTracksDialogOpen: boolean,
  isProgressDialogOpen: boolean,
  me: SpotifyApi.CurrentUsersProfileResponse,
  playlists: SpotifyApi.PlaylistObjectSimplified[],
  loadProgress: number,
  selectedPlaylist: SpotifyApi.PlaylistObjectSimplified
}

export default class extends React.Component<AppProps, AppState> {
  spotifyApi: SpotifyWebApiJs.SpotifyWebApiJs = null

  constructor(props: AppProps) {
    super(props)
    this.spotifyApi = new SpotifyWebApiJs()
    this.spotifyApi.setAccessToken(props.accessToken)
    axios.defaults.headers.common.Authorization = 'Bearer ' + props.accessToken

    this.state = {
      isCreatingPlaylist: false,
      isNoHighValenceTracksDialogOpen: false,
      isProgressDialogOpen: false,
      me: null,
      playlists: [],
      loadProgress: 0,
      selectedPlaylist: null
    }
  }

  async componentDidMount() {
    await this.fetchUserData()
  }

  fetchUserData = async (): Promise<void> => {
    await this.fetchMe()
    await this.fetchUserLiftPlaylists()
  }
  fetchMe = async (): Promise<void> => {
    const me = await this.spotifyApi.getMe()
    this.setState({ me })
  }
  fetchUserLiftPlaylists = async (): Promise<void> => {
    const { items: myPlaylists } = await this.spotifyApi.getUserPlaylists(this.state.me.id)
    const playlists = myPlaylists.filter((playlist: SpotifyApi.PlaylistObjectSimplified) => playlist.name.includes('(lift)'))
    this.setState({ playlists, selectedPlaylist: playlists[0] || null })
  }

  createLiftPlaylist = async (artist: SpotifyApi.ArtistObjectFull): Promise<void> => {
    const highValenceTracks: SpotifyApi.TrackObjectSimplified[] = []
    await this.addHighValenceTracksForArtist({ artist, highValenceTracks, isRelatedArtist: false })

    const { artists: relatedArtists } = await this.spotifyApi.getArtistRelatedArtists(artist.id)
    let artistIndex = 0
    while (highValenceTracks.length < MAX_PLAYLIST_LENGTH) {
      await this.addHighValenceTracksForArtist({ artist: relatedArtists[artistIndex], highValenceTracks, isRelatedArtist: true })
      artistIndex++
    }

    await this.createPlaylist(artist.name, highValenceTracks)
  }
  addHighValenceTracksForArtist = async (params: { artist: SpotifyApi.ArtistObjectFull, highValenceTracks: SpotifyApi.TrackObjectSimplified[], isRelatedArtist: boolean }): Promise<void> => {
    const { artist, highValenceTracks, isRelatedArtist } = params
    if (highValenceTracks.length > MAX_PLAYLIST_LENGTH) return

    const { items: albums } = await this.spotifyApi.getArtistAlbums(artist.id, { limit: isRelatedArtist ? 3 : 5 })
    await promise.each(albums, async (album: SpotifyApi.AlbumObjectSimplified) => {
      if (highValenceTracks.length > MAX_PLAYLIST_LENGTH) return

      const { items: albumTracks } = await this.spotifyApi.getAlbumTracks(album.id)
      const { audio_features: audioFeatures } = await this.spotifyApi.getAudioFeaturesForTracks(albumTracks.map((track: SpotifyApi.TrackObjectSimplified) => track.id))

      const highValenceTracksForAlbum = albumTracks.filter((track: SpotifyApi.TrackObjectSimplified, index: number) => {
        if (highValenceTracks.length > MAX_PLAYLIST_LENGTH) return false
        if (find(highValenceTracks, highValenceTrack => highValenceTrack.name === track.name)) return false

        return audioFeatures[index].valence >= VALENCE_THRESHOLD
      })
      highValenceTracks.push(...highValenceTracksForAlbum)

      const progress = highValenceTracks.length * 100 / 30
      this.setState({ loadProgress: progress > 100 ? 100 : progress })
    })
  }
  createPlaylist = async (artistName: string, tracks: SpotifyApi.TrackObjectSimplified[]): Promise<void> => {
    const { data: liftPlaylist } = await axios.post(
      'https://api.spotify.com/v1/users/' + this.state.me.id + '/playlists',
      { name: '(lift) ' + artistName }
    )
    // const liftPlaylist = await this.spotifyApi.createPlaylist({ name: '(lift) ' + artistName })

    await this.spotifyApi.addTracksToPlaylist(liftPlaylist.id, shuffle(tracks.map(track => track.uri)))
    await this.fetchUserData()
  }

  queryArtist = async (query: string): Promise<SpotifyApi.ArtistObjectFull[]> => {
    const queryResults = await this.spotifyApi.searchArtists(query)
    return queryResults.artists.items
  }

  handleQueryChange = async (selectedArtist: SpotifyApi.ArtistObjectFull) => {
    this.setState({ isProgressDialogOpen: true })
    await this.createLiftPlaylist(selectedArtist)
    this.setState({ isProgressDialogOpen: false, loadProgress: 0 })
  }
  handleCloseNoTrackDialog = () => this.setState({ isNoHighValenceTracksDialogOpen: false })
  handlePlaylistClick = (selectedPlaylist: SpotifyApi.PlaylistObjectSimplified): void => this.setState({ selectedPlaylist })
  handleDeletePlaylist = (playlistId: string): void => {
    this.spotifyApi.unfollowPlaylist(playlistId)
    this.setState(prevState => {
      const updatedPlaylist = prevState.playlists.filter(playlist => playlist.id !== playlistId)
      return {
        playlists: updatedPlaylist,
        selectedPlaylist: updatedPlaylist[0]
      }
    })
  }

  renderSpotifyPlayer() {
    return (
      <div className='spotify-player'>
        <SpotifyPlayer uri={this.state.selectedPlaylist.uri} />
      </div>
    )
  }
  renderNewUserMessage() {
    return (
      <div className='new-user-message-container'>
        <span className='motto'>search your favorite artists.</span>
        <span className='motto'>listen to uplifting music.</span>
        <span className='title'>welcome to lift.</span>
      </div>
    )
  }
  render() {
    return (
      <div className='main-container'>
        <ProgressDialog isOpen={this.state.isProgressDialogOpen} progress={this.state.loadProgress} />
        <NoTracksDialog
          isOpen={this.state.isNoHighValenceTracksDialogOpen}
          onClose={this.handleCloseNoTrackDialog}
        />
        <PlaylistList
          playlists={this.state.playlists}
          onPlaylistClick={this.handlePlaylistClick}
          onDeletePlaylist={this.handleDeletePlaylist}
        />
        <div className='container'>
          <ArtistSearch onChange={this.handleQueryChange} loadArtists={this.queryArtist}/>
          {this.state.playlists.length ? this.renderSpotifyPlayer() : this.renderNewUserMessage()}
        </div>
      </div>
    )
  }
}
