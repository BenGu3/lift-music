import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import CircularProgress from '@material-ui/core/CircularProgress';
import React, { Component } from 'react'
import DialogTitle from '@material-ui/core/es/DialogTitle/DialogTitle';


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
