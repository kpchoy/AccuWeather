var secretKey = config.SECRET_KEY;

$(document).ready(function() {
  
  function getLocationKey(zip) {
    let link = "http://dataservice.accuweather.com/locations/v1/postalcodes/US"
      + "/search?apikey=" + secretKey + "&q=" 
      + zip + "&language=en-us&details=false";
    console.log(link);

    $.getJSON(link)
      .done(function(data) {
        let locationKey = data[0].Key;
        let state = data[0].AdministrativeArea.EnglishName;
        let city = data[0].EnglishName;
        let html = city + ", " + state;

        $("#cityName").html(html);

        getForcastLocation(locationKey);
      })
      .fail(function( textStatus, error ) {
        var err = textStatus + ", " + error;
        console.log( "Request Failed: " + err );
      });
  }


  function getForcastLocation(zip) {
    let link = "http://dataservice.accuweather.com/currentconditions/v1/" 
      + zip + "?apikey=" + secretKey + "&language=en-us&details=false";

   
    console.log(link);

    $.getJSON(link)
      .done(function(data) {
      // console.log(data);
        //  debugger
        var conditions = data[0];
        var temp = conditions.Temperature.Imperial;
        let html = conditions.WeatherText + ", " + temp.Value + " " + temp.Unit;
        $("#currentConditions").html(html);

        let iconNum = data[0].WeatherIcon;
        if (iconNum < 10) {
          iconNum = "0" + iconNum;
        }
        let icon = "https://apidev.accuweather.com/developers/Media/Default"
          + "/WeatherIcons/" + iconNum + "-s.png";
        $("#weather-img").attr("src", icon);
      })
      .fail(function(textStatus, error) {
        let html = "No info at this time";
        $("#currentConditions").html(html);
      });

  }

  var zip = '94066';
  // getForcastLocation(zip);
  getLocationKey(zip);
});