


module.exports = function NextId ()
{
	var id = 0

	return function next ()
	{
		id = id + 1
		return id
	}
}
