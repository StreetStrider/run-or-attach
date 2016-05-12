
var util = module.exports = {}

var timeout = util.timeout = function timeout (promise)
{
	return Promise.race(
	[
		promise,
		new Promise((rs, rj) => { setTimeout(() => rj(new Error('timeout')), 1.5 * 1000) })
	])
}

util.delay = function delay ()
{
	return new Promise(rs => setTimeout(() => rs(), 0.25 * 1000))
}


util.waitfor = function waitfor (token, flow)
{
	var prev_recv = flow.recv

	var r = new Promise(rs =>
	{
		flow.recv = (data) =>
		{
			if (data[0] === token)
			{
				rs(data)
			}
			else
			{
				prev_recv(data)
			}
		}
	})

	r = timeout(r)

	r.then(data =>
	{
		flow.recv = prev_recv

		return data
	})

	r.catch(error =>
	{
		flow.recv = prev_recv

		console.log(error)

		throw error
	})

	return r
}
