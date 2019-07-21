


//==================================
//  GLOBAL VARIABLES
//==================================




//===============================  Start of on load  =======================
$(() => {








//==================================
//  EVENT LISTENERS
//==================================



$(() => {
  $('form').on('submit', (event) => {

    const zipCode = $('#input-box').val();

    // Remove resultsContainer's children from previous searches
    $(".forecastContainer").children().text("");

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
        let forecastDay = 0; // tag each day with its position in the forecast
        let firstDay = [0];
        let dayClass = "";
        let currentYear = [];
        let currentMonth = [];
        let currentDay = [];
        let currentTime = 0;
        let currentHour = [];
        let temperature = [];
        let humidity = [];
        let windSpeed = [];
        let windDirection = [];
        let conditions = [];
        let currentClass = [];   // store the day class for each datapoint
        let tempFaherenheit = 0;
        let rowClass = [];

        // console.log("Mo/Day/Yr  Time     Temp(F)  Humidty(%)  Wind(mph)  Wind(deg)  Conditions");

        //===============================================================
        //  PARSE THE DATA ELEMENTS OF INTEREST AND STORE THEM IN ARRAYS
        //===============================================================
        for (let i = 0; i < 40; i++) {

          //=========================================================
          //  PARSE WEATHER DATA AND CONVERT UNITS
          //=========================================================

          // Pull the temperature and convert it from Kelvin to Fahrenheit
          temperature[i] = (Math.floor((((data.list[i].main.temp -273.15) * 9/5) + 32) * 100))/100;

          // Pull the windSpeed and convert it from meters/sec to mph
          windSpeed[i] = Math.floor(data.list[i].wind.speed * 223.7) / 100;

          windDirection[i] = (Math.floor(data.list[i].wind.deg * 100)) / 100;
          humidity[i] = data.list[i].main.humidity;
          conditions[i] = data.list[i].weather[0].description

          //================================================================
          //  PARSE DATE AND TIME, CORRECT FOR TIME ZONE, ADJUST ACCORDINGLY
          //================================================================
          let dateTime = (data.list[i].dt_txt).split("-");
          let timeSplit = dateTime[2].split(" ");
          currentYear [i] = dateTime[0];
          currentMonth [i] = dateTime[1];
          currentDay [i] = timeSplit[0];
          currentTime = timeSplit[1];
          let hourMinSec = currentTime.split(":");
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


          // Check for the start of a new day;
          if (currentDay[i] !== currentDay[dayStart]) {
            dayCounter++;
            dayStart = i;
            firstDay.push(dayStart);
            dayClass = "day" + dayCounter;
          } else {
            dayClass = "day" + dayCounter;
          }

          rowClass[i] = dayClass;

          // Console log each row of data
          // console.log(`${currentMonth[i]}/${currentDay[i]}/${currentYear[i]}  ${currentHour[i]}   ${temperature[i]}   ${humidity[i]}   ${windSpeed[i]}  ${windDirection[i]}   ${conditions[i]}   ${rowClass[i]}`);








        }  // Close the for loop


        // Loop through the local days to create each day header
        for (let j = 0; j <=firstDay.length-1; j++) {
          let $dayHeader = $('<p>');
          $dayHeader.text(`Forecast for ${data.city.name} on ${currentMonth[firstDay[j]]}/${currentDay[firstDay[j]]}/${currentYear[firstDay[j]]}`);
          // Replace the console log with appending to forecast container
          // Assign the corresponding rowClass to each day header
          // dayHeader should be centered via css

          // console.log(dayHeader);
          $dayHeader.addClass(rowClass[firstDay[j]]);
          $('.forecastContainer').append($dayHeader);
        }

        // Create the column header (assign all 6 class to the column header)
        // Replace console log with appending to the forecast container
        let $header1 = $('<p>');
        let $header2 = $('<p>');
        $header1.text(`      Humidity Temp  Wind  Direction  `);
        $header2.text(`  Time   (%)   (F)   (mph)  (deg)  Conditions`);

        $('.forecastContainer').append($header1);
        $('.forecastContainer').append($header2);

        let $dataRows = $('<ul>');
        $('.forecastContainer').append($dataRows);


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


          // let mphLength = (fixedSpeed.toString()).length;
          // console.log(fixedSpeed + "     " + fixedSpeed.toString() + "    " + mphLength);

          let tempLength = (temperature[i].toString()).length;
          let humLength = (humidity[i].toString()).length;
          let mphLength = (windSpeed[i].toString()).length;
          let degLength = (windDirection[i].toString()).length;

          // let rowString = [];

          // Make all temperature entries 6 characters long
          if (6 - tempLength > 0) {
            for (let j = 0; j < (6 - tempLength); j++) {
              tempSpace += " ";
            }
          }
          temperature[i] = tempSpace + temperature[i];


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

          let $rowString = $('<li>');
          $rowString.text(`${currentHour[i]} ${humidity[i]} ${temperature[i]}  ${windSpeed[i]}  ${windDirection[i]}  ${conditions[i]}`);
          $rowString.addClass(rowClass[i]);
          $rowString.addClass('dataLine');
          $dataRows.append($rowString);

          // $dayHeader.addClass(rowClass[firstDay[j]]);
          // $('.forecastContainer').append($dayHeader);

    }    // Close the for loop

        // Append each row of the data to the forecast container
        // replace with appending
        // for (let i = 0; i < 40; i++) {
        //   console.log(`${currentMonth[i]}/${currentDay[i]}/${currentYear[i]}  ${currentHour[i]}   ${temperature[i]} ${humidity[i]}  ${windSpeed[i]}  ${windDirection[i]}   ${conditions[i]}`);
        // }

        $('.day0').css('display', 'none');
        $('.day1').css('display', 'none');
        $('.day2').css('display', 'none');
        $('.day3').css('display', 'none');
        $('.day4').css('display', 'none');
        $('.day5').css('display', 'block');




      })



    // reset the form and prevent default actions
        $(event.currentTarget).trigger('reset')
        event.preventDefault();


  })
})





















//===============================  End of on load  =======================
})
