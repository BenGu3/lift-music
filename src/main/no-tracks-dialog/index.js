import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core'
import React, { Component } from 'react'
import { func } from 'prop-types'

import './index.css'

export default class NoTracksDialog extends Component {
  static propTypes = {
    isOpen: func,
    onClose: func
  }

  render() {
    return (
      <Dialog open={this.props.isOpen} onClose={this.props.onClose} className="no-tracks-dialog">
        <DialogTitle>Whoops!</DialogTitle>
        <DialogContent style={{ textAlign: 'center' }}>
          It seems your artist had no high valence tracks, so we didn't create a playlist for you. Maybe look in to some happier
          sounding tunes!
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.onClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}
