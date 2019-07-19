


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
        let firstDay = [];
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

        console.log("Mo/Day/Yr  Time     Temp(F)  Hum(%)  Wind(mph)  Wind(deg)  Conditions");

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
          dayClass = "day" + dayCounter;
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


          // Convert temperature from Kelvin to Fahrenheit



          // convert m/s to mph  =>  multiply the speed value by 2.237
          //  Example: 4.39 m/s * 2.237  = 9.82015 mph

          console.log(`${currentMonth[i]}/${currentDay[i]}/${currentYear[i]}  ${currentHour[i]}   ${temperature[i]}   ${humidity[i]}   ${windSpeed[i]}  ${windDirection[i]}   ${conditions[i]}`);
        }







//         console.log("forecast date and UTC time: " + data.list[0].dt_txt);
//         console.log("temperature in degrees Kelvin: " + data.list[0].main.temp);
// let tempFaherenheit = (Math.floor((((data.list[0].main.temp -273.15) * 9/5) + 32) * 100))/100
//
//         console.log("temperature in degrees Fahrenheit: " + tempFaherenheit);
//         console.log("percent humidity: " + data.list[0].main.humidity);
//         console.log("wind speed in meters per second: " + data.list[0].wind.speed);
//         console.log("direction from which wind originates in degrees: " + data.list[0].wind.deg);
//         console.log("overall weather conditions: " + data.list[0].weather[0].description);
//         console.log(data.city.name);
//         console.log(data.city.timezone/3600);

        const $leadIn = $('<p>').addClass('leadIn');
        $leadIn.text(`Forecast for ${data.city.name} on ${data.list[0].dt_txt}`)

        const $columnHead1 = $('<p>').addClass('columnHeader');
        $columnHead1.text(`                          wind  wind`);

        const $columnHead2 = $('<p>').addClass('columnHeader');
        $columnHead2.text(`time     temp     humidity     speed     direction     conditions`);

        $('.forecastContainer').append($leadIn);
        $('.forecastContainer').append($columnHead1);
        $('.forecastContainer').append($columnHead2);

        const $dayOne = $('<ul>').addClass('day');
        const $dayTime = $('<li>').text(data.list[0].dt_txt);
        const $temp = $('<li>').text(data.list[0].main.temp);
        $dayOne.append($dayTime);
        $dayOne.append($temp);
        $('.forecastContainer').append($dayOne);

        console.log(data);
      })



    // reset the form and prevent default actions
        $(event.currentTarget).trigger('reset')
        event.preventDefault();


  })
})





















//===============================  End of on load  =======================
})
