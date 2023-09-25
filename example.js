const express = require('express');
const { Server } = require('socket.io');
const axios = require('axios');
const CustomLogger = require('./CustomLogger');

const app = express();

const httpServer = app.listen(3000, () => {
    console.log(`Example app listening on port ${3000}`)
})

app.use('/api/iot', (req, res) => {
    axios.post('http://13.231.245.145:8989/api/User/v1/Login', { email: "pilottest42@gmail.com", password: "6531456-" })
        .then(function (response) {
            // handle success
            const { accessToken } = response.data;
            console.log(accessToken);

            axios.post('http://13.231.245.145:8989/api/Iot/v1/PostData', {}, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                }
            }).then((resp) => {

            }).catch(function (error) {
                // handle error
                console.log(error);
            })
            .finally(function () {
                // always executed
                res.send('bearer',` ${accessToken}`);
            });
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .finally(function () {
            // always executed
        });

})

const io = new Server(httpServer);
