#!/usr/bin/env node

import minimist from 'minimist'

const args = minimist(process.argv.slice(2), {
	boolean: ['help', 'json'],
	int: ['latitude', 'longitude', 'day', 'timezone'],
	alias: {
		h: 'help', n: 'latitude', s: 'latitude',
		w: 'longitude', e: 'longitude', d: 'day',
		z: 'timezone', t: 'timezone', j: 'json'
	}
})
if(args.help) {
	console.log(
	`Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE
	    -h            Show this help message and exit.
	    -n, -s        Latitude: N positive; S negative.
	    -e, -w        Longitude: E positive; W negative.
	    -z            Time zone: uses tz.guess() from moment-timezone by default.
	    -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.
	    -j            Echo pretty JSON from open-meteo API and exit.`
	)
	process.exit(0)
}

import moment from 'moment-timezone'
const timezone = args.t || args.z || moment.tz.guess()

var latitude = args.n || -args.s
latitude = latitude.toFixed(2)
var longitude = args.e || -args.w
longitude = longitude.toFixed(2)

const url = 'https://api.open-meteo.com/v1/forecast?latitude=' + args.latitude
+ '&longitude=' + args.longitude + '&timezone=' + timezone + '&daily=precipitation_hours'

const response = await fetch(url)
const data = await response.json()

if(args.json) {
	console.log(data)
	process.exit()
}

const days = args.d || 1
const need_galoshes = data.daily.precipitation_hours[days] > 0

var phrase = ""
if (need_galoshes){
	phrase = 'You might need your galoshes '
}
else{
	phrase = "You probably won't need your galoshes "
}
if (days == 0) {
  console.log(phrase + "today.")
} else if (days > 1) {
  console.log(phrase + "in " + days + " days.")
} else {
  console.log(phrase + "tomorrow.")
}