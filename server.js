const { Client } = require('tplink-smarthome-api');

const { join } = require('path')
const express = require('express')
const favicon = require('serve-favicon')
const initializeApp = require('firebase/app').initializeApp;
const set = require('firebase/database').set;
const ref = require('firebase/database').ref;
const get = require('firebase/database').get;
const getDatabase = require('firebase/database').getDatabase;
const firebaseConfig = {
  apiKey: "AIzaSyBZUeGGKkhlGj4f-76wvjFdEgNZ7CpUG3w",
  authDomain: "chaimk-457c2.firebaseapp.com",
  databaseURL: "https://chaimk-457c2-default-rtdb.firebaseio.com",
  projectId: "chaimk-457c2",
  storageBucket: "chaimk-457c2.appspot.com",
  messagingSenderId: "759712792903",
  appId: "1:759712792903:web:34924ae9fc2571b3d68c62",
  measurementId: "G-RQR31TJVSK"
  };
const fireApp = initializeApp(firebaseConfig);
const database = getDatabase(fireApp);

const app = express()
const PORT = 80

console.log("Starting server on port " + PORT);

const Gpio = require('onoff').Gpio;
const sensor = require('ds18b20-raspi')

app.use(favicon(join(__dirname, 'public', 'favicon.ico')))
app.set('views', join(__dirname, 'views'))
app.set('view engine', 'ejs')

const aleemTheDream = "192.168.2.214"
const aleemIsSwagger = "192.168.2.97"
const client = new Client();


// reply to request with the hello world html file
app.get('/aleemqueenOn', function (req, res) {
  client.getDevice({ host: aleemTheDream }).then((device) => {
    device.getSysInfo().then(console.log);
    device.setPowerState(false);
  });

  console.log("Boom " )


  const val = await get(ref(database, "/status/isOn")).catch((err) =>
  console.log(err)
);

  const users = await val.val();

  res.json({"aleem-dream-on": users})
})






app.get('/aleemqueenOff', function (req, res) {
  client.getDevice({ host: aleemTheDream }).then((device) => {
    device.getSysInfo().then(console.log);
    device.setPowerState(false);
  });
  console.log("Boom " )
  res.json({"aleem-dream-on": "off"})
})



app.get('/pump-off', function (req, res) {
  client.getDevice({ host: aleemTheDream }).then((device) => {
    device.getSysInfo().then(console.log);
    device.setPowerState(false);
  });
  
  res.json({"pump-off": "off"})
})


// Enable the public directory for resource files
app.use('/public', express.static(
  join(__dirname, 'public')
))

// reply to request with the hello world html file
app.get('/', function (req, res) {
  res.render('index')
})

app.get('/wifi-switch-on', function (req, res) {

  res.json({"wifi-switch": "on"})
})

// reply to request with the hello world html file
app.get('/on', function (req, res) {
  const fan = new Gpio(21, 'out');
  console.log("---> Gpio", Gpio.accessible)
  fan.writeSync(1)
  console.log("---> Fan", fan)
  res.json({"fan": "on"})
})


// reply to request with the hello world html file
app.get('/off', function (req, res) {
  const fan = new Gpio(21, 'out');
  console.log("---> Gpio", Gpio.accessible)
  fan.writeSync(0)
  console.log("---> Fan", fan)
  res.json({"fan": "off"})
})

// start a server on port 80 and log its start to our console
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
  setInterval(function () {
    const tempC = sensor.readSimpleC();
    console.log(`${tempC} degC`);    
  }, 1000);
})
