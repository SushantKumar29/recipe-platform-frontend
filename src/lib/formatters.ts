export const formatPreparationTime = (minutes: number) => {
	if (minutes < 60) {
		return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
	}

	const hours = Math.floor(minutes / 60);
	const remainingMinutes = minutes % 60;

	if (remainingMinutes === 0) {
		return `${hours} hour${hours !== 1 ? "s" : ""}`;
	}

	return `${hours} hour${hours !== 1 ? "s" : ""} ${remainingMinutes} minute${
		remainingMinutes !== 1 ? "s" : ""
	}`;
};
