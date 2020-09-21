#!/usr/bin/env node

'use strict'

// IMPORTS
var argv = require('minimist')(process.argv.slice(2))
var Gun = require('gun')

// MODEL
globalThis.data = {
  peer: 'wss://melvincarvalho.com:3000/gun',
  key: 'date',
  user: 'test',
  password: 'test',
  value: new Date().toISOString()
}

// INIT
data.peer = argv.peer || data.peer
data.key = argv.key || data.key
data.user = argv.user || data.user
data.password = argv.password || data.password
data.value = argv.value || data.value

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
  .put(data.value, function (ack) {
    console.log('ack', ack)
    var peers = gun.back('opt.peers')
    var peer = peers[data.peer]
    if (peer.wire) {
      peer.wire.close()
      process.exit()
    }
  })
