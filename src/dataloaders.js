const DataLoader = require('dataloader');
const _ = require('underscore')

function mapValuesAccordingToKeys(keys, values) {
  return keys.map(k => {
    let filter = _.find(values, v => JSON.stringify(v._id) === JSON.stringify(k))
    return filter ? filter : null;
  })
}

async function batchUsers (Users, keys) {
  const newVar = await Users.find({_id: {$in: keys}}).toArray();
  return mapValuesAccordingToKeys(keys, newVar)
}

async function batchAgencies (Agencies, keys) {
  let agencies = await Agencies.find({_id: {$in: keys}}).toArray();
  return mapValuesAccordingToKeys(keys, agencies)
}

async function batchTrips (Trips, keys) {
  let trips = await Trips.find({_id: {$in: keys}}).toArray();
  return mapValuesAccordingToKeys(keys, trips)
}

module.exports = ({Users, Trips, Agencies}) => ({

  userLoader: new DataLoader(keys => {
      return batchUsers(Users, keys)
    },{cacheKeyFn: key => "User" + key.toString()}
  ),

  tripLoader: new DataLoader(
    keys => batchTrips(Trips, keys),
    {cacheKeyFn: key => "Trip" + key.toString()}
  ),

  agencyLoader: new DataLoader(
    keys => batchAgencies(Agencies, keys),
    {cacheKeyFn: key => "Agency" + key.toString()}
  )
});