function resetFields(whichform) {
	if (Modernizr.input.placeholder) return;
	for (var i = 0; i < whichform.elements.length; i++) {
		var element = whichform.elements[i];
		if (element.type === "submit") continue;
		var check = element.placeholder || element.getAttribute('placeholder');
		if (!check) continue;
		element.onfocus = function () {
			var text = this.placeholder || this.getAttribute('placeholder');
			if (this.value === text) {
				this.className = "";
				this.value = "";
			}
		}
		element.onblur = function () {
			if (this.value === "") {
				this.className = "placeholder";
				this.value = this.placeholder || getAttribute('placeholder');
			}
		}
		element.onblur();
	}
}