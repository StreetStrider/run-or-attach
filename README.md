# run-or-attach

> kickstart Node.js daemon on first demand and attach to it

Split your application or utility into cli-part and daemon-part. Then connect to daemon in cli-part. Daemon will be started on first demand.

```js
/* main file */
var attach = require('run-or-attach')

attach('/tmp/sock', require.resolve('./path-to-worker'))
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
```

```
/* worker file */
var Worker = require('run-or-attach/worker')

var worker = Worker()
worker.recv = function (data)
{
	data.x += 1;

	// answers can be sync or async
	// return falsy value to answer nothing
	return new Promise((rs) => { setTimeout(() => rs(data), 100) })
}
```
