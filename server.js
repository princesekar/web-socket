const email = "pilottest42@gmail.com";
const password = "6531456-";
const api = 'http://13.231.245.145:8989/api';

const express = require('express');
const { Server } = require('socket.io');
const axios = require('axios');
const ModbusRTU = require('modbus-serial');
const client = new ModbusRTU();

const app = express();
const httpServer = app.listen(3000, () => {
    console.log(`Example app listening on port ${3000}`);
});

// Function to handle the login request
async function handleLogin(req, res) {
    try {
        const loginResponse = await axios.post(`${api}/User/v1/Login`, {
            email: email,
            password: password
        });

        const { accessToken } = loginResponse.data;
        console.log('Bearer'+ accessToken);
        res.send('Bearer ' + accessToken);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error');
    }
}

// async function handleTenant(req, res) {
//     try {
//         const tenantResponse = await axios.post(`${api}/Tenants/v1/GetAll`, {
//             email: email,
//         });

//         const { tenantId } = tenantResponse.data;
//         console.log('tenantId'+ tenantId);
//         res.send('tenantId ' + tenantId);
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Error');
//     }
// }


// async function handleId(req, res) {
//     try {
//         const tenantID = await axios.post(`${api}/Iot/v1/PostData`, {
//             tenantID: "4bbb7e84-aafe-444f-90df-584d5239ec86",
//         });

//         const { tenant } = tenantID.data;
//         console.log('tenant'+ tenant);
//         res.send('tenant ' + tenant);
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Error');
//     }
// }


async function readDataFromDevice() {
    try {
        await client.connectTCP('192.168.16.241', { port: 502 });
        const data = await client.readHoldingRegisters(0, 10); 
        return data;
    } catch (error) {
        console.error('Modbus Error:', error);
        throw error;
    } finally {
        client.close();
    }
}

// Function to handle posting IoT data to the API
async function handlePostData(req, res) {
    try {
        const deviceData = await readDataFromDevice();
        const tenantID = "4bbb7e84-aafe-444f-90df-584d5239ec86";
        const deviceRef = "CHWP-H-01";
        const labels = "pilots";

        const postData = {
            data: deviceData,
            tenantID: tenantID,
            DeviceRef: deviceRef,
            Labels: labels
        };

        const apiResponse = await axios.post(`${api}/Iot/v1/PostData`, postData, {
            headers: {
                postData
            },
        });

        console.log('Data sent to API:', apiResponse.data);
        res.status(200).send('Data successfully read and sent to API.');
    } catch (error) {
        console.error('Error posting data to API:', error);
        res.status(500).send('Error posting data to API.');
    }
}

app.use('/api/iot/login', handleLogin);
app.use('/api/iot/postdata', handlePostData);
// app.use('/api/iot/tenant', handleTenant);

