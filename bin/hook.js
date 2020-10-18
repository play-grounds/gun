#!/usr/bin/env node

'use strict'

// IMPORTS
var argv = require('minimist')(process.argv.slice(2))
var Gun = require('gun')
const { spawn } = require('child_process')

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
data.hook = argv.hook || data.hook

console.log(data)

// MAIN
var gun = Gun(data.peer)
console.log(data.peer)
var user = gun.user()

function login () {
  user.create(data.user, data.password)
  if (!user) {
    user.auth(data.user, data.password)
  }
}

function listen (key1, key2) {
  gun
    .get(key1)
    .get(key2)
    .on(d => {
      console.log('data', d)
      if (data.hook) {
        console.log('hook', data.hook)
        spawn(data.hook)
      }
    })
}

login()
listen(data.user, data.key)
