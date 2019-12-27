module.exports = (req, res, next) => {
    if (typeof req.studentEnroll !== 'undefined') {
      if (req.studentEnroll.isEnrollInProcess) {
        req.studentEnroll.isEnrollInProcess = !req.studentEnroll.isEnrollInProcess;
        req.studentEnroll.isRegistered = true;
      }
    } else {
      req.studentEnroll = { isEnrollInProcess: true};
    }
    next();
};
