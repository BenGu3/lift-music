import { throttle } from 'lodash'
import { Search } from '@material-ui/icons'
import { components } from 'react-select'
import AsyncSelect from 'react-select/lib/Async'
import React, { Component } from 'react'
import SpotifyApi from 'spotify-web-api-js'


import './index.css'
import LiftLogin from './login'
import ProgressDialog from './progress-dialog'

class Main extends Component {

  spotifyApi = new SpotifyApi()
  highValenceTracks = []

  constructor(props) {
    super(props)
    this.handleLogin = this.handleLogin.bind(this)
    this.handleQueryChange = this.handleQueryChange.bind(this)
    this.queryArtist = throttle(this.queryArtist.bind(this), 250)

    this.state = {
      isLoggedIn: false,
      isProgressDialogOpen: false
    }
  }

  DropdownIndicator = (props) => {
    return components.DropdownIndicator && (
      <components.DropdownIndicator {...props}>
        <Search/>
      </components.DropdownIndicator>
    )
  }

  handleLogin(accessToken) {
    this.spotifyApi.setAccessToken(accessToken)
    this.setState({ isLoggedIn: true })
  }

  addHighValenceTracksFromAlbum = async (album) => {
    const artistTracks = await this.spotifyApi.getAlbumTracks(album.id)
    await artistTracks.items.forEach(this.addHighValenceTracks)
  }

  addHighValenceTracks = async (track) => {
    const trackAudioFeatures = await this.spotifyApi.getAudioFeaturesForTrack(track.id)
    if (trackAudioFeatures.valence > .6) {
      this.highValenceTracks.push(track)
    }
    console.log('this.highValenceTracks:', this.highValenceTracks)
  }

  async handleQueryChange(selectedArtist, action) {
    if (action.action === 'select-option') {
      this.setState({ isProgressDialogOpen: true })
      const artistAlbums = await this.spotifyApi.getArtistAlbums(selectedArtist.id, { limit: 50 })
      let i = 0
      await this.addHighValenceTracksFromAlbum(artistAlbums.items[i])
      while (this.highValenceTracks.length < 20 && i < artistAlbums.items.length) {
        await this.addHighValenceTracksFromAlbum(artistAlbums.items[i])
        await new Promise(r => setTimeout(r, 500))
        i++
      }
      this.setState({ isProgressDialogOpen: false })
    }
  }

  async queryArtist(query) {
    const queryResults = await this.spotifyApi.searchArtists(query)
    return new Promise(
      resolve => resolve(queryResults.artists.items),
    )
  }

  renderLift() {
    return (
      <div>
        <ProgressDialog isOpen={this.state.isProgressDialogOpen}/>
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
          />

          <div className="track-list">
            <ul>
              {this.highValenceTracks.map(track => {
                console.log('track:', track)
                return (
                  <li>{track.name}</li>
                )
              })}
            </ul>
          </div>
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
