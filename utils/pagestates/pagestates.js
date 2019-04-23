// utils/pageState/index.js

const loading = (that) => {
  return () => {
    that.setData({
      pageState: {
        state: 'loading',
        message: '加载中'
      }
    })
  }
}

const error = (that, message) => {
  return (message = '哦～网络好像不太好耶···') => {
    that.setData({
      pageState: {
        state: 'error',
        message
      }
    })
  }
}

const empty = (that, message) => {
  return (message = '空空如也') => {
    that.setData({
      pageState: {
        state: 'empty',
        message
      }
    })
  }
}

const finish = (that) => {
  return () => {
    that.setData({
      pageState: {
        state: 'finish',
        message: ''
      }
    })
  }
}

export default (that) => {
  finish()
  return {
    loading: loading(that),
    error: error(that),
    empty: empty(that),
    finish: finish(that)
  }
}