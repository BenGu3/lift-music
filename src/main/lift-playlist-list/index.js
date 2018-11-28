import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import React, { Component } from 'react'

import './index.css'

class LiftPlaylistList extends Component {
  render() {
    return (
      <div className="lift-playlist-list">
        <List>
          <ListItem>
            <div className="lift-header">
              <span className="lift-motto">search.</span>
              <span className="lift-motto">listen.</span>
              <span className="lift-title">lift.</span>
            </div>
          </ListItem>
          {this.props.list.map((playlist, index) => {
            return (
              <div key={playlist.name}>
                <ListItem button
                          className="playlist-button"
                          onClick={() => this.props.onPlaylistClick(playlist)}
                          key={playlist.name}>
                  {playlist.name.slice(7)}
                </ListItem>
                {index < this.props.list.length - 1 && (<Divider className="white-divider"/>)}
              </div>
            )
          })}
        </List>
      </div>
    )
  }
}

export default LiftPlaylistList
