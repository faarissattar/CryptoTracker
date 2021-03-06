//THE REAL ONE
var curr = 'USD';
var input = document.getElementsByTagName("a");
var coin = input[0].id;
var priceElement = $("#priceBlock")
var percDifferent = $("#percentChange")
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");  
};

function getName(obj) {
    var t = $(obj).text();
    console.log(t);

    if(currency_names[t]==undefined) {
    alert(currency_symbols[currency_names]);
    }
    else{
        curr = nameToAbbreviation(t);
        generateChart(coin, curr);
        dispCurrentPrice(coin, curr);
        console.log("Currency Abbreviated: " + curr);
    };
    document.getElementById("myDropdown").classList.toggle("show");
    //console.log(document.getElementById("myDropdown")); 
};
function dispCurrentPrice(coin,currency){
    //var priceTxt = document.getElementById(id).innterText;
    //var priceTxt = priceElement.text();  
    console.log("Price text: " + priceElement.text());

    //console.log("in disp Current Price, id: " + id + "coin: " + coin + "currency: " + currency)
    $.getJSON('https://min-api.cryptocompare.com/data/price?fsym=' + coin + '&tsyms=' + currency, function(resp){
        console.log("Coin " + coin);
        console.log(resp["USD"])
        priceElement.text(currency_symbols[currency] + "" + resp[currency]);
    });
}

var currency_symbols = {
    'USD': '$', // US Dollar
    'EUR': '€', // Euro
    'CRC': '₡', // Costa Rican Colón
    'GBP': '£', // British Pound Sterling
    'ILS': '₪', // Israeli New Sheqel
    'INR': '₹', // Indian Rupee
    'JPY': '¥', // Japanese Yen
    'KRW': '₩', // South Korean Won
    'NGN': '₦', // Nigerian Naira
    'PHP': '₱', // Philippine Peso
    'PLN': 'zł', // Polish Zloty
    'PYG': '₲', // Paraguayan Guarani
    'THB': '฿', // Thai Baht
    'UAH': '₴', // Ukrainian Hryvnia
    'VND': '₫', // Vietnamese Dong
};
var currency_names = {
    'US Dollars':'USD',
    'Euros':'EUR', // Euro
    'Costa Rican Colóns': 'CRC', // Costa Rican Colón
    'British Pounds': 'GBP', // British Pound Sterling
    'Israeli New Sheqels': 'ILS', // Israeli New Sheqel
    'Indian Rupees': 'INR', // Indian Rupee
    'Yen': 'JPY', // Japanese Yen
    'South Korean Won':'KRW', // South Korean Won
    'Nigerian Naira':'NGN', // Nigerian Naira
    'Philippine Pesos': 'PHP', // Philippine Peso
    'Polish Zloty': 'PLN', // Polish Zloty
    'Paraguayan Guarani': 'PYG', // Paraguayan Guarani
    'Thai Baht': 'THB', // Thai Baht
    'Ukrainian Hryvnia': 'UAH', // Ukrainian Hryvnia
    'Vietnamese Dong': 'VND', // Vietnamese Dong
};

//Returns the abbreviated name
function nameToAbbreviation(obj){
    var abbr = currency_names[obj];
    console.log("Abbreviated version of " + obj + ": " + abbr);
    return abbr;
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
} 
function showPercDiff(now, earlier){
    console.log("Now: " + now + " earlier " + earlier);
    var percent = ((now - earlier)/(earlier) * 100).toFixed(3);
    var up = '&#9650' + percent + '%';
    var down  = '&#9660' + percent + '%';

    if (percent >= 0){
        percDifferent.html(up);
        percDifferent.css('color', 'green');
    }
    else{
        percDifferent.html(down);
        percDifferent.css('color', 'red');
    }
}
//$(function () { 

// var input = document.getElementsByTagName("a");
// var coin = input[0].id;

console.log("Coin: ", coin);
generateChart(coin, curr);
dispCurrentPrice(coin, curr);
function generateChart(coin, curr) { 
        $.getJSON('https://min-api.cryptocompare.com/data/histoday?fsym=' + coin + '&tsym=' + curr + '&limit=180&aggregate=3&e=CCCAGG', function(resp) {
        
        var coinData = resp.Data;    //holds the values we're interested in from api call
        console.log(resp.Data);
        console.log("First Data Point: " + resp.Data[0].time);
        //var dataTimePrice = [];     //holds parsed values, used for graphing
        for (var a = 0; a < resp.Data.length; a++){
            var newTime = resp.Data[a].time * 1000;
            coinData[a].time = newTime;
        }
        
        showPercDiff(resp.Data[resp.Data.length-1].close, resp.Data[resp.Data.length - 2].close);
        
        var myChart = Highcharts.stockChart('container2', {
        chart: {
            type: 'candlestick',
        },
        // title: {
        //     text: coin + ' Prices'
        // },
        navigator: {
            enabled: false,
        },
        xAxis:{            
            type: 'datetime',
            //minRange: 3600 * 1000 * 24 * 7, // one week

            gridLineWidth: 1,
            resize:{
                enabled: true,
            },
            dateTimeLabelFormats: {
                day: '%e of %b'
            },
        },
        yAxis:{
            title: {
                text: "Price in: " + curr
            },
            floor:0,
        },
        series: [{
            turboThreshold: 0,
            name: coin,
            data: coinData,
            pointStart: coinData[0].time,// Date.UTC
            pointInterval: (coinData[3].time-coinData[2].time) // one day
        }],
        tooltip:{
            valueSuffix: " " + curr
        }

      });

    });
}
//});