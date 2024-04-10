const path = require('path');
const electron = require('electron');
const userDataPath = electron.app.getPath('userData');

const dbPath = path.join(userDataPath, 'data.db');

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(dbPath);

module.exports = db;