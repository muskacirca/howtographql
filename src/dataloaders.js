const DataLoader = require('dataloader');
const _ = require('underscore')

async function batchUsers (Users, keys) {
  return await Users.find({_id: {$in: _.flatten(keys)}}).toArray();
}

async function batchAgencies (Agencies, keys) {

  console.log("keys : " + keys)
  return await Agencies.find({_id: {$in: keys}}).toArray();
}

async function batchTrips (Trips, keys) {
  return keys.map(async k => {
    return await Trips.find({_id: {$in: _.flatten(k)}}).toArray();
  });
}

module.exports = ({Users, Trips, Agencies}) => ({

  userLoader: new DataLoader(
    keys => batchUsers(Users, keys),
    {cacheKeyFn: key => key.toString()}
  ),

  tripLoader: new DataLoader(
    keys => batchTrips(Trips, keys),
    {cacheKeyFn: key => key.toString()}
  ),

  agencyLoader: new DataLoader(
    keys => batchAgencies(Agencies, keys),
    {cacheKeyFn: key => key.toString()}
  )
});