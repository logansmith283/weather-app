// API keys and globals
const ipAPI = "access_key=efaec7b82fa80b2d0731ca9dc0f49803";
const weatherAPI = "appid=09725fc33bf50124df14a16d159d49df";
//var lat;
//var lon;

// api call to find the coordinates for the IP address
fetch(`http://api.ipstack.com/check?${ipAPI}`)
    .then(r => r.json())
    .then(json => {
        let coordLabel = document.getElementById('coords');
        if (json.hasOwnProperty('error')){
            console.log(`Error: ${json.error}`);
            label.textContent = `Error: ${json.error}`;
        }
        else {
            let lat = json.latitude;
            let lon = json.longitude;
            coordLabel.textContent = `You are located in ${json.city}, ${json.region_name}, ${json.country_name} at coordinates (${lat}, ${lon})`;
            // api call to openweathermap for current weather report
            return fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&${weatherAPI}&units=imperial`);
        }
    })
    .then(r => r.json())
    .then(json => {
        let currentDiv = document.getElementById('current');
        if (json.hasOwnProperty('error')){
            console.log(`Error: ${json.error}`);
            var para = document.createElement('p');
            currentDiv.appendChild(para);
            para.textContent = `Error: ${json.error}`;
        } 
        else {
            document.getElementById('waitmessage1').remove();
            let date = new Date();
            date.setTime(json.dt*1000);
            console.log(date);
            var para = document.createElement('p');
            para.textContent = `Current weather conditions @ ${date.toLocaleDateString()}, ${date.toLocaleTimeString()}`;
            currentDiv.appendChild(para);
        }
    });
