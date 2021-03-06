import React from 'react'
import { Link } from 'react-router'
import { MomentLoader } from 'ChunkLoaders'
import Box from 'Box'
import RoundSwitcher from 'RoundSwitcher'
import {
  startGetAdminMatches,
  startDeleteMatch,
} from 'actions'

class MatchesList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      Moment: undefined,
    }
  }

  componentWillMount() {
    MomentLoader().then((module) => {
      this.setState({
        Moment: module.Moment,
      })
    })
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch } = this.props
    const selectedRound = nextProps.selectedRound
    const prevSelectedRound = this.props.selectedRound

    /**
     * ROUND SWITCHER
     */
    if (selectedRound && selectedRound !== prevSelectedRound) {
      dispatch(startGetAdminMatches(selectedRound._id))
    }
    return null
  }

  onMatchRemove(e, match) {
    e.stopPropagation()
    const { dispatch } = this.props
    if (match && match._id && confirm('You will lose all data of this match')) {
      dispatch(startDeleteMatch(match._id))
    }
  }

  renderTableList() {
    const { matches } = this.props
    const { Moment } = this.state
    Moment.locale('it')
    if (matches) {
      return matches.map((match, i) => {
        return (
          <tr key={i}>
            <td>
              <Link to={`/admin/match/${match._id}`}><i className="fa fa-pencil fa-2x pointer"></i></Link>
            </td>
            <td>{match.teamHome.name}</td>
            <td>{match.teamAway.name}</td>
            <td>{`${match.teamHomeScores} - ${match.teamAwayScores}`}</td>
            <td>{Moment(match.date).format('lll')}</td>
            <td>{match.played ? 'played' : 'not played' }</td>
            <th>
              <i className="fa fa-remove pointer fa-2x" onClick={(e) => this.onMatchRemove(e, match)}></i>
            </th>
          </tr>
        )
      })
    }
    return null
  }

  render() {
    const { Moment } = this.state
    if (Moment) {
      return (
        <Box title="Matches list" filters={<RoundSwitcher />}>
          <div className="box-body table-responsive no-padding">
            <table className="table table-hover">
              <tbody>
                <tr>
                  <th> <i className="fa fa-cog"></i> </th>
                  <th>Team Home</th>
                  <th>Team Away</th>
                  <th>Result</th>
                  <th>Date</th>
                  <th>Played</th>
                  <th></th>
                </tr>
                {this.renderTableList()}
              </tbody>
            </table>
          </div>
        </Box>
      )
    }
    return null
  }
}

MatchesList.propTypes = {
  selectedRound: React.PropTypes.object,
  matches: React.PropTypes.array,
  dispatch: React.PropTypes.func,
}

export default MatchesList
