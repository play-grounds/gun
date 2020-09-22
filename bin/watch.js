#!/usr/bin/env node

// IMPORTS
const Gun = require('gun')
const fs = require('fs')
const INotifyWait = require('inotifywait')
require('gun/lib/open')

// MODEL
globalThis.data = {
  peer: 'ws://localhost:8765/gun',
  key: 'date',
  user: 'test',
  password: 'test',
  watch: './',
  prefix: ''
}

// INIT
var argv = require('minimist')(process.argv.slice(2))

data.peer = argv.peer || data.peer
data.key = argv.key || data.key
data.user = argv.user || data.user
data.password = argv.password || data.password
data.watch = argv.watch || data.watch
data.prefix = argv.prefix || data.prefix
console.log(data)

var gun = Gun(data.peer)

// FUNCTIONS
// login
function login () {
  var user = gun.user()

  user.create(data.user, data.password)
  if (!user) {
    user.auth(data.user, data.password)
  }
}

// put
function put (key, value) {
  var obj = {}
  obj[key] = value

  gun.get(data.user).put(obj, function (ack) {
    // console.log('ack', ack)
  })
}

// get obj
function getJSON (file) {
  var obj = {}
  if (file?.match(/.json/)) {
    obj = JSON.parse(fs.readFileSync(file))
  }

  return JSON.stringify(obj, null, 2)
}

// main
function main () {
  login()

  var watch = new INotifyWait(data.watch, { recursive: true })
  watch.on('change', function (filename) {
    var resource = 'https://' + filename.substring(data.prefix.length)
    console.log(filename + ' changed')

    var value = getJSON(filename)

    console.log('putting', resource)
    put(resource, value)
  })
}

// main
main()
