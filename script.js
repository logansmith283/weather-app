// API keys and globals
const ipAPI = "access_key=efaec7b82fa80b2d0731ca9dc0f49803";
const weatherAPI = "appid=09725fc33bf50124df14a16d159d49df";
var lat;
var lon;

const vm = Vue.createApp({
    data() {
        return {
            title: "Vue.JS Weather App",
            coordinates: "Accessing coordinates for this IP Address",
            current: "Fetching current weather conditions...",
            conditionsList: [],
            forecastTitle: "Fetching forecast information...",
            forecastList: [],

            likely: 0,
            unlikely: 0,
            neutral: 40,
        };
    },

    methods: {
        onclick(item) {
            if (item.likelyhood === 'neutral') {
                item.likelyhood = 'likely';
                this.neutral --;
                this.likely ++;
            } else if (item.likelyhood ==='likely') {
                item.likelyhood = 'unlikely';
                this.likely --;
                this.unlikely ++;
            } else {
                item.likelyhood = 'neutral';
                this.unlikely --;
                this.neutral ++;
            }
            
        }
    },

}).mount('#app');

// api call to find the coordinates for the IP address
fetch(`http://api.ipstack.com/check?${ipAPI}`)
    .then(r => r.json())
    .then(json => {
        if (json.hasOwnProperty('error')){
            console.log(`Error: ${json.error}`);
            vm.coordinates = `Error: ${json.error}`;
        }
        else {
            lat = json.latitude;
            lon = json.longitude;
            vm.coordinates = `You are located in ${json.city}, ${json.region_name}, ${json.country_name} at coordinates (${lat}, ${lon})`;

            // api call to openweathermap for current weather report
            return fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&${weatherAPI}&units=imperial`);
        }
    })
    .then(r => r.json())
    .then(json => {
        if (json.hasOwnProperty('error')){
            console.log(`Error: ${json.error}`);
            vm.current = `Error: ${json.error}`;
        } 
        else {
            let date = new Date();
            date.setTime(json.dt*1000);
            vm.current = `Current weather conditions @ ${date.toLocaleDateString()}, ${date.toLocaleTimeString()}`;
            vm.conditionsList = [
                {message:`Currently ${json.main.temp} F`},
                {message:`High ${json.main.temp_max} F`},
                {message:`Low ${json.main.temp_min} F`},
                {message:`${json.weather[0].description}`},
                {message:`${json.main.humidity}% humidity`},
                {message:`${json.main.pressure} hPa pressure`}
            ];
            return fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&${weatherAPI}&units=imperial`);
        }
    })
    .then(r => r.json())
    .then(json => {
        if (json.hasOwnProperty('error')){
            console.log(`Error: ${json.error}`);
            vm.forecastTitle = `Error: ${json.error}`;
        } 
        else {
            vm.forecastTitle = '5 day 3-hour forecast'
            let list = json.list;
            
            for (var object of list) {
                let date = new Date();
                date.setTime(object.dt * 1000);
                let listItem = {
                    header:`Conditions for ${date.toLocaleString()}`,
                    likelyhood: 'neutral',
                    temp: object.main.temp,
                    high: object.main.temp_max,
                    low: object.main.temp_min,
                    sky: object.weather[0].description,
                    humidity: object.main.humidity,
                    pressure: object.main.pressure
                };
                vm.forecastList.push(listItem);
            }
        }
    });
