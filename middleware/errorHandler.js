const { logEvents } = require("./logger")

const errorHandler = (err, req, res, next) => {
    logEvents(`${err.message}\t${req.method}\t${req.url}\t${req.headers.host}`, 'errlog.log')

    const status = err.statusCode ? err.statusCode : 500

    res.status(status)
    res.json({message: err.msg})
}

module.exports = errorHandler