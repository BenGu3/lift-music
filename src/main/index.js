import { Search } from '@material-ui/icons'
import axios from 'axios'
import { shuffle } from 'lodash'
import React, { Component } from 'react'
import { components } from 'react-select'
import AsyncSelect from 'react-select/async'
import SpotifyPlayer from 'react-spotify-player'
import SpotifyApi from 'spotify-web-api-js'

import PlaylistList from './playlist-list'
import Login from './login'
import NoTracksDialog from './no-tracks-dialog'
import ProgressDialog from './progress-dialog'

import './index.css'

function DropdownIndicator(props) {
  return components.DropdownIndicator && (
    <components.DropdownIndicator {...props}>
      <Search />
    </components.DropdownIndicator>
  )
}

export default class Main extends Component {
  constructor(props) {
    super(props)
    this.state = {
      spotifyApi: new SpotifyApi(),
      artistHasNoHighValenceTracks: false,
      isCreatingPlaylist: false,
      isLoggedIn: false,
      isNoHighValenceTracksDialogOpen: false,
      isProgressDialogOpen: false,
      highValenceTracks: [],
      me: {},
      playlists: [],
      loadProgress: 0,
      selectedPlaylist: {}
    }
  }

  handleLogin = async accessToken => {
    this.state.spotifyApi.setAccessToken(accessToken)
    axios.defaults.headers.common.Authorization = 'Bearer ' + accessToken
    await this.updateStateUserData()
  }

  updateStateUserData = async () => {
    const me = await this.state.spotifyApi.getMe()
    const playlists = await this.getUsersLiftPlaylists()
    this.setState({ isLoggedIn: true, me, playlists, selectedPlaylist: playlists[0] || {} })
  }

  getUsersLiftPlaylists = async () => {
    const myPlaylistsResponse = await this.state.spotifyApi.getUserPlaylists(this.state.me.id)
    const myPlaylists = myPlaylistsResponse.items
    return myPlaylists.filter(playlist => playlist.name.includes('(lift)'))
  }

  addHighValenceTracksFromArtist = async artist => {
    const artistAlbums = await this.state.spotifyApi.getArtistAlbums(artist.id, { limit: 5 })
    let i = 0
    while (this.state.highValenceTracks.length < 12 && i < artistAlbums.items.length) {
      await this.addHighValenceTracksFromAlbum(artistAlbums.items[i], this.state.highValenceTracks, 12)
      i++
    }
    this.setState({ artistHasNoHighValenceTracks: !this.state.highValenceTracks.length })
  }

  addHighValenceTracksFromRelatedArtists = async artist => {
    let highValenceTracksFromRelatedArtists = []
    const relatedArtistAlbums = await this.state.spotifyApi.getArtistAlbums(artist.id, { limit: 3 })
    let i = 0
    while (highValenceTracksFromRelatedArtists.length < 3 && i < relatedArtistAlbums.items.length) {
      await this.addHighValenceTracksFromAlbum(relatedArtistAlbums.items[i], highValenceTracksFromRelatedArtists, 3)
      i++
    }
    this.state.highValenceTracks = this.state.highValenceTracks.concat(highValenceTracksFromRelatedArtists.slice(0, 3))
    highValenceTracksFromRelatedArtists = []
  }

  addHighValenceTracks = async (track, highValenceTrackList, maxListSize) => {
    if (highValenceTrackList.length > maxListSize) {
      return
    }
    if (highValenceTrackList.find(highValenceTrack => highValenceTrack.name === track.name)) {
      return
    }
    const trackAudioFeatures = await this.state.spotifyApi.getAudioFeaturesForTrack(track.id)
    if (trackAudioFeatures.valence > 0.6) {
      highValenceTrackList.push(track)
    }
    this.setState({ loadProgress: this.state.highValenceTracks.length * 100 / 24 })
  }

