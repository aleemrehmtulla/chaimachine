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

const heat = "192.168.2.159"
const milk = "192.168.2.214"
const water = "192.168.2.97"

const client = new Client();


// reply to request with the hello world html file
// app.get('/aleemqueenOn', function (req, res) {
//   client.getDevice({ host: aleemTheDream }).then((device) => {
//     device.getSysInfo().then(console.log);
//     device.setPowerState(true);
//   });

//   console.log("Boom " )

  
//     const db = getDatabase();
//     const starCountRef = ref(db, 'status/isOn');
//     onValue(starCountRef, (snapshot) => {
//       const data = snapshot.val();
//       console.log(data);
//     });
 
//   res.json({"aleem-dream-on": "hi"})
// })
// reply to request with the hello world html file
const wait = (timeToDelay) => new Promise((resolve) => setTimeout(resolve, timeToDelay))
async function lol(){

    const waterDevice = await client.getDevice({ host: water });
    const heatDevice = await client.getDevice({ host: heat });
    const milkDevice = await client.getDevice({ host: milk });

    await waterDevice.setPowerState(true);
    
    
    console.log("Water on")
    
    await wait(4000);

    await waterDevice.setPowerState(false);
  
    console.log("Water off")

    let temp = sensor.readSimpleC();

    setInterval(() => {
      console.log(temp)
    }, 1000);

    // turn on the heat
    await heatDevice.setPowerState(true);
    console.log("Heat on")


    while(temp < 96) {
      temp = sensor.readSimpleC();
      await wait(5000);
    }
    

    console.log("Milk on")
    await milkDevice.setPowerState(true);
    await wait(6000);
    await milkDevice.setPowerState(false);
    console.log("Milk off")

    // milk has been added

    const MILK_BOIL_TEMP = 90
    const THRESHOLD = 3

    temp = sensor.readSimpleC();
    
    // bring temp back up to 96
    while(temp < MILK_BOIL_TEMP) {
      temp = sensor.readSimpleC();
      await wait(5000);
    }

    // now this is is boiling milk is the current date
    let boilStartTime = new Date();

    // we want to maintain the boiling temp for 10 minutes
    while (new Date() - boilStartTime < 10 * 60 * 1000) {

      temp = sensor.readSimpleC();

      if (temp < MILK_BOIL_TEMP - THRESHOLD) {
        console.log("Milk is too cold, turning on heat")
        await heatDevice.setPowerState(true);
      } 

      if (temp > MILK_BOIL_TEMP + THRESHOLD) {
        console.log("Milk is too hot, turning off heat")
        await heatDevice.setPowerState(false);
      }
      await sleep(5000);
    }

    // it's been 10 minutes, turn off heat
    await heatDevice.setPowerState(false);

    console.log("CHAI IS DONE!!!!")

    res.json({"status": "CHAI IS DONE!!!!!!!11111"})


  }
  lol()









app.get('/pump-off', function (req, res) {
  client.getDevice({ host: water }).then((device) => {
    device.getSysInfo().then(console.log);
    device.setPowerState(true);
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
        
  }, 1000);
})
