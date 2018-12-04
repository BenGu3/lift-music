import LinearProgress from '@material-ui/core/LinearProgress'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/es/DialogTitle/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import React, { Component } from 'react'

class ProgressDialog extends Component {
  render() {
    return (
      <Dialog open={this.props.isOpen}>
        <DialogTitle>Generating playlist...</DialogTitle>
        <DialogContent style={{ textAlign: 'center' }}>
          <LinearProgress variant="determinate" value={this.props.progress} color="primary"/>
        </DialogContent>
      </Dialog>
    )
  }
}

export default ProgressDialog
