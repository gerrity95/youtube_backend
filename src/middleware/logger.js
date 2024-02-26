const {createLogger, format, transports} = require('winston');

// const enumerateErrorFormat = format((info) => {
//   if (info.level === 'error') {
//     console.log('ERROR LOG');
//     console.log(info);
//     Object.assign(info, {message: info.stack});
//   }
//   return info;
// });

module.exports = createLogger({
  transports: [
    new transports.File({
      stderrLevels: ['error'],
      handleExceptions: true,
      filename: 'logs/server.log',
      format: format.combine(
          format.timestamp({format: 'MMM-DD-YYYY HH:mm:ss'}),
          // enumerateErrorFormat(),
          format.align(),
          format.printf((info) => `${info.level}: ${[info.timestamp]}: ${info.message}`),
      )}),
    new transports.Console({
      format: format.combine(
          format.timestamp({format: 'MMM-DD-YYYY HH:mm:ss'}),
          // enumerateErrorFormat(),
          format.align(),
          format.errors({stack: true}),
          format.printf((info) => `${info.level}: ${[info.timestamp]}: ${info.message}`),
      )}),
  ],
});