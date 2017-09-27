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

async function batchAuthors(Users, keys) {
  let newVar = await Users.find({_id: {$in: _.flatten(keys)}}).toArray();
  return mapValuesAccordingToKeys(keys, newVar);
}

async function batchAgencies (Agencies, keys) {
  return await Agencies.find({_id: {$in: keys}}).toArray();
}

async function batchTrips (Trips, keys) {
  let trips = await Trips.find({_id: {$in: keys}}).toArray();
  return mapValuesAccordingToKeys(keys, trips)
}

module.exports = ({Users, Trips, Agencies}) => ({

  userLoader: new DataLoader(keys => {
      return batchUsers(Users, keys)
    },{cacheKeyFn: key => key.toString()}
  ),

  tripLoader: new DataLoader(
    keys => batchTrips(Trips, keys),
    {cacheKeyFn: key => "Trip" + key.toString()}
  ),

  agencyLoader: new DataLoader(
    keys => batchAgencies(Agencies, keys),
    {cacheKeyFn: key => "Agency" + key.toString()}
  ),

  authorLoader: new DataLoader(
    keys => batchAuthors(Users, keys),
    {cacheKeyFn: key => key.toString()}
  )
});