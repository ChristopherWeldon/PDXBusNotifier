/**
 * Allow modles to have default values
 * @param {Object} target value
 * @param {Object} defaultValue
 */
ko.extenders.defaultIfNull = function(target, defaultValue) {
	var result = ko.computed({
		read : target,
		write : function(newValue) {
			if (!newValue) {
				target(defaultValue);
			} else {
				target(newValue);
			}
		}
	});

	result(target());

	return result;
}; 