import { expect, Locator, Page } from '@playwright/test';
import { MONTHS, GET_MONTH_BY_ABBRNAME } from '../data/constants';

export class CalendarPage {
	readonly page: Page;
	readonly firstDateInputDisplayLocator: Locator;
	readonly secondDateInputDisplayLocator: Locator;
	readonly previousMonthButtonLocator: Locator;
	readonly nextMonthButtonLocator: Locator;
	readonly monthPickerLocator: Locator;
	readonly yearPickerLocator: Locator;
	readonly firstCalendarMonthYearLocator: Locator;
	readonly secondCalendarMonthYearLocator: Locator;
	dayInCalendarLocator: Locator;

	constructor(page: Page) {
		this.page = page;
		this.firstDateInputDisplayLocator = page.getByPlaceholder('Early'); 
		this.secondDateInputDisplayLocator = page.getByPlaceholder('Continuous'); 
		this.previousMonthButtonLocator = page.locator("css=button[class*='rdrPprevButton']");
		this.nextMonthButtonLocator = page.locator("css=button[class*='rdrNextButton']");
		this.monthPickerLocator = page.getByRole('combobox').filter({ hasText: /^JanuaryFebruaryMarchAprilMayJuneJulyAugustSeptemberOctoberNovemberDecember$/ });
		this.yearPickerLocator = page.getByRole('combobox').nth(1);
		this.firstCalendarMonthYearLocator = page.locator("xpath=(//div[contains(@class,'rdrMonthsHorizontal')]/div[@class='rdrMonth']/div[@class='rdrMonthName'])[1]");
		this.secondCalendarMonthYearLocator = page.locator("xpath=(//div[contains(@class,'rdrMonthsHorizontal')]/div[@class='rdrMonth']/div[@class='rdrMonthName'])[2]");
		/* Other version of the locators:
		this.firstDateInputDisplayLocator = page.locator("xpath=//input[@placeholder = 'Early']");
		this.secondDateInputDisplayLocator = page.locator("xpath=//input[@placeholder = 'Continuous']");
		this.monthPickerLocator = page.locator("css=span.rdrMonthAndYearPickers .rdrMonthPicker select");
		this.yearPickerLocator = page.locator("css=span.rdrMonthAndYearPickers .rdrYearPicker select");
		*/
	}

	/**
	* It is used to get the locator of a day located in one of the calendars.
	* @param day - String of the number day to located in one of the calendars. 
	* @param calendar - Number of the calendar in which the day must be located. 
	* @returns Locator of the day.
	*/
	async getDayInCalendarLocator(day: string, calendar: number): Promise<Locator> {
		return this.page.locator(`xpath=(//button[not(contains(@class,"rdrDayPassive"))]//span[contains(@class, "rdrDayNumber")][span = ${day.toString()}]) [${calendar}]`);

	}

	/**
	* It is used to click a day in one of the calendars using a date received.
	* @param date - Date wanted to click on one of the calendars. 
	*/
	async clickDay(date: Date): Promise<void> {
		//Getting the year and month of the date received. 
		const yearReceived: number = date.getUTCFullYear();
		const monthReceived = MONTHS[date.getUTCMonth()].month;

		//Getting the months and years of the first and second calendars.
		let firstCalendarMonthYear: string = await this.firstCalendarMonthYearLocator.innerText();//E.g value: "Jan 2023"
		let currentMonthFirstCalendar = GET_MONTH_BY_ABBRNAME(firstCalendarMonthYear.substring(0, 3));
		
		let secondCalendarMonthYear:string = await this.secondCalendarMonthYearLocator.innerText();//E.g value: "Feb 2023"
		let currentMonthSecondCalendar = GET_MONTH_BY_ABBRNAME(secondCalendarMonthYear.substring(0, 3));

		let monthYearSelected: string = firstCalendarMonthYear;
		let yearSelected: string  = monthYearSelected.substring(4);

		if ( !this.isYearInValidRange( yearReceived ) ){
			console.log("Failure - Year displayed in first calendar is out of valid range.");
		}

		//The year received is not the same that the year displayed in the calendars?
		if( yearReceived != parseInt(yearSelected) ){
			//Then change the year selected using the year picker. 
			await this.selectYear(yearReceived);
			//Update the values because are neccesary for validations.
			firstCalendarMonthYear = await this.firstCalendarMonthYearLocator.innerText();
			secondCalendarMonthYear = await this.secondCalendarMonthYearLocator.innerText();
			monthYearSelected = firstCalendarMonthYear;
			yearSelected = monthYearSelected.substring(4);
		}

		//The month received is not one of the months displayed in the calendars?
		if( monthReceived.abbrName != currentMonthFirstCalendar?.month.abbrName && monthReceived.abbrName != currentMonthSecondCalendar?.month.abbrName ){
			//Then change the month selected using the month picker.
			await this.selectMonth(monthReceived.fullName);
			//Update the values because are neccesary for validations.
			firstCalendarMonthYear = await this.firstCalendarMonthYearLocator.innerText();
			currentMonthFirstCalendar = GET_MONTH_BY_ABBRNAME(firstCalendarMonthYear.substring(0, 3));
		
			secondCalendarMonthYear = await this.secondCalendarMonthYearLocator.innerText();
			currentMonthSecondCalendar = GET_MONTH_BY_ABBRNAME(secondCalendarMonthYear.substring(0, 3));

			monthYearSelected = await this.firstCalendarMonthYearLocator.innerText();
		}

		const monthYearReceived: string = monthReceived.abbrName + " " + yearReceived;
		const dayReceived: number = date.getUTCDate();

		//Evaluate in which calendar the day must be clicked and click the day
		if ( monthYearReceived == firstCalendarMonthYear ){
			this.dayInCalendarLocator = await this.getDayInCalendarLocator(dayReceived.toString(), 1);
			await this.dayInCalendarLocator.click();

		} else if ( monthYearReceived == secondCalendarMonthYear ){
			this.dayInCalendarLocator = await this.getDayInCalendarLocator(dayReceived.toString(), 2);
			await this.dayInCalendarLocator.click();
		} else {
			throw new Error (`Failure - Day in the date ${date} was not found in neither calendar.`);
		}

	}

