# Disclaimer 
While web scraping is legal, **this tool is not designed to be put into practice and is just an educational resource** on how web scraping
would be implemented using JavaScript. 

# LinkedIn Job Scraper
A tool for searching LinkedIn job posts and compiling them into a .CSV file!

## Installation Instructions
1. <a href="https://nodejs.org/en/download" target="_blank">Install NPM and Node.js</a> Check if you have the right version by using "node -v"

4. Clone the repository

5. Change the parameters on lines 7-13 to your liking.

    The "keywords" variable is the search query that will be used to search listings on LinkedIn. This allows you to use boolean expressions
  and quotation marks to narrow down your search.
  
    The "location" variable is the location where you want to search for listings. You may also change this to "remote".
  
    There is an additional if statement on line 65 that you may adjust to make the searches more specific.

## Use
This web scraper uses Axios to fetch HTML from LinkedIn and Cheerio to parse it for data that will be written to the .CSV file. 
The necessary dependencies are already included in the repository.

The program will append the job postings to the existing .CSV file in the repository. 
You can open the file in Excel and filter the postings as desired. Please note that the program can only retrieve the first 1000 job posts per search query. 
Attempting to fetch more will result in a 404 error from LinkedIn.

## Errors
If you make too many requests without increasing the delay, LinkedIn may time you out. This will cause the program to skip 25 entries per bad request.
