import React from 'react'
import { connect } from 'react-redux'
import { selectAdminRound, clearAdminTeams } from 'actions'

/**
 * COMPs
 */
import Callout from 'Callout'
import TeamCreate from 'TeamCreate'

class AdminTeamCreate extends React.Component {
  constructor(props) {
    super(props)
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    dispatch(selectAdminRound(null))
    dispatch(clearAdminTeams())
  }

  render() {
    const { seasons, season, rounds, dispatch } = this.props
    if (!seasons.length) {
      return <Callout title="No Season created yet!" message="Create a season in the season section before creating rounds!" />
    } else if (!season) {
      return <Callout title="No Season selected!" message="Select a season to edit in the topbar menu!" />
    } else if (!rounds.length) {
      return <Callout title="No rounds created yet!" message="Create at least one round for the current season!" />
    }
    return (
      <div id="admin-team-list" className="container-fluid">
        <TeamCreate season={season} rounds={rounds} dispatch={dispatch} />
      </div>
    )
  }
}

AdminTeamCreate.propTypes = {
  dispatch: React.PropTypes.func,
  seasons: React.PropTypes.array,
  season: React.PropTypes.object,
  rounds: React.PropTypes.array,
  teams: React.PropTypes.array,
  selectedRound: React.PropTypes.object,
}

export default connect((state) => ({
  seasons: state.seasons.seasons,
  season: state.seasons.viewed,
  rounds: state.rounds.rounds,
}))(AdminTeamCreate)
