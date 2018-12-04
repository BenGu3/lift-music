import axios from 'axios'
import { Search } from '@material-ui/icons'
import { components } from 'react-select'
import AsyncSelect from 'react-select/lib/Async'
import React, { Component } from 'react'
import SpotifyApi from 'spotify-web-api-js'
import SpotifyPlayer from 'react-spotify-player'

import './index.css'
import LiftLogin from './login'
import LiftPlaylistList from './lift-playlist-list'
import ProgressDialog from './progress-dialog'

class Main extends Component {

  spotifyApi = new SpotifyApi()
  highValenceTracks = []

  constructor(props) {
    super(props)
    this.handleLogin = this.handleLogin.bind(this)
    this.updateStateUserData = this.updateStateUserData.bind(this)
    this.getUsersLiftPlaylists = this.getUsersLiftPlaylists.bind(this)
    this.addHighValenceTracksFromAlbum = this.addHighValenceTracksFromAlbum.bind(this)
    this.addHighValenceTracks = this.addHighValenceTracks.bind(this)
    this.createLiftPlaylist = this.createLiftPlaylist.bind(this)
    this.handleQueryChange = this.handleQueryChange.bind(this)
    this.queryArtist = this.queryArtist.bind(this)
    this.handlePlaylistClick = this.handlePlaylistClick.bind(this)

    this.state = {
      isCreatingPlaylist: false,
      isLoggedIn: false,
      isProgressDialogOpen: false,
      loadProgress: 0,
      me: {},
      liftPlaylists: [],
      selectedPlaylist: {}
    }
  }

  DropdownIndicator = (props) => {
    return components.DropdownIndicator && (
      <components.DropdownIndicator {...props}>
        <Search/>
      </components.DropdownIndicator>
    )
  }

  async handleLogin(accessToken) {
    this.spotifyApi.setAccessToken(accessToken)
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken;
    await this.updateStateUserData()
  }

  async updateStateUserData() {
    const me = await this.spotifyApi.getMe()
    const liftPlaylists = await this.getUsersLiftPlaylists()
    this.setState({ isLoggedIn: true, me, liftPlaylists, selectedPlaylist: liftPlaylists[0] || {} })
  }

  async getUsersLiftPlaylists() {
    const myPlaylistsResponse = await this.spotifyApi.getUserPlaylists(this.state.me.id)
    const myPlaylists = myPlaylistsResponse.items
    return myPlaylists.filter(playlist => playlist.name.includes('(lift)'))
  }

  async addHighValenceTracksFromAlbum(album) {
    const artistTracks = await this.spotifyApi.getAlbumTracks(album.id)
    await artistTracks.items.forEach(this.addHighValenceTracks)
  }

  async addHighValenceTracks(track) {
    const trackAudioFeatures = await this.spotifyApi.getAudioFeaturesForTrack(track.id)
    if (trackAudioFeatures.valence > .6) {
      this.highValenceTracks.push(track)
    }
    this.setState({ loadProgress: this.highValenceTracks.length * 100 / 10 })
    console.log('this.highValenceTracks:', this.highValenceTracks)
  }

  async createLiftPlaylist(artistName) {
    const liftPlaylistResponse = await axios.post(
      'https://api.spotify.com/v1/users/' + this.state.me.id + '/playlists',
      { name: '(lift) ' + artistName }
    )
    // const liftPlaylist = await this.spotifyApi.createPlaylist({ name: '(lift) ' + artistName })
    const liftPlaylist = liftPlaylistResponse.data

    await this.spotifyApi.addTracksToPlaylist(
      liftPlaylist.id,
      this.highValenceTracks.map(track => track.uri)
    )
    this.highValenceTracks = []
    await this.updateStateUserData()
  }

  async handleQueryChange(selectedArtist, action) {
    if (action.action === 'select-option') {
      this.setState({ isProgressDialogOpen: true })
      const artistAlbums = await this.spotifyApi.getArtistAlbums(selectedArtist.id, { limit: 50 })
      let i = 0
      await this.addHighValenceTracksFromAlbum(artistAlbums.items[i])
      while (this.highValenceTracks.length < 12 && i < artistAlbums.items.length) {
        await this.addHighValenceTracksFromAlbum(artistAlbums.items[i])
        await new Promise(r => setTimeout(r, 500))
        i++
      }
      await this.createLiftPlaylist(selectedArtist.name)
      this.setState({ isProgressDialogOpen: false, loadProgress: 0 })
    }
  }

  async queryArtist(query) {
    const queryResults = await this.spotifyApi.searchArtists(query)
    return new Promise(
      resolve => resolve(queryResults.artists.items),
    )
  }

  handlePlaylistClick(selectedPlaylist) {
    this.setState({ selectedPlaylist })
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
        <span className="lift-motto">search your favorite artists.</span>
        <span className="lift-motto">listen to uplifting music.</span>
        <span className="lift-title">welcome to lift.</span>
      </div>
    )
  }

  renderLift() {
    return (
      <div>
        <ProgressDialog isOpen={this.state.isProgressDialogOpen} progress={this.state.loadProgress}/>
        <LiftPlaylistList list={this.state.liftPlaylists} onPlaylistClick={this.handlePlaylistClick}/>
        <div className="lift-container">
          <AsyncSelect
            placeholder="Search your favorite artist"
            className="search-bar"
            components={{ DropdownIndicator: this.DropdownIndicator }}
            onChange={this.handleQueryChange}
            loadOptions={this.queryArtist}
            isClearable={true}
            noOptionsMessage={(inputValue) => 'No artists found'}
            getOptionLabel={(option) => (option.name)}
            getOptionValue={(option) => (option)}
            value=""
          />
          {this.state.liftPlaylists.length ? this.renderSpotifyPlayer() : this.renderNewUserMessage()}
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className="main-container">
        {this.state.isLoggedIn ? this.renderLift() : (<LiftLogin onLogin={this.handleLogin}/>)}
      </div>
    )
  }
}

export default Main
