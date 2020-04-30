import { Divider, IconButton, List, ListItem, ListItemSecondaryAction } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import React, { Component } from 'react'
import { array, func } from 'prop-types'

import './index.css'

export default class PlaylistList extends Component {
  static propTypes = {
    playlists: array.isRequired,
    onPlaylistClick: func.isRequired,
    onDeletePlaylist: func.isRequired
  }

  renderPlaylists() {
    return this.props.playlists.map((playlist, index) => {
      return (
        <div key={playlist.name}>
          <ListItem
            button
            className="playlist-button"
            onClick={() => this.props.onPlaylistClick(playlist)}
            key={playlist.name}
          >
            {playlist.name.slice(7)}
            <ListItemSecondaryAction>
              <IconButton aria-label="Delete" onClick={() => this.props.onDeletePlaylist(playlist.id)}>
                <DeleteIcon color="secondary" />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
          {index < this.props.playlists.length - 1 && (<Divider className="white-divider" />)}
        </div>
      )
    })
  }

  render() {
    return (
      <div className="playlist-list">
        <List>
          <ListItem>
            <div className="header">
              <span className="motto">search.</span>
              <span className="motto">listen.</span>
              <span className="title">lift.</span>
            </div>
          </ListItem>
          {this.renderPlaylists()}
        </List>
      </div>
    )
  }
}
