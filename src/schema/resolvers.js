module.exports = {
  Query: {
    allUsers: async (root, data, {mongo: {Users}}) => {
      return await Users.find({}).toArray();
    },
    allTrips: async (root, data, {mongo: {Trips}}) => {
      return await Trips.find({}).toArray();
    },
  },
  Mutation: {
    createUser: async (root, data, {mongo: {Users}}) => {

      const newUser = {
        email: data.authProvider.email,
        password: data.authProvider.password,
      };

      const response = await Users.insert(newUser);
      return Object.assign({id: response.insertedIds[0]}, newUser);
    },
    signIn: async(root, data, {mongo: {Users}}) => {
      const user = await Users.findOne({email: data.signInData.email});
      if (data.signInData.password === user.password) {
        return {token: `token-${user.email}`, user};
      }
    },
    createTrip: async (root, data, {mongo: {Trips}, user}) => {
      const newTrip = Object.assign({agent: user && user._id}, data.tripInputData)
      const response = await Trips.insert(newTrip);
      return Object.assign({id: response.insertedIds[0]}, newTrip);
    },

  },

  User: {
    id: root => root._id || root.id,
  },

  Trip: {
    id: root => root._id || root.id,
    agent: async ({agent}, data, {mongo: {Users}}) => {
      return await Users.findOne({_id: agent});
    },
  },
};