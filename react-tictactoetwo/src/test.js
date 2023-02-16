function makeCoordinates(index) {
	function column(index) {
		const colModulo = index % 3;
		if (colModulo < 1) {
			return [1];
		} else if (colModulo === 1) {
			return [2];
		} else if (colModulo === 2) {
			return [3];
		} else return null;
	}

	function row(index) {
		const rowRemainder = index / 3;
		if (rowRemainder < 1) {
			return [1];
		} else if (rowRemainder >= 1 && rowRemainder < 2) {
			return [2];
		} else if (rowRemainder >= 2 && rowRemainder < 3) {
			return [3];
		} else return null;
	}

	const coordinate = column(index).concat(row(index));

	return coordinate;
}

console.log(makeCoordinates(0));

console.log(makeCoordinates(1));

console.log(makeCoordinates(2));

console.log(makeCoordinates(5));

console.log(makeCoordinates(7));
