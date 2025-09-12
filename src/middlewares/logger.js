
function maskPass(objBody){
    if(objBody){
        if (objBody?.st_password) delete objBody.st_password;
        if (objBody?.st_confirm_password) delete objBody.st_confirm_password;
    }
    return objBody
}

module.exports={
    logger(req,res,next){
        const logDetails = {
            timestamp:new Date(),
            method: req.method,
            path: req.originalUrl,
            ip: req.connection.remoteAddress
        };
        if(req?.body) logDetails.payload = maskPass({...req.body})
        const originalSend = res.send;
        res.send = function (_) {
            logDetails.statusCode=res?.statusCode
            originalSend.apply(res, arguments);
        };
        console.log(logDetails);
        next();
    }
}