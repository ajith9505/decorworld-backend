const { format } = require("date-fns");
const { v4: uuid } = require("uuid");
const fs = require('fs');
const path = require("path");
const { log } = require("console");
const fsPromises = fs.promises

const logEvents = async (message, logFileName) => {
    const dateTime = format(new Date(), 'ddMMyyyt\tHH:mm:ss')
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`

    try {

        if (!fs.existsSync(path.join(__dirname, '..', 'logs'))){
            await fsPromises.mkdir(path.join(__dirname, '..', 'logs'))
        }

        await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logFileName), logItem)

    } catch (error) {
        log(error)
    }
}

const logger = (req, res, next) => {
    logEvents(`${req.method}\t${req.url}\t${req.headers.host}`, 'reqlog.log')
    next()
}

module.exports = { logEvents, logger }