# Getting Started with centaur_assessment

This project was built using node@16.13 and npm 8.1.2 (yarn 1.22.19)

In the project directory run npm install or yarn

## Information about libraries used

centaur_assessment is written using plain javascript (as is the rest of the Centaur stack) in React.js.

In order for the silo to be as interactive as possible an html5 canvas library is used (konvajs) to handle both rendering of the elements and interaction.

The libary used for the UI is MaterialUI.

For the graphs Graph.js is used.

json-server is being used as the development server.

## Start the project and the development server

In the project directory, you can run:

### `npm start` or `yarn start`

Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

It also starts the development server (json-server) at localhost:3001

## What can you do in the application

### Create user account

You can navigate to localhost:3000 or localhost:3000/register to create a new user account

### Login with an existin account

Navigate to localhost:3000/login to login to the application

### Create a new sensor

You can right click anywhere on the silo to create a new sensor. The sensor will be given a unique id (by the backend).

### Add temperatures and timestamps to the sensor

When you left click on a sensor a modal comes up that shows:

1. The id of the sensor
2. The position of the sensor on the silo canvas
3. The temperature/timestamps of that sensor in a table view
4. A form where you can input a new temperature for a specific time stamp

When you press the submit button all sensor information is updated on the server.

### Data graphs

On the right of the silo a temperature/timestamp line graph is generated for each sensor, divided in tabs.

You can press on any tab to view the graph for that specific sensor.

### Delete sensors

You can right click on a sensor in order to show the delete option.

### Change sensor location

You can left click and drag to move the sensor freely (in the bounds of the silo of course). The location of the sensor is updated and saved on the server.

### Logout

You can logout using the user menu on the top right of the application.

## Known issues

### Dismiss right click

In order to dismiss the right click menu you need to press anywhere within the silo. It should be anywhere within the app.

## Improvements

### Position information

Position information corresponds to the location on the html5 canvas which is great for visualization purposes but useless for the end user. A way to input silo dimensions would allow them to be translated to the real silo position thus makin the position information more useful.

### Better organization of some of the code

For example all fetches should not be written in the components themselves but in a different file.

### Write tests :P
