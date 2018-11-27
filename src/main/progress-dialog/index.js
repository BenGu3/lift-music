import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/es/DialogTitle/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent'
import React, { Component } from 'react'

class ProgressDialog extends Component {
  render() {
    return (
      <Dialog open={this.props.isOpen}>
        <DialogTitle>Generating playlist...</DialogTitle>
        <DialogContent style={{ textAlign: 'center' }}>
          <CircularProgress variant="indeterminate" color="primary"/>
        </DialogContent>
      </Dialog>
    )
  }
}

export default ProgressDialog
