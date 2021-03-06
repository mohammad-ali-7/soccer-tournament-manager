import React from 'react'
import Box from 'Box'
import RoundSwitcher from 'RoundSwitcher'
import {
  startGetAdminDays,
  startDeleteDay,
  clearAdminDays,
} from 'actions'

class DaysList extends React.Component {
  constructor(props) {
    super(props)
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch } = this.props
    const selectedRound = nextProps.selectedRound
    const prevSelectedRound = this.props.selectedRound
    /**
     * ROUND SWITCHER
     */
    if (selectedRound && selectedRound !== prevSelectedRound) {
      dispatch(startGetAdminDays(selectedRound._id))
    }
    return null
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    dispatch(clearAdminDays())
  }

  onDeleteDay(e, day) {
    e.stopPropagation()
    const { dispatch } = this.props
    if (day && day._id && confirm('You will lose all data of this days')) {
      dispatch(startDeleteDay(day._id))
    }
  }

  renderDaysList() {
    const { days } = this.props.days
    if (days && days.length) {
      /**
       * GENERATE LIST
       */
      return days.map((day, i) => {
        return (
          <li className="item" key={i}>
            <div className="product-info day-info">
              <span className="label label-danger pull-right">
                <i className="fa fa-remove fa-2x pointer" onClick={(e) => this.onDeleteDay(e, day)}></i>
              </span>
              <span className="product-title">
                <b>Day {i + 1}</b>
              </span>
              <span className="product-description">
                <b>Matches: </b> {day.matchesCount}
                <br />
                <b>Played: </b> {day.playedMatches}
                <br />
                <b>Not Played: </b> {day.notPlayedMatches}
              </span>
            </div>
          </li>
        )
      })
    }
    return (
      <p>
        No days yet!
      </p>
    )
  }

  render() {
    return (
      <Box title="Days List" subtitle={`Season: ${this.props.season.year}`} filters={<RoundSwitcher />}>
        <ul className="products-list product-list-in-box">
          {this.renderDaysList()}
        </ul>
      </Box>
    )
  }
}

DaysList.propTypes = {
  selectedRound: React.PropTypes.object,
  rounds: React.PropTypes.array,
  season: React.PropTypes.object,
  days: React.PropTypes.object,
  dispatch: React.PropTypes.func,
}

export default DaysList
