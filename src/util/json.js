
var json = module.exports = {}


var _load = JSON.parse

json.load = function load (it)
{
	try
	{
		return _load(it)
	}
	catch (e)
	{
		return e
	}
}


var _dump = JSON.stringify
var _null = ''

json.dump = function dump (it)
{
	try
	{
		return _dump(it)
	}
	catch (e)
	{
		return _null
	}
}
