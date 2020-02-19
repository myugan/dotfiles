'use strict'

const invariant = require('assert')
const debounce = require('./')

{
  "It debounces properly";
  let called = 0
  let debounced = debounce(function() {
    ++called
  }, 50)
  debounced()
  debounced()
  debounced()
  setTimeout(function() {
    if (called !== 1) {
      throw new Error()
    }
  }, 60)
}

{
  "it provides latest parameter to callback";
  let called = 0
  let debounced = debounce(function(parameter) {
    ++called
    invariant(parameter === 3)
  }, 50)
  debounced(1)
  debounced(4)
  debounced(3)
  setTimeout(function() {
    invariant(called === 1)
  }, 60)
}

{
  "it handles aggressive debouncers properly";
  let called = 0
  let debounced = debounce(function() {
    ++called
  }, 50, true)
  debounced()
  debounced()
  debounced()
  debounced()
  setTimeout(function() {
    debounced()
  }, 25)
  setTimeout(function() {
    invariant(called === 1)
  }, 60)
  setTimeout(function() {
    invariant(called === 1)
  }, 80)
}

{
  "normal can't work like aggressive";
  let called = 0
  let debounced = debounce(function() {
    ++called
  }, 50, false)
  debounced()
  debounced()
  debounced()
  debounced()
  setTimeout(function() {
    debounced()
  }, 25)
  setTimeout(function() {
    invariant(called === 0)
  }, 60)
  setTimeout(function() {
    invariant(called === 1)
  }, 80)
}

{
  "provides proper this value";
  let called = 0
  let that = {something: true}
  let debounced = debounce(function() {
    invariant(this === that)
    ++called
  }, 50)
  debounced.call(that)
  setTimeout(function() {
    invariant(called === 1)
  }, 60)
}

{
  "calls using the latest this";
  let called = 0
  let that = {something: true}
  let debounced = debounce(function() {
    invariant(this === that)
    ++called
  }, 50)
  debounced.call({})
  debounced.call({})
  debounced.call({})
  debounced.call(that)
  setTimeout(function() {
    invariant(called === 1)
  }, 60)
}
