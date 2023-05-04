const CALENDAR_SITE ="https://sdet-challenge.vercel.app/";

/**
 * This variable is an array that contains the json of 12 months. Each month has their full and abbreviated names.
 */
const MONTHS = [
	{
		month: {
			fullName: 'January',
			abbrName: 'Jan',
		},
	},
	{ 
		month:{
			fullName: 'February',
			abbrName: 'Feb',
		},
	},
	{
		month:{
			fullName: 'March',
			abbrName: 'Mar',
		},
	},
	{
		month:{
			fullName: 'April',
			abbrName: 'Apr',
		},
	},
	{
		month:{
			fullName: 'May',
			abbrName: 'May',
		},
	},
	{
		month:{
			fullName: 'June',
			abbrName: 'Jun',
		},
	},
	{
		month:{
			fullName: 'July',
			abbrName: 'Jul',
		},
	},
	{
		month:{
			fullName: 'August',
			abbrName: 'Aug',
		},
	},
	{
		month:{
			fullName: 'September',
			abbrName: 'Sep',
		},
	},
	{
		month:{
			fullName: 'October',
			abbrName: 'Oct',
		},
	},
	{
		month:{
			fullName: 'November',
			abbrName: 'Nov',
		},
	},
	{
		month:{
			fullName: 'December',
			abbrName: 'Dec',
		},
	}
];

/**
 * It is used search the json month object using an abbreviate month name.
 * @param month - Month abbreviated name, E.g 'Jan'. 
 * @returns Json object of the month.
 */
function GET_MONTH_BY_ABBRNAME (month: string) {
	return MONTHS.find(item => {
		return item.month.abbrName == month;
	});
}

/**
 * It is used search the json month object using an full name month name.
 * @param month - Month abbreviated name, E.g 'January'. 
 * @returns Json object of the month.
 */
function GET_MONTH_BY_FULLNAME (month: string) {
	return MONTHS.find(item => {
		return item.month.abbrName == month;
	});
}

export { CALENDAR_SITE, MONTHS, GET_MONTH_BY_ABBRNAME, GET_MONTH_BY_FULLNAME };
