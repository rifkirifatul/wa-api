const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, '../logs/message-log.txt');

exports.logMessage = (data) => {
  const timestamp = new Date().toISOString();
  const entry = `[${timestamp}] ${JSON.stringify(data)}\n`;

  fs.appendFile(logFilePath, entry, (err) => {
    if (err) {
      console.error('❌ Gagal simpan log:', err.message);
    }
  });
};
