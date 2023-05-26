mapboxgl.accessToken = mapBoxKey;

const map = new mapboxgl.Map(
    {
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/dark-v11', // style URL
        center: [-98.491142,29.424349], // starting position [lng, lat]
        zoom: 10, // starting zoom (0 - 20)
    }
);

const marker = new mapboxgl.Marker ({
    draggable: true
})
    .setLngLat([-98.491142,29.424349])
    .addTo(map);

//marker portion
marker.on('dragend', function(e){
    let html = "";
    let longlat = e.target._lngLat;
    console.log($.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${longlat.lat}&lon=${longlat.lng}&appid=${openWeatherKey}&units=imperial`));
    $.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${longlat.lat}&lon=${longlat.lng}&appid=${openWeatherKey}&units=imperial`).done(function (data) {
        for( var i = 0; i <= 39; i += 8) {
            html += `<div class="card col-2 mx-2" style="width: 14rem;>`
            html += `<div class="centered"><h5 class="card-header text-aligned-center">${data.list[i].dt_txt}</h5>`
            html += `<h6 class="card-text"> ${data.list[i].main.temp}&#8457</h6>`
            html += `<h6><img class="icons" src="http://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png"</h6>`
            html += `<h6 class="card-text">Description: ${data.list[i].weather[0].description}</h6>`
            html += `<h6 class="card-text">Humidity: ${data.list[i].main.humidity}</h6>`
            html += `<h6 class="card-text">Wind: ${data.list[i].wind.speed}</h6>`
            html += `<h6 class="card-text">Pressure: ${data.list[i].main.pressure}</h6>`
            html += `</div>`
            html += `</div>`
        }
        $("#weatherBody").html(html);
        html ="";

        let place = "";
        place += `<p>Current Location: ${data.city.name}</p>`
        $("#current-city").html(place);
    })
});


// search portion
function geoCodeBuildWeather(searchString) {
    let html = "";
    geocode(searchString, mapBoxKey).then(function (results) {
        let myOptionsObj = {
            center: results,
            zoom: 10
        };
        map.flyTo(myOptionsObj);
        marker.setLngLat(results);

        console.log(`https://api.openweathermap.org/data/2.5/forecast?lat=${results[1]}&lon=${results[0]}&appid=${openWeatherKey}&units=imperial`);
        $.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${results[1]}&lon=${results[0]}&appid=${openWeatherKey}&units=imperial`).done(function (data) {
            for( var i = 0; i <=39; i +=8) {
                html += `<div class="card col-2 mx-2" style="width: 14rem;>`
                html += `<div class="centered"><h5 class="card-header text-aligned-center">${data.list[i].dt_txt}</h5>`
                html += `<h6 class="card-text"> ${data.list[i].main.temp}&#8457</h6>`
                html += `<h6><img class="icons" src="http://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png"</h6>`
                html += `<h6 class="card-text">Description: ${data.list[i].weather[0].description}</h6>`
                html += `<h6 class="card-text">Humidity: ${data.list[i].main.humidity}</h6>`
                html += `<h6 class="card-text">Wind: ${data.list[i].wind.speed}</h6>`
                html += `<h6 class="card-text">Pressure: ${data.list[i].main.pressure}</h6>`
                html += `</div>`
                html += `</div>`
            }
            $("#weatherBody").html(html);
            html ="";

            let place = "";
            place += `<p>Current Location: ${data.city.name}</p>`
            $("#current-city").html(place);
        })
    })
}

$("#myBtn").click(function(e){
    e.preventDefault();
    geoCodeBuildWeather($("#searchInput").val());
})

geoCodeBuildWeather("San Antonio, TX");