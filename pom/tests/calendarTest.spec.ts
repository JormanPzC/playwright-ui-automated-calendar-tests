import { test } from '@playwright/test';
import { CalendarPage } from '../pages/calendars-page';
import { CALENDAR_SITE } from '../data/constants';
import { addDays, randomUpperDate, randomUnderMonthDate } from './utils';

test.describe('Test Suite - Main TC: Ensures the basic functionality for selecting dates is working properly', () => {
	
	test.beforeEach(async ({ page }) => {
        await page.goto(CALENDAR_SITE);

    });
	
	test('TC001: "Start date" = today AND "End date" = today + 7', async ({ page }) => {
		const calendarPage = new CalendarPage(page);
	
		//GIVEN "Today" as Start date.
		const currentUTCDate: Date = new Date();
		console.log("currentUTCDate", currentUTCDate);
	
		//	Convert UTC time to local time.
		const expectedStartDate: Date = new Date(currentUTCDate.getTime() - currentUTCDate.getTimezoneOffset() * 60 * 1000);
		console.log("expectedStartDate", expectedStartDate);
		
		//AND "Today + 7" as End date.
		const expectedEndDate: Date = addDays(expectedStartDate, 7);
		console.log("expectedEndDate", expectedEndDate);
	
		//WHEN selecting these days in the calendars.
		await calendarPage.clickDay(expectedStartDate);
		await calendarPage.clickDay(expectedEndDate);
	
		//THEN Calendar input range dates match.
		await calendarPage.compareRangeInputDatesWithClickedDates(expectedStartDate, expectedEndDate);
		console.log("TC001 Test completed.");
	
	});

	test('TC002: "Start date" = random day in the future AND "End date" = Start date + 21', async ({ page }) => {
		const calendarPage = new CalendarPage(page);
	
		//GIVEN "Random day in the future" as Start date.
		const expectedStartDate: Date = randomUpperDate();
		console.log("expectedStartDate", expectedStartDate);
	
		//AND "Start day + 21" as End date.
		const expectedEndDate: Date = addDays(expectedStartDate, 21);
		console.log("expectedEndDate", expectedEndDate);
	
		//WHEN selecting these days in the calendars.
		await calendarPage.clickDay(expectedStartDate);
		await calendarPage.clickDay(expectedEndDate);
	
		//THEN Calendar input range dates match.
		await calendarPage.compareRangeInputDatesWithClickedDates(expectedStartDate, expectedEndDate);
		console.log("TC002 Test completed.");
	
	});

	test('TC003: "Start date" = random day in the previous month AND "End date" = Start date + 5', async ({ page }) => {
		const calendarPage = new CalendarPage(page);
	
		//GIVEN "Random day in the previous month" as Start date
		const expectedStartDate: Date = randomUnderMonthDate();
		console.log("expectedStartDate", expectedStartDate);
	
		//AND "Start day + 5" as End date.
		const expectedEndDate: Date = addDays(expectedStartDate, 5);
		console.log("expectedEndDate", expectedEndDate);
	
		//WHEN selecting these days in the calendars.
		await calendarPage.clickDay(expectedStartDate);
		await calendarPage.clickDay(expectedEndDate);
	
		//THEN Calendar input range dates match.
		await calendarPage.compareRangeInputDatesWithClickedDates(expectedStartDate, expectedEndDate);
		console.log("TC003 Test completed.");
	
	});

});
