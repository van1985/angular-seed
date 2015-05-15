var chalk = require('chalk');

var DEFAULT_ERROR_MESSAGE = 'An error has occurred.';

exports.error = function(message){
    message = message || DEFAULT_ERROR_MESSAGE;
    console.log( chalk.red( message ) );
};