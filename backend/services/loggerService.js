// Simple logger service for student project
const fs = require('fs').promises;
const path = require('path');

const LOG_FILE = path.join(__dirname, '..', 'logs', 'app.log');

class LoggerService {
  constructor() {
    this.ensureLogDirectory();
  }

  async ensureLogDirectory() {
    const logDir = path.dirname(LOG_FILE);
    try {
      await fs.access(logDir);
    } catch {
      await fs.mkdir(logDir, { recursive: true });
    }
  }

  async log(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level: level.toUpperCase(),
      message,
      ...meta
    };

    // Console logging
    const consoleMessage = `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    if (meta.error) {
      console.error(consoleMessage, meta.error);
    } else if (level === 'error') {
      console.error(consoleMessage);
    } else if (level === 'warn') {
      console.warn(consoleMessage);
    } else {
      console.log(consoleMessage);
    }

    // File logging (optional for student project)
    try {
      const logLine = JSON.stringify(logEntry) + '\n';
      await fs.appendFile(LOG_FILE, logLine);
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }

  async info(message, meta = {}) {
    await this.log('info', message, meta);
  }

  async warn(message, meta = {}) {
    await this.log('warn', message, meta);
  }

  async error(message, meta = {}) {
    await this.log('error', message, meta);
  }
}

module.exports = new LoggerService();