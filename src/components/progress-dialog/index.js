import { Dialog, DialogContent, DialogTitle, LinearProgress } from '@material-ui/core'
import React from 'react'
import { bool, number } from 'prop-types'

import './index.css'

const ProgressDialog = props => (
  <Dialog open={props.isOpen} className="progress-dialog">
    <DialogTitle>Generating playlist...</DialogTitle>
    <DialogContent style={{ textAlign: 'center' }}>
      <LinearProgress variant="determinate" value={props.progress} color="primary" />
    </DialogContent>
  </Dialog>
)

ProgressDialog.propTypes = {
  isOpen: bool.isRequired,
  progress: number.isRequired
}

export default ProgressDialog
