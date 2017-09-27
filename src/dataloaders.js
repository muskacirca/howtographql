const DataLoader = require('dataloader');
const _ = require('underscore')

async function batchUsers (Users, keys) {

  const newVar = await Users.find({_id: {$in: keys}}).toArray();
  return keys.map(k => {
    let filter = _.find(newVar, n => JSON.stringify(n._id) === JSON.stringify(k))
    return filter ? filter : null;
  });
}

async function batchAuthors(Users, keys) {
  let newVar = await Users.find({_id: {$in: _.flatten(keys)}}).toArray();
  return keys.map(k => {
    let filter = _.find(newVar, n => JSON.stringify(n._id) === JSON.stringify(k))
    return filter ? filter : null;
  })
}

async function batchAgencies (Agencies, keys) {
  return await Agencies.find({_id: {$in: keys}}).toArray();
}

async function batchTrips (Trips, keys) {
  return keys.map(async k => {
    return await Trips.find({_id: {$in: _.flatten(k)}}).toArray();
  });
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