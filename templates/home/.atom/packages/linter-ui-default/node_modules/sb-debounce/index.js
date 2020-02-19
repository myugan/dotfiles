'use strict'

function debounce(callback, timeout, aggressive) {
  var timer = null
  var latestParameter
  var latestThis
  function later() {
    timer = null
    callback.call(latestThis, latestParameter)
  }
  return function debounced(parameter) {
    latestParameter = parameter
    latestThis = this
    if (!aggressive || timer === null) {
      clearTimeout(timer)
      timer = setTimeout(later, timeout)
    }
  }
}

module.exports = debounce
