var secretKey = config.SECRET_KEY;

$(document).ready(function() {
  
  function getLocationKey(zip,date) {
    let link = "http://dataservice.accuweather.com/locations/v1/postalcodes/US"
      + "/search?apikey=" + secretKey + "&q=" 
      + zip + "&language=en-us&details=false";
    // console.log("locationKey",link);

    $.getJSON(link)
      .done(function(data) {
        // debugger; 
        if (typeof data[0] === "undefined") {
          $("#main").html("");
        }

        let locationKey = data[0].Key;
        let state = data[0].AdministrativeArea.ID.toUpperCase();
        let city = data[0].EnglishName.toUpperCase();
        let html = city + ", " + state;

        $("#city-name").html(html);

        get5DayForecast(locationKey, date);
      })
      .fail(function( ) {
        $("#main").html("");
      });
  }

  function get5DayForecast(zip, date) {
    let link = "http://dataservice.accuweather.com/forecasts/v1/daily/5day/"
    + zip + "?apikey=" + secretKey + "&language=en-us&details=false&metric=false";
    console.log("5 Day forcast", link);
    
    $.getJSON(link)
      .done(function(data) {
        let today = new Date(data.DailyForecasts[0].Date);

        let diff = dateDiff(today, date);

        // let day1;
        // if (diff !== 0) {
        //   $("#day1-day").html()
        // }

        let dayIconPhrase = data.DailyForecasts[0+diff].Day.IconPhrase;
        let dayIcon = iconLinkGen(data.DailyForecasts[0+diff].Day.Icon);
        let tempMin = data.DailyForecasts[0+diff].Temperature.Minimum.Value;
        let tempMax = data.DailyForecasts[0+diff].Temperature.Maximum.Value;
       
        $("#day-phrase").html(dayIconPhrase);
        $("#day-img").attr("src", dayIcon);
        $("#temp-min").html(tempMin);
        $("#temp-max").html(tempMax);

        let date2 = new Date(data.DailyForecasts[1+diff].Date);
        let date2Name = days[date2.getDay()];
        let day2IconPhrase = data.DailyForecasts[1+diff].Day.IconPhrase;
        let day2Icon = iconLinkGen(data.DailyForecasts[1+diff].Day.Icon);
        let temp2Min = data.DailyForecasts[1+diff].Temperature.Minimum.Value;
        let temp2Max = data.DailyForecasts[1+diff].Temperature.Maximum.Value;
        $("#day2-day").html(date2Name);
        $("#day2-phrase").html(day2IconPhrase);
        $("#day2-img").attr("src", day2Icon);
        $("#day2-temp-min").html(temp2Min);
        $("#day2-temp-max").html(temp2Max);

        let date3 = new Date(data.DailyForecasts[2+diff].Date);
        let date3Name = days[date3.getDay()];
        let day3IconPhrase = data.DailyForecasts[2+diff].Day.IconPhrase;
        let day3Icon = iconLinkGen(data.DailyForecasts[2+diff].Day.Icon);
        let temp3Min = data.DailyForecasts[2+diff].Temperature.Minimum.Value;
        let temp3Max = data.DailyForecasts[2+diff].Temperature.Maximum.Value;
        $("#day3-day").html(date3Name);
        $("#day3-phrase").html(day3IconPhrase);
        $("#day3-img").attr("src", day3Icon);
        $("#day3-temp-min").html(temp3Min);
        $("#day3-temp-max").html(temp3Max);

        
      })
      .fail(function(textStatus, error) {
        $("#main").html("");
      });

  }

  function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

  // Production 
  // run with live server
  // var zip = getParameterByName("zip_code");
  // getLocationKey(zip);

  // Test parameters to try not to overload 50 calls
  var zip = '94125';
  var date = new Date("3/13/19");
  getLocationKey(zip, date);
});

var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
var _MS_PER_DAY = 1000 * 60 * 60 * 24;

function iconLinkGen(iconNum) {
  if (iconNum < 10) {
    iconNum = "0" + iconNum;
  }
  return "https://apidev.accuweather.com/developers/Media/Default"
    + "/WeatherIcons/" + iconNum + "-s.png";
}

function dateDiff(a , b) {
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

