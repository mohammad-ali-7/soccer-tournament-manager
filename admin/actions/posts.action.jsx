import Api from 'Http'
import { openToastr } from 'toastr.action'

export const postLoading = (loading = false) => ({
  type: 'POST_LOADING',
  loading,
})

export const postSuccess = (success) => ({
  type: 'POST_SUCCESS',
  success,
})

export const postFail = (fail) => ({
  type: 'POST_FAIL',
  fail,
})

export const setPosts = (posts = []) => ({
  type: 'SET_POSTS',
  posts,
})

export const clearPosts = () => ({
  type: 'CLEAR_POSTS',
})

export const clearPost = () => ({
  type: 'CLEAR_POST',
})

export const setSinglePost = (post = {}) => ({
  type: 'SET_SINGLE_POST',
  post,
})

export const setSinglePostTitle = (title) => ({
  type: 'SET_SINGLE_POST_TITLE',
  title,
})

export const setSinglePostBody = (body) => ({
  type: 'SET_SINGLE_POST_BODY',
  body,
})

export const clearSinglePost = (post = {}) => ({
  type: 'SET_SINGLE_POST',
  post,
})

export const startGetPosts = () => {
  return (dispatch, getState) => {
    const store = getState()
    const authToken = store.account.authToken
    dispatch(postLoading(true))
    return Api.get('/admin/posts', {
      headers: {
        Authorization: authToken,
      },
    })
    .then((res) => {
      console.log(res.data)
      dispatch(postLoading(false))
      dispatch(postSuccess(true))
      dispatch(setPosts(res.data.posts))
      return res
    })
    .catch((err) => {
      dispatch(postLoading(false))
      dispatch(postFail(true))
      return err.response
    })
  }
}

export const startGetSinglePost = (postId) => {
  return (dispatch, getState) => {
    const store = getState()
    const authToken = store.account.authToken
    dispatch(postLoading(true))
    return Api.get(`/admin/post/${postId}`, {
      headers: {
        Authorization: authToken,
      },
    })
    .then((res) => {
      dispatch(postLoading(false))
      dispatch(postSuccess(true))
      dispatch(setSinglePost(res.data.post))
      return res
    })
    .catch((err) => {
      dispatch(postLoading(false))
      dispatch(postFail(true))
      return err.response
    })
  }
}

export const startSavePost = () => {
  return (dispatch, getState) => {
    const store = getState()
    const authToken = store.account.authToken
    const { post } = store.posts
    dispatch(postLoading(true))
    return Api.post('/admin/post', post, {
      headers: {
        Authorization: authToken,
      },
    })
    .then((res) => {
      dispatch(openToastr('success', 'Post saved!'))
      dispatch(postLoading(false))
      dispatch(postSuccess(true))
      return res
    })
    .catch((err) => {
      const { data } = err.response
      dispatch(openToastr('error', data.message || 'Some error occured.'))
      dispatch(postLoading(false))
      dispatch(postFail(true))
      return err.response
    })
  }
}

export const startEditPost = () => {
  return (dispatch, getState) => {
    const store = getState()
    const authToken = store.account.authToken
    const { post } = store.posts
    dispatch(postLoading(true))
    return Api.patch(`/admin/post/${post._id}`, post, {
      headers: {
        Authorization: authToken,
      },
    })
    .then((res) => {
      dispatch(openToastr('success', 'Post edited!'))
      dispatch(postLoading(false))
      dispatch(postSuccess(true))
      return res
    })
    .catch((err) => {
      const { data } = err.response
      dispatch(openToastr('error', data.message || 'Some error occured.'))
      dispatch(postLoading(false))
      dispatch(postFail(true))
      return err.response
    })
  }
}

export const startDeletePost = (postId) => {
  return (dispatch, getState) => {
    const store = getState()
    const authToken = store.account.authToken
    dispatch(postLoading(true))
    return Api.delete(`/admin/post/${postId}`, {
      headers: {
        Authorization: authToken,
      },
    })
    .then((res) => {
      dispatch(startGetPosts())
      dispatch(postLoading(false))
      dispatch(postSuccess(true))
      return res
    })
    .catch((err) => {
      dispatch(postLoading(false))
      dispatch(postFail(true))
      return err.response
    })
  }
}

export const startDeletePostFeaturedImage = (postId) => {
  return (dispatch, getState) => {
    const store = getState()
    const authToken = store.account.authToken
    dispatch(postLoading(true))
    return Api.delete(`/admin/post/${postId}/featured`, {
      headers: {
        Authorization: authToken,
      },
    })
    .then((res) => {
      dispatch(startGetSinglePost(res.data.post._id))
      dispatch(postLoading(false))
      dispatch(postSuccess(true))
      return res
    })
    .catch((err) => {
      dispatch(postLoading(false))
      dispatch(postFail(true))
      return err.response
    })
  }
}
