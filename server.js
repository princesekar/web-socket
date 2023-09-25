const express = require('express');
const { Server } = require('socket.io');
const axios = require('axios');

const app = express();
const httpServer = app.listen(3000, () => {
    console.log(`Example app listening on port ${3000}`);
});

// Function to handle the login request
async function handleLogin(req, res) {
    try {
        const loginResponse = await axios.post('http://13.231.245.145:8989/api/User/v1/Login', {
            email: "pilottest42@gmail.com",
            password: "6531456-"
        });

        const { accessToken } = loginResponse.data;
        console.log(accessToken);
        res.send('Bearer ' + accessToken);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error');
    }
}

// Function to handle the IoT data post request
async function handlePostData(req, res) {
    try {
        const loginResponse = await axios.post('http://13.231.245.145:8989/api/User/v1/Login', {
            email: "pilottest42@gmail.com",
            password: "6531456-"
        });

        const { accessToken } = loginResponse.data;
        console.log(accessToken);

        const postDataResponse = await axios.post('http://13.231.245.145:8989/api/Iot/v1/PostData', {}, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            }
        });

        // Handle postDataResponse here if needed.
        res.send('Bearer ' + accessToken);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error');
    }
}

app.use('/api/iot/login', handleLogin); // Route for login
app.use('/api/iot/postdata', handlePostData); // Route for posting IoT data

const io = new Server(httpServer);
