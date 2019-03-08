var secretKey = config.SECRET_KEY;

$(document).ready(function() {
  
  function getLocationKey(zip) {
    let link = "http://dataservice.accuweather.com/locations/v1/postalcodes/US"
    + "/search?apikey=" + secretKey + "&q=" + zip + "&language=en-us&details=false";

    $.getJSON(link)
      .done(function(data) {
        let locationKey = data[0].Key;
        getForcastLocation(locationKey);
      })
      .fail(function( textStatus, error ) {
        var err = textStatus + ", " + error;
        console.log( "Request Failed: " + err );
    
    });
  }


  function getForcastLocation(zip) {
    let link = "http://dataservice.accuweather.com/forecasts/v1/daily/1day/" 
      + zip + "?apikey=" + secretKey + "&language=en-us&details=false&metric=false";

   
    console.log(link);

    $.getJSON(link)
      .done(function(data) {
      // console.log(data);
        var conditions = data[0];
        var temp = conditions.Temperature.Imperial;
        let html = conditions.WeatherText + ", " + temp.Value + " " + temp.Unit;
      })
      .fail(function(textStatus, error) {
        let html = "No info at this time";
      });

  }

  var zip = '94066';
  // getForcastLocation(zip);
  getLocationKey(zip);
});