#!/usr/bin/env node

'use strict'

// IMPORTS
var argv = require('minimist')(process.argv.slice(2))
var Gun = require('gun')

// MODEL
globalThis.data = {
  peer: 'ws://localhost:8765/gun',
  key: 'pic',
  user: 'test',
  password: 'test',
  value: new Date().toISOString()
}

// FUNCTIONS
function stringOrJson (str) {
  var json
  try {
    json = JSON.parse(str)
    return json
  } catch (e) {
    return str
  }
}

// INIT
data.peer = argv.peer || data.peer
data.key = argv.key || data.key
data.user = argv.user || data.user
data.password = argv.password || data.password
data.value = argv.value || data.value
console.log(data)

// MAIN
var gun = Gun(data.peer)
var user = gun.user()

user.create(data.user, data.password)
if (!user) {
  user.auth(data.user, data.password)
}

gun
  .get(data.user)
  .get(data.key)
  .put(stringOrJson(data.value), function (ack) {
    console.log('ack', ack)
    var peers = gun.back('opt.peers')
    var peer = peers[data.peer]
    if (peer && peer.wire) {
      peer.wire.close()
    }
    process.exit()
  })
