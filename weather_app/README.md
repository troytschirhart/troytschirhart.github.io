
README for Weather App

The weather app enables users to obtain a five-day forecast in 3-hour increments by entering the zip code of their location of interest.  The user can then move through the forecast in forward and reverse, and can enter another zip code of interest.

The weather app can be accessed by following this link: https://troytschirhart.github.io/weather_app/index.html#

For this project, I used HTML, CSS, Javascript and jQuery.  This app uses AJAX to retrieve the desired forecast.  The data is returned in 40 increments (every 3 hours => 8/day x 5 days) and are time-tagged in Universal Time.  

The app converts the foreceast increments to local time, which causes some to increments to land in an earlier day, so the day is adjusted as well.  Since the day could be moved from the first of the month to the last day of the previous month, the app checks the length of the previous month (28, 29, 30 or 31) so the day can be assigned correctly.  Additionally, the move to the previous month could bridge the 1st of January to the 31st of December, so the app also corrects the year for any increments if necessary.

Once the date and time are adjusted, the forecast elements are grouped by local calendar day.  The temperature is converted from Kelvin to Fahrenheit and the windspeed is converted from meters per second to miles per hour.  Each increment is then tagged with a class corresponding to its calendar day and it is attached to the DOM.

The carousel starts with the current forecast day and users can advance and reverse through the days.  The carousel uses the assigned classes to hide and display the days.  

If the user enters another zip code, the app removes all of the elements that were appended to the DOM for the previous zip code before pulling the new data and repeating the above described process.

The app checks the user input to ensure that it's a 5-digit number.  If it contains letters or the wrong number of digits, an alert lets the user know that they need to re-enter the zip code.  Unfortunately, if the user enters a 5-digit number that's not a valid zip code, they will see no response from the app.  Behind the scenes, the API returns a 404 - not found error for an invalid zip code which can be seen on the console.  I included an instruction in the AJAX code to display an "invalid zip code" alert if an error is received from the API, but for some reason it doesn't work.  

The API supports searches based on city and country, but there are multiple cities in the US with the same name.  For example, there are 7 cities named Glendale.  I tried to pull the forecast for Glendale Arizona, but only the forecast for Glendale California was returned.  I tried multiple variations of the search and either received errors or the California forecast.  Therefore I elected to use zip codes for the search parameter because they are unique.  However, I think most users would prefer to search based on city and state.  An improvement I would like to make to the app would be to add a front end that allows users to enter city and state, and then pulls the corresponding zip code and submits that to the API for the user.    
  
