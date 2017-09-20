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
    createAgency: async (root, data, {mongo: {Agencies}}) => {
      const response = await Agencies.insert(data.agencyInputData);
      return Object.assign({id: response.insertedIds[0]}, data.agencyInputData);
    }

  },

  User: {
    id: root => root._id || root.id,
    agency: async ({agency}, data, {dataloaders: {agencyLoader}}) => {
      return agency
        ? agencyLoader.load(agency)
        : null
    },
    messengerTrips: async ({messengerTrips}, data, {dataloaders: {tripLoader}}) => {
      return messengerTrips
        ? tripLoader.load(messengerTrips)
        : null
    }
  },

  Trip: {
    id: root => root._id || root.id,
    agent: async ({agent}, data, {dataloaders: {userLoader}}) => {
      return await userLoader.load(agent);
    },
    users: async ({users}, data, {dataloaders: {userLoader}}) => {
      return users
        ? [await userLoader.load(users)]
        : null
    },
    // messages: () => {
    //   console.log("MESSAGGGESSSS");
    // }
  },

  // Message: {
  //   author: async ({author}, data, {dataloaders: {userLoader}}) => {
  //     console.log("author : " + JSON.stringify(author));
  //     return await userLoader.load(author)
  //   }
  // },

  Agency: {
    id: root => root._id || root.id,
  },

  Session: {
    id: root => root._id || root.id,
  },

  Attachment: {
    id: root => root._id || root.id
  }
};