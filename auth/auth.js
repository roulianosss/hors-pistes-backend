const jwt = require('jsonwebtoken')
const privateKey = require('../auth/private_key')

module.exports = (req, res, next) => {
    const authorizationHeader = req.headers.authorization

    if(!authorizationHeader) {
        const message = `You did not provide an authentication token. Add one in the request header.`
        return res.status(401).json({ result: false, severity: 'error', message })
    }

    const token = authorizationHeader.split(' ')[1]
    jwt.verify(token, privateKey, (error, decodedToken) => {
        if(error) {
            const message = `The user is not authorized to access this resource.`
            return res.status(401).json({ result: false, severity: 'error', message, data: error})
        }
        const userId = decodedToken.connectedId
        if(req.body.connectedId && req.body.connectedId !== userId) {
            const message = `This user is invalid.`
            res.status(401).json({ result: false, severity: 'error', message })
        } else {
            next()
        }
    })
}
