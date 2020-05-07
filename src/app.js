import { Search } from '@material-ui/icons'
import axios from 'axios'
import { find, shuffle } from 'lodash'
import React, { Component } from 'react'
import { components } from 'react-select'
import AsyncSelect from 'react-select/async'
import SpotifyPlayer from 'react-spotify-player'
import SpotifyApi from 'spotify-web-api-js'
import * as promise from 'bluebird'

import PlaylistList from './components/playlist-list'
import Login from './components/login'
import NoTracksDialog from './components/no-tracks-dialog'
import ProgressDialog from './components/progress-dialog'

import './app.css'

const VALENCE_THRESHOLD = 0.6
const MAX_PLAYLIST_LENGTH = 30

function DropdownIndicator(props) {
  return components.DropdownIndicator && (
    <components.DropdownIndicator {...props}>
      <Search />
    </components.DropdownIndicator>
  )
}

export default class extends Component {
  spotifyApi = null

  constructor(props) {
    super(props)
    this.spotifyApi = new SpotifyApi()
    this.state = {
      isCreatingPlaylist: false,
      isLoggedIn: false,
      isNoHighValenceTracksDialogOpen: false,
      isProgressDialogOpen: false,
      me: null,
      playlists: [],
      loadProgress: 0,
      selectedPlaylist: null
    }
  }

  fetchUserData = async () => {
    await this.fetchMe()
    await this.fetchUserLiftPlaylists()
  }
  fetchMe = async () => {
    const me = await this.spotifyApi.getMe()
    this.setState({ me })
  }
  fetchUserLiftPlaylists = async () => {
    const { items: myPlaylists } = await this.spotifyApi.getUserPlaylists(this.state.me.id)
    const playlists = myPlaylists.filter(playlist => playlist.name.includes('(lift)'))
    this.setState({ playlists, selectedPlaylist: playlists[0] || null })
  }

  createLiftPlaylist = async artist => {
    const highValenceTracks = []
    await this.addHighValenceTracksForArtist({ artist, highValenceTracks, isRelatedArtist: false })

    const { artists: relatedArtists } = await this.spotifyApi.getArtistRelatedArtists(artist.id)
    let artistIndex = 0
    while (highValenceTracks.length < MAX_PLAYLIST_LENGTH) {
      await this.addHighValenceTracksForArtist({ artist: relatedArtists[artistIndex], highValenceTracks, isRelatedArtist: true })
      artistIndex++
    }

    await this.createPlaylist(artist.name, highValenceTracks)
  }
  addHighValenceTracksForArtist = async ({ artist, highValenceTracks, isRelatedArtist }) => {
    if (highValenceTracks.length > MAX_PLAYLIST_LENGTH) return

    const { items: albums } = await this.spotifyApi.getArtistAlbums(artist.id, { limit: isRelatedArtist ? 3 : 5 })
    return promise.each(albums, async album => {
      if (highValenceTracks.length > MAX_PLAYLIST_LENGTH) return

      const { items: albumTracks } = await this.spotifyApi.getAlbumTracks(album.id)
      const { audio_features: audioFeatures } = await this.spotifyApi.getAudioFeaturesForTracks(albumTracks.map(track => track.id))

      const highValenceTracksForAlbum = albumTracks.filter((track, index) => {
        if (highValenceTracks.length > MAX_PLAYLIST_LENGTH) return false
        if (find(highValenceTracks, highValenceTrack => highValenceTrack.name === track.name)) return false

        return audioFeatures[index].valence >= VALENCE_THRESHOLD
      })
      highValenceTracks.push(...highValenceTracksForAlbum)

      const progress = highValenceTracks.length * 100 / 30
      this.setState({ loadProgress: progress > 100 ? 100 : progress })
    })
  }
  createPlaylist = async (artistName, tracks) => {
    const { data: liftPlaylist } = await axios.post(
      'https://api.spotify.com/v1/users/' + this.state.me.id + '/playlists',
      { name: '(lift) ' + artistName }
    )
    // const liftPlaylist = await this.spotifyApi.createPlaylist({ name: '(lift) ' + artistName })

    await this.spotifyApi.addTracksToPlaylist(liftPlaylist.id, shuffle(tracks.map(track => track.uri)))
    await this.fetchUserData()
  }

  getNoOptionsMessage = inputValue => 'No artists found'
  getOptionLabel = option => option.name
  getOptionValue = option => option

  queryArtist = async query => {
    const queryResults = await this.spotifyApi.searchArtists(query)
    return queryResults.artists.items
  }

  handleLogin = async accessToken => {
    this.spotifyApi.setAccessToken(accessToken)
    axios.defaults.headers.common.Authorization = 'Bearer ' + accessToken
    this.setState({ isLoggedIn: true })
    await this.fetchUserData()
  }
  handleQueryChange = async (selectedArtist, action) => {
    if (action.action === 'select-option') {
      this.setState({ isProgressDialogOpen: true })
      await this.createLiftPlaylist(selectedArtist)
      this.setState({ isProgressDialogOpen: false, loadProgress: 0 })
    }
  }
  handleCloseNoTrackDialog = () => this.setState({ isNoHighValenceTracksDialogOpen: false })
  handlePlaylistClick = selectedPlaylist => this.setState({ selectedPlaylist })
  handleDeletePlaylist = playlistId => {
    this.spotifyApi.unfollowPlaylist(playlistId)
    this.setState((prevState) => {
      const updatedPlaylist = prevState.playlists.filter(playlist => playlist.id !== playlistId)
      return {
        playlists: updatedPlaylist,
        selectedPlaylist: updatedPlaylist[0]
      }
    })
  }

  renderSpotifyPlayer() {
    return (
      <div className="spotify-player">
        <SpotifyPlayer
          uri={this.state.selectedPlaylist.uri}
          size={{ width: '100%', height: '700' }}
        />
      </div>
    )
  }
  renderNewUserMessage() {
    return (
      <div className="new-user-message-container">
        <span className="motto">search your favorite artists.</span>
        <span className="motto">listen to uplifting music.</span>
        <span className="title">welcome to lift.</span>
      </div>
    )
  }
  renderLift() {
    return (
      <div>
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
        <div className="container">
          <AsyncSelect
            placeholder="Search your favorite artist"
            className="search-bar"
            components={{ DropdownIndicator }}
            onChange={this.handleQueryChange}
            loadOptions={this.queryArtist}
            isClearable
            noOptionsMessage={this.getNoOptionsMessage}
            getOptionLabel={this.getOptionLabel}
            getOptionValue={this.getOptionValue}
            value=""
          />
          {this.state.playlists.length ? this.renderSpotifyPlayer() : this.renderNewUserMessage()}
        </div>
      </div>
    )
  }
  render() {
    return (
      <div className="main-container">
        {this.state.isLoggedIn ? this.renderLift() : (<Login onLogin={this.handleLogin} />)}
      </div>
    )
  }
}
