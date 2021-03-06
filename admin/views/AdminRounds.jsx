import React from 'react'
import { connect } from 'react-redux'

/**
 * COMPs
 */
import Callout from 'Callout'
import RoundCreate from 'RoundCreate'
import RoundsList from 'RoundsList'

class AdminRounds extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { seasons, season, rounds, dispatch } = this.props
    if (!seasons.length) {
      return <Callout title="No Season created yet!" message="Create a season in the season section before creating rounds!" />
    } else if (!season) {
      return <Callout title="No Season selected!" message="Select a season to edit in the topbar menu!" />
    }
    return (
      <div id="admin-rounds" className="container-fluid">
        <div className="col-sm-12 col-md-6">
          <RoundCreate season={season} rounds={rounds} dispatch={dispatch} />
        </div>
        <div className="col-sm-12 col-md-6">
          <RoundsList seasons={seasons} season={season} rounds={rounds} dispatch={dispatch} />
        </div>
      </div>
    )
  }
}

AdminRounds.propTypes = {
  dispatch: React.PropTypes.func,
  seasons: React.PropTypes.array,
  rounds: React.PropTypes.array,
  season: React.PropTypes.object,
}

export default connect((state) => ({
  season: state.seasons.viewed,
  seasons: state.seasons.seasons,
  rounds: state.rounds.rounds,
}))(AdminRounds)
