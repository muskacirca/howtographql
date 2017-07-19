module.exports = {
  Query: {
    allUsers: async (root, data, {mongo: {Users}}) => {
      return await Users.find({}).toArray();
    },
    allTrips: async (root, data, {mongo: {Trips}, user}) => {
      if(user.role === 'agent') {
        return await Trips.find({agent: user.id}).sort({updatedAt: -1}).toArray();
      } else if (user.role === 'user') {
        return await Trips.find({users: { "$in" : [user.id]}}).sort({updatedAt: -1}).toArray();
      } else if (user.role === 'admin') {
        return await Trips.find({}).sort({updatedAt: -1}).toArray();
      }

      return null;
    },
    allAgencies: async (root, data, {mongo: {Agencies}}) => {
      return await Agencies.find({}).toArray();
    },
    allSessions: async (root, data, {mongo: {Sessions}}) => {
      return await Sessions.find({}).toArray();
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
      const newTrip = Object.assign({agent: user && user._id}, data.tripInputData) //FIXME we use authenticated user to be used as agent
      const response = await Trips.insert(newTrip);
      return Object.assign({id: response.insertedIds[0]}, newTrip);
    },

  },

  User: {
    id: root => root._id || root.id,
    agency: async ({agency}, data, {mongo: {Agencies}}) => {
      return await Agencies.findOne({_id: agency});
    },
    messengerTrips: async ({messengerTrips}, data, {mongo: {Trips}}) => {
      return messengerTrips
        ? await Trips.find({_id: { "$in" : messengerTrips}}).toArray()
        : null
    }
  },

  Trip: {
    id: root => root._id || root.id,
    agent: async ({agent}, data, {mongo: {Users}}) => {
      return await Users.findOne({_id: agent});
    },
    users: async ({users}, data, {dataloaders: {userLoader}}) => {
      return users
        ? await userLoader.load(users).toArray()
        : null
    }
  },

  Agency: {
    id: root => root._id || root.id,
  },

  Session: {
    id: root => root._id || root.id,
  },
};