  addHighValenceTracksFromAlbum = async (album, highValenceTrackList, maxListSize) => {
    const artistTracks = await this.state.spotifyApi.getAlbumTracks(album.id)
    if (artistTracks.items.length > 16)
      return
    await Promise.all(artistTracks.items.slice(0, artistTracks.items.length / 4).map(async track => this.addHighValenceTracks(track, highValenceTrackList, maxListSize)))
    await Promise.all(artistTracks.items.slice(artistTracks.items.length / 4, artistTracks.items.length / 2).map(async track => this.addHighValenceTracks(track, highValenceTrackList, maxListSize)))
    await Promise.all(artistTracks.items.slice(artistTracks.items.length / 2, artistTracks.items.length * 3 / 4).map(async track => this.addHighValenceTracks(track, highValenceTrackList, maxListSize)))
    await Promise.all(artistTracks.items.slice(artistTracks.items.length * 3 / 4, artistTracks.items.length).map(async track => this.addHighValenceTracks(track, highValenceTrackList, maxListSize)))
  }

  createPlaylistAndAddSongs = async artistName => {
    const liftPlaylistResponse = await axios.post(
      'https://api.spotify.com/v1/users/' + this.state.me.id + '/playlists',
      { name: '(lift) ' + artistName }
    )
    // const liftPlaylist = await this.state.spotifyApi.createPlaylist({ name: '(lift) ' + artistName })
    const liftPlaylist = liftPlaylistResponse.data

    this.state.highValenceTracks = shuffle(this.state.highValenceTracks)

    await this.state.spotifyApi.addTracksToPlaylist(
      liftPlaylist.id,
      this.state.highValenceTracks.map(track => track.uri)
    )
    this.state.highValenceTracks = []
    await this.updateStateUserData()
  }

  createLiftPlaylist = async artist => {
    const relatedArtists = await this.state.spotifyApi.getArtistRelatedArtists(artist.id)
    // console.time('Artist time')
    await this.addHighValenceTracksFromArtist(artist)
    // console.timeEnd('Artist time')
    if (this.state.artistHasNoHighValenceTracks) {
      this.setState({ artistHasNoHighValenceTracks: false, isNoHighValenceTracksDialogOpen: true })
      return
    }
    // console.time('Related artists time')
    await this.addHighValenceTracksFromRelatedArtists(relatedArtists.artists[0])
    await this.addHighValenceTracksFromRelatedArtists(relatedArtists.artists[1])
    await this.addHighValenceTracksFromRelatedArtists(relatedArtists.artists[2])
    await this.addHighValenceTracksFromRelatedArtists(relatedArtists.artists[3])
    // console.timeEnd('Related artists time')
    await this.createPlaylistAndAddSongs(artist.name)
  }

  handleQueryChange = async (selectedArtist, action) => {
    if (action.action === 'select-option') {
      this.setState({ isProgressDialogOpen: true })
      // console.time('Total time')
      await this.createLiftPlaylist(selectedArtist)
      // console.timeEnd('Total time')
      this.setState({ isProgressDialogOpen: false, loadProgress: 0 })
    }
  }

  queryArtist = async query => {
    const queryResults = await this.state.spotifyApi.searchArtists(query)
    return new Promise(
      resolve => resolve(queryResults.artists.items)
    )
  }

  handleCloseNoTrackDialog = () => this.setState({ isNoHighValenceTracksDialogOpen: false })

  handlePlaylistClick = selectedPlaylist => this.setState({ selectedPlaylist })

  handleDeletePlaylist = playlistId => {
    this.state.spotifyApi.unfollowPlaylist(playlistId)
    this.setState((prevState) => {
      const updatedPlaylist = prevState.playlists.filter(playlist => playlist.id !== playlistId)
      return {
        playlists: updatedPlaylist,
        selectedPlaylist: updatedPlaylist[0]
      }
    })
  }

  getNoOptionsMessage = inputValue => 'No artists found'

  getOptionLabel = option => option.name

  getOptionValue = option => option

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
