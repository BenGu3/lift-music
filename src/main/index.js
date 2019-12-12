import axios from 'axios'
import { shuffle } from 'lodash'
import { Search } from '@material-ui/icons'
import { components } from 'react-select'
import AsyncSelect from 'react-select/async'
import React, { Component } from 'react'
import SpotifyApi from 'spotify-web-api-js'
import SpotifyPlayer from 'react-spotify-player'

import './index.css'
import LiftLogin from './login'
import LiftPlaylistList from './lift-playlist-list'
import ProgressDialog from './progress-dialog'
import NoTracksDialog from './no-tracks-dialog';

class Main extends Component {

  constructor(props) {
    super(props)
    this.handleLogin = this.handleLogin.bind(this)
    this.updateStateUserData = this.updateStateUserData.bind(this)
    this.getUsersLiftPlaylists = this.getUsersLiftPlaylists.bind(this)
    this.addHighValenceTracksFromAlbum = this.addHighValenceTracksFromAlbum.bind(this)
    this.createLiftPlaylist = this.createLiftPlaylist.bind(this)
    this.handleQueryChange = this.handleQueryChange.bind(this)
    this.queryArtist = this.queryArtist.bind(this)
    this.handlePlaylistClick = this.handlePlaylistClick.bind(this)
    this.handleDeletePlaylist = this.handleDeletePlaylist.bind(this)

    this.state = {
      spotifyApi: new SpotifyApi(),
      artistHasNoHighValenceTracks: false,
      isCreatingPlaylist: false,
      isLoggedIn: false,
      isNoHighValenceTracksDialogOpen: false,
      isProgressDialogOpen: false,
      highValenceTracks: [],
      me: {},
      liftPlaylists: [],
      loadProgress: 0,
      selectedPlaylist: {},
    }
  }

  DropdownIndicator(props) {
    return components.DropdownIndicator && (
      <components.DropdownIndicator {...props}>
        <Search/>
      </components.DropdownIndicator>
    )
  }

  async handleLogin(accessToken) {
    this.state.spotifyApi.setAccessToken(accessToken)
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken;
    await this.updateStateUserData()
  }

  async updateStateUserData() {
    const me = await this.state.spotifyApi.getMe()
    const liftPlaylists = await this.getUsersLiftPlaylists()
    this.setState({ isLoggedIn: true, me, liftPlaylists, selectedPlaylist: liftPlaylists[0] || {} })
  }

  async getUsersLiftPlaylists() {
    const myPlaylistsResponse = await this.state.spotifyApi.getUserPlaylists(this.state.me.id)
    const myPlaylists = myPlaylistsResponse.items
    return myPlaylists.filter(playlist => playlist.name.includes('(lift)'))
  }

  async addHighValenceTracksFromArtist(artist) {
    const artistAlbums = await this.state.spotifyApi.getArtistAlbums(artist.id, { limit: 5 })
    let i = 0
    while (this.state.highValenceTracks.length < 12 && i < artistAlbums.items.length) {
      await this.addHighValenceTracksFromAlbum(artistAlbums.items[i], this.state.highValenceTracks, 12)
      i++
    }
    this.setState({ artistHasNoHighValenceTracks: !this.state.highValenceTracks.length })
  }

  async addHighValenceTracksFromRelatedArtists(artist) {
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

  async addHighValenceTracks(track, highValenceTrackList, maxListSize) {
    if (highValenceTrackList.length > maxListSize) {
      return
    }
    if (highValenceTrackList.find(highValenceTrack => highValenceTrack.name === track.name)) {
      return
    }
    const trackAudioFeatures = await this.state.spotifyApi.getAudioFeaturesForTrack(track.id)
    if (trackAudioFeatures.valence > .6) {
      highValenceTrackList.push(track)
    }
    this.setState({ loadProgress: this.state.highValenceTracks.length * 100 / 24 })
  }

  async addHighValenceTracksFromAlbum(album, highValenceTrackList, maxListSize) {
    const artistTracks = await this.state.spotifyApi.getAlbumTracks(album.id)
    if (artistTracks.items.length > 16)
      return
    await Promise.all(artistTracks.items.slice(0, artistTracks.items.length / 4).map(async track => this.addHighValenceTracks(track, highValenceTrackList, maxListSize)))
    await Promise.all(artistTracks.items.slice(artistTracks.items.length / 4, artistTracks.items.length / 2).map(async track => this.addHighValenceTracks(track, highValenceTrackList, maxListSize)))
    await Promise.all(artistTracks.items.slice(artistTracks.items.length / 2, artistTracks.items.length * 3 / 4).map(async track => this.addHighValenceTracks(track, highValenceTrackList, maxListSize)))
    await Promise.all(artistTracks.items.slice(artistTracks.items.length * 3 / 4, artistTracks.items.length).map(async track => this.addHighValenceTracks(track, highValenceTrackList, maxListSize)))
  }

  async createPlaylistAndAddSongs(artistName) {
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

  async createLiftPlaylist(artist) {
    const relatedArtists = await this.state.spotifyApi.getArtistRelatedArtists(artist.id)
    console.time('Artist time')
    await this.addHighValenceTracksFromArtist(artist)
    console.timeEnd('Artist time')
    if (this.state.artistHasNoHighValenceTracks) {
      this.setState({ artistHasNoHighValenceTracks: false, isNoHighValenceTracksDialogOpen: true })
      return
    }
    console.time('Related artists time')
    await this.addHighValenceTracksFromRelatedArtists(relatedArtists.artists[0])
    await this.addHighValenceTracksFromRelatedArtists(relatedArtists.artists[1])
    await this.addHighValenceTracksFromRelatedArtists(relatedArtists.artists[2])
    await this.addHighValenceTracksFromRelatedArtists(relatedArtists.artists[3])
    console.timeEnd('Related artists time')
    await this.createPlaylistAndAddSongs(artist.name)
  }

  async handleQueryChange(selectedArtist, action) {
    if (action.action === 'select-option') {
      this.setState({ isProgressDialogOpen: true })
      console.time('Total time')
      await this.createLiftPlaylist(selectedArtist)
      console.timeEnd('Total time')
      this.setState({ isProgressDialogOpen: false, loadProgress: 0 })
    }
  }

  async queryArtist(query) {
    const queryResults = await this.state.spotifyApi.searchArtists(query)
    return new Promise(
      resolve => resolve(queryResults.artists.items),
    )
  }

  handlePlaylistClick(selectedPlaylist) {
    this.setState({ selectedPlaylist })
  }

  handleDeletePlaylist(playlistId) {
    this.state.spotifyApi.unfollowPlaylist(playlistId)
    this.setState((prevState) => {
      const updatedPlaylist = prevState.liftPlaylists.filter(playlist => playlist.id !== playlistId)
      return {
        liftPlaylists: updatedPlaylist,
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
        <NoTracksDialog isOpen={this.state.isNoHighValenceTracksDialogOpen}
                        onClose={() => this.setState({ isNoHighValenceTracksDialogOpen: false })}/>
        <LiftPlaylistList list={this.state.liftPlaylists} onPlaylistClick={this.handlePlaylistClick}
                          onDeletePlaylist={this.handleDeletePlaylist}/>
        <div className="lift-container">
          <AsyncSelect
            placeholder="Search your favorite artist"
            className="search-bar"
            components={{ DropdownIndicator: DropdownIndicator }}
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
