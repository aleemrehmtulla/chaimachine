
const { Notion } = require("@neurosity/notion");
const { Client } = require('tplink-smarthome-api');

const { join } = require('path')
const express = require('express')
const favicon = require('serve-favicon')

const { pipe, of, empty } = require("rxjs");
const { flatMap, map } = require("rxjs/operators");


const app = express()
const PORT = 80

const Gpio = require('onoff').Gpio;

app.use(favicon(join(__dirname, 'public', 'favicon.ico')))
app.set('views', join(__dirname, 'views'))
app.set('view engine', 'ejs')

const aleemTheDream = "192.168.2.214"
const aleemIsSwagger = "192.168.2.97"
const client = new Client();

const email = "farzadoesstuff@gmail.com"
const password = "Daftwow1995!"
const deviceId = "a47b19b6aab086e7a0311607f40e041b"


const main = async () => {
  const fan = new Gpio(21, 'out');

  const notion = new Notion({
    deviceId
  });

  await notion.login({
    email,
    password
  })
  .catch(error => {
    console.log(error);
    throw new Error(error);
  });
  console.log("Logged in");

  // notion.status().subscribe((status) => {
  //   console.log(status)
  // })

  // This is a function that lets us 
  notion.focus().subscribe((focus) => {
    console.log(focus)
    if (focus.probability > 0.35) {
      fan.writeSync(1)
    } else {
      fan.writeSync(0)
    }
  });
}

main();

// reply to request with the hello world html file
app.get('/aleem-dream-on', function (req, res) {
  client.getDevice({ host: aleemTheDream }).then((device) => {
    device.getSysInfo().then(console.log);
    device.setPowerState(false);
  });

  res.json({"aleem-dream-on": "on"})
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
})
