// Adding JOIN  INSERT INTO, UPDATE FEATURES

// Parse a query
	// parseCond: (bool) parse conditions in WHERE and JOIN (default true)
	exports.sql2ast = function (query, parseCond) {
		if (typeof parseCond == 'undefined' || parseCond === null) parseCond = true;

		// Remove semi-colons and keep only the first query
		var semi_colon = '###semi-colon###';
		query = query.replace(/[("'`].*;.*[)"'`]/g, function (match) {
			return match.replace(/;/g, semi_colon);
		});
		var eor = '###EOR###';
		query = query.replace(/;/g, eor);
		query = query.split(eor)[0];
		query = query.replace(new RegExp(semi_colon, 'g'), ';');

		// Define which words can act as separator
		var keywords = ['SELECT', 'FROM', 'DELETE FROM', 'INSERT INTO', 'UPDATE', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'ORDER BY', 'GROUP BY', 'HAVING', 'WHERE', 'LIMIT', 'VALUES', 'SET'];
		var parts_name = keywords.map(function (item) {
			return item + ' ';
		});
		parts_name = parts_name.concat(keywords.map(function (item) {
			return item + '(';
		}));
		parts_name = parts_name.concat(parts_name.map(function (item) {
			return item.toLowerCase();
		}));
		var parts_name_escaped = parts_name.map(function (item) {
			return item.replace('(', '[\\(]');
		});
