

//==================================
//  GLOBAL VARIABLES
//==================================

let dayTracker = 0;    // Tracks which forecast day is being displayed
let highestIndex = 0;  // Trackis the highest index of forecast days


//===============================  Start of on load  =======================
$(() => {

  //========================================================================
  //  3 EVENT LISTENERS - submit zip code, previous, next
  //========================================================================

  //===========================================
  //  EVENT LISTENER FOR NEXT DAY BUTTON
  //===========================================
  $('.next').on('click', () => {                 // advance to the next day
    let currentDayClass = '.day' + dayTracker;   // string for current day class
    if (dayTracker < highestIndex) {             // don't go beyond forecast
      $(currentDayClass).css('display', 'none'); // hide current day's forecast
      dayTracker++;                              // advance to next day
      newDayClass = '.day' + dayTracker;         // create string for new class
      $(newDayClass).css('display', 'block');    // display new forecast day
    }

    // if the highest index has been reached, before or now, only gray the button
    if (dayTracker === highestIndex) {
      $('.next').css('background-color', 'gray');
    }

    // If the forecast has advanced off of day 0, ungray the previous button
    if (dayTracker > 0) {
      $('.previous').css('background-color', 'lightgray');
    }

  })  // End of next


  //===========================================
  //  EVENT LISTENER FOR PREVIOUS DAY BUTTON
  //===========================================
  $('.previous').on('click', () => {             // advance to the previous day
    let currentDayClass = '.day' + dayTracker;   // string for current day class
    if (dayTracker > 0) {                        // can't go into the past
      $(currentDayClass).css('display', 'none'); // hide current day's forecast
      dayTracker--;                              // advance to previous day
      newDayClass = '.day' + dayTracker;         // create string for new class
      $(newDayClass).css('display', 'block');    // display new forecast day
    }

    // if 0 index has been reached, before or now, only gray the button
    if (dayTracker === 0) {
      $('.previous').css('background-color', 'gray');
    }

    // If the forecast has advanced off of the highest index, ungray the next button
    if (dayTracker < highestIndex) {
      $('.next').css('background-color', 'lightgray');
    }

  })  // end of previous


  //===========================================
  //  EVENT LISTENER FOR ZIP CODE SUBMIT BUTTON
  //===========================================
  $('form').on('submit', (event) => {              // Submit the zip code

    const zipCode = $('#input-box').val();         // zip code value

    // ensure the entered zip code is a 5-digit number
    if (isNaN(zipCode) || zipCode.length !== 5) {
      alert('Not a 5-digit number, please try again');
    }

    // Remove resultsContainer's children from previous searches
    $(".forecastContainer").children().remove();

    // Turn previous button gray and next light gray,
    // since the forecast will start on day 0
    $('.previous').css('background-color','gray');
    $('.next').css('background-color','lightgray');    

    //=========================================================
    //  START OF AJAX
    //=========================================================
    $.ajax({        // Add the zip code to the url to pull the desired data
      url: "http://api.openweathermap.org/data/2.5/forecast?zip=" + zipCode + ",us&APPID=5d118fc36b1c769a2923778a4df26bd0"
    }).then(


      //=========================================================
      //  START OF DATA BLOCK - MOST OF THE WORK HAPPENS HERE
      //=========================================================
      (data) => {  // returns an array of 40 data.list objects (8/day x 5 days)

        //=================================================================
        //  DECLARE VARIABLES THAT NEED TO BE VISIBLE THROUGHOUT THIS BLOCK
        //=================================================================
        let dayCounter = 0; // count the number of days in the forecast (5 or 6)
        let dayStart = 0;   // index for the first datapoint in a new day
        let firstDay = [0];  // array of indices of the first entry for each day
        let dayClass = "";    // used to generate classes for each day
        let currentYear = [];   // array of year entries for each forecast entry
        let currentMonth = [];  // array of month entries for each forecast entry
        let currentDay = [];    // array of day entries for each forecast entry
        let currentTime = 0;    // used in parsing the time string into hh:mm:ss
        let currentHour = [];   // array of hour entries for each forecast entry
        let temperature = []; // array of temperatures for each forecast
        let humidity = [];  // array of humidity entries for each forecast entry
        let windSpeed = []; // array of windSpeed entries for each forecast entry
        let windDirection = []; // array of windDirection for each forecast
        let conditions = []; // array of conditions for each forecast entry
        let rowClass = [];
        dayTracker = 0;       // reset current day to day 0

        // let forecastDay = 0; // tag each day with its position in the forecast
        // let currentClass = [];   // store the day class for each datapoint
        // let tempFaherenheit = 0;

        // console.log("Mo/Day/Yr  Time     Temp(F)  Humidty(%)  Wind(mph)  Wind(deg)  Conditions");

        //===============================================================
        //  PARSE THE DATA ELEMENTS OF INTEREST AND STORE THEM IN ARRAYS
        //===============================================================
        for (let i = 0; i < 40; i++) {    // loop through all 40 data points

          //=========================================================
          //  PARSE WEATHER DATA AND CONVERT UNITS
          //=========================================================

          // Pull the temperature, convert from Kelvin to Fahrenheit, store
          temperature[i] = (Math.floor((((data.list[i].main.temp -273.15) * 9/5) + 32) * 100))/100;

          // Pull the windSpeed, convert from meters/sec to mph, store
          windSpeed[i] = Math.floor(data.list[i].wind.speed * 223.7) / 100;

          // round the wind direction to 2 decimal places, store
          windDirection[i] = (Math.floor(data.list[i].wind.deg * 100)) / 100;

          humidity[i] = data.list[i].main.humidity;           // store humidity
          conditions[i] = data.list[i].weather[0].description // store description

          //================================================================
          //  PARSE DATE AND TIME, CORRECT FOR TIME ZONE, ADJUST ACCORDINGLY
          //================================================================
          let dateTime = (data.list[i].dt_txt).split("-");  // split year/month
          let timeSplit = dateTime[2].split(" ");          // grab day/time
          currentYear [i] = dateTime[0];               // store year
          currentMonth [i] = dateTime[1];              // store month
          currentDay [i] = timeSplit[0];               // store day
          currentTime = timeSplit[1];                  // grab time
          let hourMinSec = currentTime.split(":");     // split hh:mm:ss
          // Calculate the current local time using UTC time and offset
          let theHour = parseInt(hourMinSec[0]) + data.city.timezone/3600;

          // If the shift to local time makes the local hour negative,
          // add 24 hours and decrement the day
          if (theHour < 0) {
            theHour += 24;
            let fixDay = parseInt(currentDay[i]);  // convert to int
            fixDay--;                              // subtract a day

            // If the day was decremented to 0, decrement the month
            if (fixDay == 0) {
              let fixMonth = parseInt(currentMonth[i]);
              fixMonth--;

              // If the month was decremented to 0, decrement the year
              if (fixMonth == 0) {
                fixMonth = 12;
                let fixYear = parseInt(currentYear[i]);  // convert to int
                fixYear--;                               // decrement
                currentYear[i] = fixYear.toString();     // Year to string
              }

              // Check whether it's a leapYear
              let leapYear = 0;
              if (parseInt(currentYear[i]) % 4 === 0) {
                leapYear = 1;
              }

              // Now that the month was decremented (& year, if needed)
              // Set the day to the end of the decremented month
              switch (fixMonth) {
                case 1: fixDay = 31; break;
                case 2: fixDay = 28 + leapYear; break;
                case 3: fixDay = 31; break;
                case 4: fixDay = 30; break;
                case 5: fixDay = 31; break;
                case 6: fixDay = 30; break;
                case 7: fixDay = 31; break;
                case 8: fixDay = 31; break;
                case 9: fixDay = 30; break;
                case 10: fixDay = 31; break;
                case 11: fixDay = 30; break;
                case 12: fixDay = 31; break;
              }
              currentMonth[i] = fixMonth.toString(); // Month to string
            }
            currentDay[i] = fixDay.toString();     // Day to string
          }


          // Convert the time to 4-digit 24-hour clock time as a string
          if (theHour < 10) {
            currentHour[i] = "0" + theHour.toString() + ":00:00";
          } else {
            currentHour[i] = theHour.toString() + ":00:00";
          }


          // is current data a continuation of current day or start of a new day?
          if (currentDay[i] !== currentDay[dayStart]) {   // if it's a new day
            dayCounter++;                          // increment the day count
            dayStart = i;                         // new day started with i
            firstDay.push(dayStart);              // add new dayStart to array
            dayClass = "day" + dayCounter;        // create new dayClass
          } else {                               // if not a new day
            dayClass = "day" + dayCounter;       // create dayClass w/current
          }

          rowClass[i] = dayClass;   // store the class for this row in an array

        }  // Close the for loop


        // Loop through the local days to create each day header
        for (let j = 0; j <=firstDay.length-1; j++) {
          let $dayHeader = $('<p>');
          $dayHeader.text(`Forecast for ${data.city.name} on ${currentMonth[firstDay[j]]}/${currentDay[firstDay[j]]}/${currentYear[firstDay[j]]}`);

          // append day header to the DOM
          $dayHeader.addClass(rowClass[firstDay[j]]);
          $dayHeader.addClass('cityDate');
          $('.forecastContainer').append($dayHeader);
        }

        // Create the column header
        let $header1 = $('<p>');
        let $header2 = $('<p>');
        $header1.text(`         Humidity  Temp  Wind  Direction  `);
        $header2.text(`   Time       (%)    (F)    (mph)   (deg)    Conditions`);

        // ensure white spaces aren't dropped so alignment is maintained
        $header1.css('white-space','pre');
        $header2.css('white-space','pre');

        // give each header line some class
        $header1.addClass('columnTop');
        $header2.addClass('columnBottom');

        // append column headers to the DOM
        $('.forecastContainer').append($header1);
        $('.forecastContainer').append($header2);

        // create an unordered list to hold all of the rows of data
        let $dataRows = $('<ul>');
        $('.forecastContainer').append($dataRows);  // append to the DOM


        // Fix the length of each data field and create a string for each row
        for (let i = 0; i < 40; i++) {
          let tempSpace = "";
          let humSpace = "";
          let mphSpace = "";
          let degSpace = "";

          // fix the real numbers to display all digits, even if 0's after '.'
          temperature[i] = temperature[i].toFixed(2)
          windSpeed[i] = windSpeed[i].toFixed(2);
          windDirection[i] = windDirection[i].toFixed(2);

          // Get the length of each number
          let tempLength = (temperature[i].toString()).length;
          let humLength = (humidity[i].toString()).length;
          let mphLength = (windSpeed[i].toString()).length;
          let degLength = (windDirection[i].toString()).length;

          // fixed space character that html won't ignore
          let spaceCharacter = String.fromCharCode(160);

          // Make all temp entries 6 characters long
          if (6 - tempLength > 0) {
            temperature[i] = spaceCharacter.repeat(6 - tempLength) + temperature[i];
          }

          // Make all humidity entries 3 characters long
          if (3 - humLength > 0) {
            for (let j = 0; j < (3 - humLength); j++) {
              humSpace += " ";
            }
          }
          humidity[i] = humSpace + humidity[i];

          // Make all windSpeed entries 5 characters long
          if (5 - mphLength > 0) {
            for (let j = 0; j < (5 - mphLength); j++) {
              mphSpace += " ";
            }
          }
          windSpeed[i] = mphSpace + windSpeed[i];

          // Make all windDirection entries 6 characters long
          if (6 - degLength > 0) {
            for (let j = 0; j < (6 - degLength); j++) {
              degSpace += " ";
            }
          }
          windDirection[i] = degSpace + windDirection[i];

          // create a list item to hold the row of data as a string
          let $rowString = $('<li>');
          $rowString.css('white-space', 'pre'); // ensure spaces won't be dropped
          $rowString.text(`${spaceCharacter.repeat(1)}${currentHour[i]}  ${spaceCharacter.repeat(3 - humLength)}${humidity[i]}  ${spaceCharacter.repeat(6 - tempLength)}${temperature[i]}  ${spaceCharacter.repeat(5 - mphLength)}${windSpeed[i]}   ${spaceCharacter.repeat(6 - degLength)}${windDirection[i]}   ${conditions[i]}`);

          // Give the row string some class and append it to the ul
          $rowString.addClass(rowClass[i]);
          $rowString.addClass('dataLine');
          $dataRows.append($rowString);

    }    // Close the for loop

        // store the value of the highest starting day index
        highestIndex = firstDay.length-1;

        // Display the first day's data and hide the other days
        $('.day0').css('display', 'block');
        $('.day1').css('display', 'none');
        $('.day2').css('display', 'none');
        $('.day3').css('display', 'none');
        $('.day4').css('display', 'none');
        $('.day5').css('display', 'none');

        // If there is an error, probably for invalid zip code, notify user
        (error) => {                         // This doesn't catch the error
          alert('Not a valid zip code');
        }
      })

    // reset the form and prevent default actions
        $(event.currentTarget).trigger('reset')
        event.preventDefault();

  })  // end of submit block


//===============================  End of on load  =======================
})
