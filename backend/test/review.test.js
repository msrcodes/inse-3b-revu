const reviewManager = require('../manager/review');

test('validate review, correct variable types.', () => {
	expect(reviewManager.validateReview(
		0.5,
		"degree is great",
		1.5,
		"staff is great",
		5,
		"facility is great",
		5,
		"university is great",
		3.4,
		"bad"
	)).toBe(true);
});

test('validate review, incorrect variable types.', () => {
	expect(reviewManager.validateReview(
		0.5,
		2,
		1.5,
		"staff is great",
		5,
		3,
		5,
		"university is great",
		3.4,
		"bad"
	)).toBe(false);
});
