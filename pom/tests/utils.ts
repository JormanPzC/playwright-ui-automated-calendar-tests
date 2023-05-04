/**
 * It is used to add days to a date.
 * @param date - Base date to add days. 
 * @param days - Number of days to add to the date, it can be a negative number. 
 * @returns Date with the added days.
 */
function addDays(date: Date, days: number): Date {
	const auxDate: Date = new Date(date);
	auxDate.setDate(auxDate.getDate() + days);
	return auxDate;

}

/**
 * It is used  to get a random number between two numbers.
 * @param min - Lowest number. 
 * @param max - Highest number. 
 * @returns A random number between the min and max numbers.
 */
function randomIntFromInterval(min: number, max: number): number { 
	return Math.floor(Math.random() * (max - min + 1) + min);

}

/**
 * It is used to get a random date greater than the current date, with a limit of up to 20 years.
 * @returns Random date greater that current date.
 */
function randomUpperDate(): Date {
	const maxDays: number = 20 * 365; // approximately the number of days in 20 years
	const randomDays: number = randomIntFromInterval(1, maxDays);
	return addDays(new Date(), randomDays);
	
}

/**
 * It is used to get a random date from the current date previous month.
 * @returns Random date from the current date previous month.
 */
function randomUnderMonthDate(): Date {
	const date: Date = new Date();
	const daysInPreviosMonth = new Date(date.getUTCFullYear(), date.getUTCMonth(), 0).getDate();
	date.setMonth(date.getUTCMonth()-1);
	date.setDate(1);//Setting the date to the first day of the previous month
	const randomDays = randomIntFromInterval(1, daysInPreviosMonth);
	return addDays(date, randomDays);

}

export { addDays, randomIntFromInterval, randomUpperDate, randomUnderMonthDate };