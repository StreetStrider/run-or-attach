
module.exports = function NoEnt (fn)
{
	return function noented (error)
	{
		if (error.code === 'ENOENT')
		{
			return fn(error)
		}
		else
		{
			return Promise.reject(error)
		}
	}
}
