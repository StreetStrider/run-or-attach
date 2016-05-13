
var env = process.env

env.RUN_OR_ATTACH_WORKERPATH = require.resolve('./worker')
env.RUN_OR_ATTACH_SOCKPATH   = '/tmp/run-or-attach-worker-test'

global.run = require('../../src/daemon/run-daemon')
