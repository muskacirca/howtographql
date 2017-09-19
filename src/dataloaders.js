const DataLoader = require('dataloader');
const _ = require('underscore')

async function batchUsers (Users, keys) {
  return await Users.find({_id: {$in: _.flatten(keys)}}).toArray();
}

async function batchTrips (Trips, keys) {
  console.log("keys : " + JSON.stringify(keys))
  let map = keys.map(async k => {
    console.log("k : " + JSON.stringify(k))
    return await Trips.find({_id: {$in: _.flatten(k)}}).toArray();
  });
  console.log("map : " + JSON.stringify(map))
  return map
}

module.exports = ({Users, Trips}) => ({

  userLoader: new DataLoader(
    keys => batchUsers(Users, keys),
    {cacheKeyFn: key => key.toString()}
  ),

  tripLoader: new DataLoader(
    keys => batchTrips(Trips, keys),
    {cacheKeyFn: key => key.toString()}
  ),
});