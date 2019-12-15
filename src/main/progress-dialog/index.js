import { Dialog, DialogContent, DialogTitle, LinearProgress } from '@material-ui/core'
import React, { Component } from 'react'
import { func, number } from 'prop-types'

import './index.css'

export default class ProgressDialog extends Component {
  static propTypes = {
    isOpen: func,
    progress: number
  }

  render() {
    return (
      <Dialog open={this.props.isOpen} className="progress-dialog">
        <DialogTitle>Generating playlist...</DialogTitle>
        <DialogContent style={{ textAlign: 'center' }}>
          <LinearProgress variant="determinate" value={this.props.progress} color="primary" />
        </DialogContent>
      </Dialog>
    )
  }
}
