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
  password: 'test'
}

// INIT
data.peer = argv.peer || data.peer
data.key = argv.key || data.key
data.user = argv.user || data.user
data.password = argv.password || data.password

// MAIN
var gun = Gun(data.peer)
var user = gun.user()

user.create(data.user, data.password)
if (!user) {
  user.auth(data.user, data.password)
}

setInterval(() => {
  gun
    .get(data.user)
    .get(data.key)
    .put(new Date().toISOString(), function (ack) {
      // console.log('ack', ack)
    })
}, 10)

gun
  .get(data.user)
  .get(data.key)
  .on(data => {
    console.log('data', data)
  })
