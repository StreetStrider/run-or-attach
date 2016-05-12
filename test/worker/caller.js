
var sockpath = '/tmp/run-or-attach-worker-test'

var attach = require('../../src/attach')

var util = require('../_util')
var delay = util.delay
var waitfor = util.waitfor


attach(sockpath)