	/**
	* It is used to check if a year is in the valid range of minus 100 years and plus 20 years from the current date.
	* @param year - Year to check. 
	* @returns Boolean of the year validity. 
	*/
	isYearInValidRange( year: number ): boolean {
		const currentDate: Date = new Date();
		const minValidYear: number = currentDate.getFullYear() - 100;
		const maxValidYear: number = currentDate.getFullYear() + 20;
		return year >= minValidYear && year <= maxValidYear;

	}

	/**
	* It is used to open the month dropdown and click a month.
	* @param fullNameMonth - Name of the month to click in the month dropdown. 
	*/
	async selectMonth(fullNameMonth: string): Promise<void> {
		await this.monthPickerLocator.click();
		const index: number = MONTHS.findIndex(obj => obj.month.fullName == fullNameMonth);
		await this.monthPickerLocator.selectOption(index.toString());

	}

	/**
	* It is used to open the year dropdown and click a year.
	* @param year - Year to click in the year dropdown. 
	*/
	async selectYear(year: number): Promise<void> {
		const isYearValid = this.isYearInValidRange(year);
		if (isYearValid) {
			await this.yearPickerLocator.click();
			await this.yearPickerLocator.selectOption(year.toString());
		} else {
			console.log(`Failure - The year ${year} received is out the valid range.`);
			throw new Error (`Failure - The year ${year} received is out the valid range.`);
		}

	}

	/**
	* It is used to check if the input dates displayed are the correct ones after clicked two dates.
	* @param expectedStartDate - First date clicked in one of the calendars. 
	* @param expectedEndDate - Second date clicked in one of the calendars.
	*/
	async compareRangeInputDatesWithClickedDates(expectedStartDate: Date, expectedEndDate: Date): Promise<void> {
		if(expectedStartDate <= expectedEndDate){
			await expect(this.firstDateInputDisplayLocator).toHaveValue(this.buildInputDate(expectedStartDate));
			await expect(this.secondDateInputDisplayLocator).toHaveValue(this.buildInputDate(expectedEndDate));
		} else {
			await expect(this.firstDateInputDisplayLocator).toHaveValue(this.buildInputDate(expectedEndDate));
			await expect(this.secondDateInputDisplayLocator).toHaveValue(this.buildInputDate(expectedStartDate));
		}

	}
	
	/**
	* It is used to get a string of the date received to compare with the calendars Date input displayed in the calendars.
	* @param date - Date to transform in the format used in the input date.
	* @returns String of the date in a especif format. E.g "Feb 6, 2023".
	*/
	private buildInputDate(date: Date): string {
		const year: number = date.getUTCFullYear();
		const monthIndex: number = date.getUTCMonth();
		const abbrMonth: string = MONTHS[monthIndex].month.abbrName; //Abbreviated month name
		const day: number = date.getUTCDate();
		return abbrMonth + " " + day + "," + " " + year;//E.g "Feb 6, 2023".

	}

}