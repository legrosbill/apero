String.prototype.sanityze = function () {
	return this.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quote;');
}

