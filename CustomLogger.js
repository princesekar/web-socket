// CustomLogger.js
// This module contains your custom logging logic

function log(message) {
    // Implement your custom logging logic for 'log' messages here
    console.log(message); // Example: Log to the console
}

function error(message, error) {
    // Implement your custom logging logic for 'error' messages here
    console.error(message, error); // Example: Log error to the console
}

module.exports = {
    log,
    error,
};
