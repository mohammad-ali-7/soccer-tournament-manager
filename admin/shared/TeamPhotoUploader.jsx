import React from 'react'
import { connect } from 'react-redux'
import { DropzoneLoader } from 'ChunkLoaders'
import {
  openToastr,
  startGetAdminSingleTeam,
} from 'actions'

let mediaUploader

class TeamPhotoUploader extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const { dispatch, team } = this.props

    DropzoneLoader().then((modules) => {
      const { Dropzone } = modules
      Dropzone.autoDiscover = false
      mediaUploader = new Dropzone('#team-media-photo', {
        url: `/api/admin/team/${team._id}/photo`,
        paramName: 'teamPhoto', // The name that will be used to transfer the file
        maxFilesize: 2, // MB
        headers: { Authorization: this.props.authToken },
      })

      mediaUploader.on('sending', (file, xhr, formData) => {
        dispatch(openToastr('warning', 'Photo upload started!'))
        formData.append('teamId', team._id)
      })

      mediaUploader.on('success', (file, res) => {
        if (res.success) {
          dispatch(openToastr('success', 'Photo uploaded!'))
          dispatch(startGetAdminSingleTeam(team._id))
        }
      })
    })
  }

  componentWillUnmount() {
    mediaUploader.destroy()
  }

  render() {
    return (
      <form className="dropzone hide" id="team-media-photo"></form>
    )
  }
}

TeamPhotoUploader.propTypes = {
  team: React.PropTypes.object,
  authToken: React.PropTypes.string,
  dispatch: React.PropTypes.func,
  loading: React.PropTypes.bool,
}

export default connect(state => ({
  authToken: state.account.authToken,
}))(TeamPhotoUploader)
