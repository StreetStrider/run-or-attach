# run-or-attach

> kickstart Node.js daemon on first demand and attach to it

Split your application or utility into cli-part and daemon-part. Then connect to daemon in cli-part. Daemon will be started on first demand.

```js
/* main file */
var attach = require('run-or-attach')

attach('/tmp/sock', require.resolve('./path-to-worker'))
.then(function (flow)
{
	/* flow is a function for pushing JSON to daemon */
	flow({ x: Math.random() })

	/* flow.recv is for receiving JSON answers from daemon */
	flow.recv = function (r)
	{
		console.dir(r)
	}

	flow.request({ x: 2 })
	.then(function (r)
	{
		console.info('request:')
		console.dir(r)
	})
})
```

```js
/* worker file */
var Worker = require('run-or-attach/worker')

var worker = Worker()

/* recv is for handling incoming messages/requests */
worker.recv = function (data)
{
	data.x += 1

	// answers can be sync or async
	// return falsy value to answer nothing
	return new Promise((rs) => { setTimeout(() => rs(data), 100) })
}

worker.conn = function (flow)
{
	// push realtime to client without waiting for request
	var next = 0
	setInterval(() => { next = next + 1; flow({ realtime: next }) }, 1000)
}
```
