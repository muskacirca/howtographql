const DataLoader = require('dataloader');
const _ = require('underscore')

async function batchUsers (Users, keys) {
  return await Users.find({_id: {$in: _.flatten(keys)}}).toArray();
}

async function batchTrips (Trips, keys) {
  // let $in = _.flatten(keys);
  console.log("key:" + JSON.stringify(keys))
  let newVar = await Trips.find({_id: {$in: keys}}).toArray();
  console.log("newVar:" + JSON.stringify(newVar))
  return newVar;
}

module.exports = ({Users, Trips}) => ({

  userLoader: new DataLoader(
    keys => batchUsers(Users, keys),
    {cacheKeyFn: key => key.toString()}
  ),

  tripLoader: new DataLoader(
    keys => {

      console.log("keys:" + JSON.stringify(keys))
      let uniq = _.flatten(keys)

     return batchTrips(Trips, _.uniq(uniq)),
        {cacheKeyFn: key => key.toString()}
    }
  ),
});