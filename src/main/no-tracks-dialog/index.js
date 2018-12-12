import Button from '@material-ui/core/es/Button/Button';
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/es/DialogActions/DialogActions';
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/es/DialogTitle/DialogTitle'
import React, { Component } from 'react'

import './index.css'

class NoTracksDialog extends Component {
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

export default NoTracksDialog
