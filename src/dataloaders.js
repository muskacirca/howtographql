const DataLoader = require('dataloader');
const _ = require('underscore')

async function batchUsers (Users, keys) {

  console.log("keys : " + JSON.stringify(keys))
  return await keys.map(async k => {
    console.log("k : " + JSON.stringify(k))
    return await Users.find({_id: {$in: _.flatten(k)}}).toArray();
  })
}

async function batchAuthors(Users, keys) {
  console.log("keys : " + JSON.stringify(keys))
  let newVar = await Users.find({_id: {$in: _.flatten(keys)}}).toArray();
  console.log("newVar : " + JSON.stringify(newVar))
  return newVar;
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
    },{cache: false}
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
    {cache: false}
  )
});