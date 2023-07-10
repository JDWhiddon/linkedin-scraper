const axios = require('axios');
const cheerio = require('cheerio');
const ObjectsToCsv = require('objects-to-csv');
//You should only need to change the parameters below
//Search query: ex. Software engineering internship summer 2024
//Put words that MUST be included in quotation marks
let keywords = 'software engineering "intern" 2024';

//Location of job search
let location = 'United States';

//Delay that will be applied each iteration of the for loop,
const waitDelay = 1700;

//More parameters are on line 62, allows more specific searches.

//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////

const formattedKeywords = keywords.replace(/ /g, '%');
const formattedLocation = location.replace(/ /g, '%');

const date = new Date();

// When a post is created in the last 24 hours, the date is returned as an empty string. This fixes that
let currentDay = String(date.getDate()).padStart(2, '0');
let currentMonth = String(date.getMonth() + 1).padStart(2, '0');
let currentYear = date.getFullYear();
let currentDate = `${currentMonth}/${currentDay}/${currentYear}`;

//Helps the program know to terminate if no more job posts are being returned
let hasPosts = false;

async function delay(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

(async function scrapeLinkedInJobs() {
    //The maximum number of posts that LinkedIn returns for a single query is 1000, each request can return 25 at a time.
	for (let pageNumber = 0; pageNumber < 1000; pageNumber += 25) {
		const linkedinJobs = [];
		let url = `https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=${encodeURIComponent(formattedKeywords)}&location=${encodeURIComponent(formattedLocation)}&geoId=103644278&trk=public_jobs_jobs-search-bar_search-submit&start=${pageNumber}`;
		await axios(url)
			.then(response => {
				const html = response.data;
				const $ = cheerio.load(html);

				const jobs = $('li');

				jobs.each((index, element) => {
					hasPosts = true;
					const jobTitle = $(element).find('h3.base-search-card__title').text().trim();
					const jobCompany = $(element).find('h4.base-search-card__subtitle').text().trim();
					const jobLocation = $(element).find('span.job-search-card__location').text().trim();
					const jobUrl = $(element).find('a.base-card__full-link').attr('href');
					let listDate = $(element)
						.find('.job-search-card__listdate')
						.attr('datetime');

					if (!listDate || listDate.trim() === '') {
						listDate = currentDate; // Set listDate to today's date
					}

					//Include or exclude certain criteria below
					if (jobTitle.toLowerCase().includes('intern')) {
						linkedinJobs.push({
							'Title': jobTitle,
							'Company': jobCompany,
							'Location': jobLocation,
							'Link': jobUrl,
							'Date': listDate
						});
					} else {}
				});

				const csv = new ObjectsToCsv(linkedinJobs);
				return csv.toDisk('./linkedInJobs.csv', {
					append: true
				});
			})
			.then(() => {
				console.log(`${pageNumber} Entries processed and data written to CSV.`);
			})
			.catch(error => {
				console.error(error);
				hasPosts = true;
			});

		//If there are no more job posts for the search query, exit the program.
		if (!hasPosts) {
			console.log("No more job posts.");
			process.exit(0);
		}
		hasPosts = false;

		// Pause at the end of each iteration, adjust if necessary
		if (pageNumber < 975) {
			await delay(waitDelay);
		}
	}
})();