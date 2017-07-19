const {Logger, MongoClient} = require('mongodb');

// 1
const MONGO_URL = 'mongodb://localhost:27017/dev';

// 2
module.exports = async () => {
  const db = await MongoClient.connect(MONGO_URL);

  let logCount = 0;
  Logger.setCurrentLogger((msg, state) => {
    console.log(`MONGO DB REQUEST ${++logCount}: ${msg}`);
  });
  Logger.setLevel('debug');
  Logger.filter('class', ['Cursor']);


  return {
    Users: db.collection('users'),
    Trips: db.collection('trips'),
    Agencies: db.collection('agencies'),
    Sessions: db.collection('sessions')
  };
}