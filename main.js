var secretKey = config.SECRET_KEY;

$(document).ready(function() {
  
  function getLocationKey(zip) {
    let link = "http://dataservice.accuweather.com/locations/v1/postalcodes/US"
      + "/search?apikey=" + secretKey + "&q=" 
      + zip + "&language=en-us&details=false";
    console.log("locationKey",link);

    $.getJSON(link)
      .done(function(data) {
        let locationKey = data[0].Key;
        let state = data[0].AdministrativeArea.EnglishName;
        let city = data[0].EnglishName;
        let html = city + ", " + state;

        $("#city-name").html(html);

        getForcastLocation(locationKey);
        getTodaysForcast(locationKey);
      })
      .fail(function( textStatus, error ) {
        var err = textStatus + ", " + error;
        console.log( "Request Failed: " + err );
      });
  }


  function getForcastLocation(zip) {
    let link = "http://dataservice.accuweather.com/currentconditions/v1/" 
      + zip + "?apikey=" + secretKey + "&language=en-us&details=false";
    console.log("forcatlocation",link);

    $.getJSON(link)
      .done(function(data) {
      // console.log(data);
        //  debugger
        var conditions = data[0];
        var temp = conditions.Temperature.Imperial;
        let html = conditions.WeatherText + ", " + temp.Value + " " + temp.Unit;
        $("#current-conditions").html(html);

        let iconNum = data[0].WeatherIcon;
        let icon = iconLinkGen(iconNum);
        $("#weather-img").attr("src", icon);
      })
      .fail(function(textStatus, error) {
        let html = "No info at this time";
        $("#current-conditions").html(html);
      });

  }

  function getTodaysForcast(zip) {
    let link = "http://dataservice.accuweather.com/forecasts/v1/daily/1day/"
      + zip + "?apikey=" + secretKey + "&language=en-us&details=false";
    console.log("todays forcast", link);

    $.getJSON(link)
      .done(function(data) {
        // debugger;
        let date = data.DailyForecasts[0].Date.substring(0,10);
        let dayIconPhrase = data.DailyForecasts[0].Day.IconPhrase;
        let dayIcon = iconLinkGen(data.DailyForecasts[0].Day.Icon);

        let nightIconPhrase = data.DailyForecasts[0].Night.IconPhrase;
        let nightIcon = iconLinkGen(data.DailyForecasts[0].Night.Icon);

        let tempMin = data.DailyForecasts[0].Temperature.Minimum.Value + " "
          + data.DailyForecasts[0].Temperature.Minimum.Unit;
        let tempMax = data.DailyForecasts[0].Temperature.Maximum.Value + " "
          + data.DailyForecasts[0].Temperature.Maximum.Unit;
 
        $("#todays-date").html(date);
        $("#day-phrase").html(dayIconPhrase);
        $("#day-img").attr("src", dayIcon);
        $("#night-phrase").html(nightIconPhrase);
        $("#night-img").attr("src", nightIcon);
        $("#temp-min").html(tempMin);
        $("#temp-max").html(tempMax);

      })
      .fail(function(textStatus, error) {
        let html = "No info at this time";
        $("#forcast-items").html(html);
      });
  }

  var zip = '94066';
  // getForcastLocation(zip);
  getLocationKey(zip);
});

function iconLinkGen(iconNum) {
  if (iconNum < 10) {
    iconNum = "0" + iconNum;
  }
  return "https://apidev.accuweather.com/developers/Media/Default"
    + "/WeatherIcons/" + iconNum + "-s.png";
}