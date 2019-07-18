

//===============================  Start of on load  =======================
$(() => {



  $.ajax({
    url: "http://api.openweathermap.org/data/2.5/forecast?zip=80922,us&APPID=5d118fc36b1c769a2923778a4df26bd0",
  }).then(
    (data) => {
      console.log("forecast date and UTC time: " + data.list[0].dt_txt);
      console.log("temperature in degrees Kelvin: " + data.list[0].main.temp);
      console.log("percent humidity: " + data.list[0].main.humidity);
      console.log("wind speed in meters per second: " + data.list[0].wind.speed);
      console.log("direction from which wind originates in degrees: " + data.list[0].wind.deg);
      console.log("overall weather conditions: " + data.list[0].weather[0].description);
    }
  )













//===============================  End of on load  =======================
})
