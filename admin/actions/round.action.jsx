import Api from 'Http'
import { openToastr } from './toastr.action'
import { clearAdminTeams } from './teams.action'

export const setAdminRounds = (rounds) => {
  return {
    type: 'SET_ADMIN_ROUNDS',
    rounds,
  }
}

export const clearAdminRounds = (rounds = []) => {
  return {
    type: 'CLEAR_ADMIN_ROUNDS',
    rounds,
  }
}

export const selectAdminRound = (round = null) => {
  return {
    type: 'SELECT_ADMIN_ROUND',
    round,
  }
}

export const adminRoundsLoading = (loading) => {
  return {
    type: 'ADMIN_ROUND_LOADING',
    loading,
  }
}

export const adminRoundsSuccess = (success) => {
  return {
    type: 'ADMIN_ROUND_SUCCESS',
    success,
  }
}

export const adminRoundsFail = (fail) => {
  return {
    type: 'ADMIN_ROUND_FAIL',
    fail,
  }
}

export const startGetAdminRounds = (season) => {
  return (dispatch, getState) => {
    const store = getState()
    const authToken = store.account.authToken
    dispatch(adminRoundsLoading(true))
    if (!season && !store.seasons.viewed) {
      dispatch(openToastr('error', 'No Season selected!', 'Select a season plase!'))
      dispatch(setAdminRounds([]))
      dispatch(adminRoundsSuccess(false))
      dispatch(adminRoundsFail('No Season provided'))
      dispatch(adminRoundsLoading(false))
      return null
    } else if (!season && store.seasons.viewed._id) {
      season = store.seasons.viewed._id
    }
    return Api.get(`/admin/rounds/${season}`, {
      headers: {
        Authorization: authToken,
      },
    })
    .then((res) => {
      const { rounds } = res.data
      dispatch(setAdminRounds(rounds))
      dispatch(clearAdminTeams()) // cleanup
      dispatch(selectAdminRound()) // cleanup
      dispatch(adminRoundsSuccess(true))
      dispatch(adminRoundsLoading(false))
      return res
    })
    .catch((err) => {
      const { data } = err.response
      dispatch(adminRoundsFail(data))
      dispatch(adminRoundsLoading(false))
      dispatch(openToastr('error', data.message || 'Error getting rounds!'))
      return data
    })
  }
}

export const startCreateNewRounds = (newRound) => {
  return (dispatch, getState) => {
    const store = getState()
    const authToken = store.account.authToken
    if (!newRound.season) {
      return dispatch(openToastr('error', 'No season selected!'))
    }
    dispatch(adminRoundsLoading(true))
    return Api.post('/admin/round', newRound, {
      headers: {
        Authorization: authToken,
      },
    })
    .then((res) => {
      dispatch(openToastr('success', 'Rounds created!'))
      dispatch(adminRoundsSuccess(true))
      dispatch(adminRoundsLoading(false))
      dispatch(startGetAdminRounds(res.data.round.season))
      return res
    })
    .catch((err) => {
      const { data } = err.response
      dispatch(openToastr('error', data.message || 'Error creating a season!'))
      dispatch(adminRoundsFail(data))
      dispatch(adminRoundsLoading(false))
      return data
    })
  }
}

export const startDeleteAdminRoundMedia = (roundId) => {
  return (dispatch, getState) => {
    const store = getState()
    const authToken = store.account.authToken
    dispatch(adminRoundsLoading(true))
    return Api.delete(`/admin/round/${roundId}/photo`, {
      headers: {
        Authorization: authToken,
      },
    })
    .then((res) => {
      dispatch(openToastr('success', 'Round media removed!'))
      dispatch(adminRoundsSuccess(true))
      dispatch(adminRoundsLoading(false))
      dispatch(startGetAdminRounds(res.data.round.season))
      return res
    })
    .catch((err) => {
      const { data } = err.response
      dispatch(openToastr('error', data.message || 'Error removing the round media!'))
      dispatch(adminRoundsFail(data))
      dispatch(adminRoundsLoading(false))
      return data
    })
  }
}

export const startDeleteRound = (roundId) => {
  return (dispatch, getState) => {
    const store = getState()
    const authToken = store.account.authToken
    dispatch(adminRoundsLoading(true))
    return Api.delete(`/admin/round/${roundId}`, {
      headers: {
        Authorization: authToken,
      },
    })
    .then((res) => {
      dispatch(openToastr('success', 'Round removed!'))
      dispatch(adminRoundsSuccess(true))
      dispatch(adminRoundsLoading(false))
      dispatch(startGetAdminRounds(res.data.round.season))
      return res
    })
    .catch((err) => {
      const { data } = err.response
      dispatch(openToastr('error', data.message || 'Error removing the round!'))
      dispatch(adminRoundsFail(data))
      dispatch(adminRoundsLoading(false))
      return data
    })
  }
}
