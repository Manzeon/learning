function addClass(element, value) {
	if (!element.class) {
		element.class = value;
	} else {
		element.class = element.class + " " + value;
	}
}