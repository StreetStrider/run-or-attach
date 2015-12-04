# run-or-attach

> kickstart Node.js daemon on first demand and attach to it

Split your application or utility into cli-part and daemon-part. Then connect to daemon in cli-part. Daemon will be started on first demand.

```js
var attach = require('run-or-attach')

attach('/tmp/sock', worker /* described below */)
.then(function (flow)
{
	// flow is a function for pushing JSON to daemon
	flow({ x: Math.random() })

	// flow.recv for receiving JSON answers from daemon
	flow.recv = function (data)
	{
		console.dir(data)

		process.exit(0)
	}
})

// worker is a daemon handler
var FWorker = require('run-or-attach/worker')

var worker = FWorker()
worker.recv = function (data)
{
	data.x += 1;

	// answers can be sync or async
	// return falsy value to answer nothing
	return new Promise((rs) => { setTimeout(() => rs(data), 100) })
}
```
