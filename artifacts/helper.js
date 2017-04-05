let getClientIp = (req) => {
    let ipAddress;
    let forwardedIpsStr = req.header('x-forwarded-for');
    if (forwardedIpsStr) {
        var forwardedIps = forwardedIpsStr.split(',');
        ipAddress = forwardedIps[0];
    }
    if (!ipAddress) {
        ipAddress = req.connection.remoteAddress;
    }
    ipAddress = ipAddress
        .replace('::ffff:', '')
        .replace(':', '')
        .replace(':', '');
    return ipAddress;
};
exports.getClientIp = getClientIp;