const {makeExecutableSchema} = require('graphql-tools');
const resolvers = require('./resolvers');

const typeDefs = `
  type User {
    id: ID!
    first_name: String
    last_name: String
    full_name: String
    birthdate: String
    email: String!
    password: String!
    role: String!
    point_of_sale: String
    phone: String
    mobile: String
    title: String
    deviceId: String
  }
  
  input AuthProviderSignupData {
    email: String!
    password: String!
  }
    
  type Location {
    id: ID!
    city: String
    country: String
    airport: String
    date: String
  }
  
  type Trip {
    id: ID!
    ref: String
    title: String
    comments: String
    type: String
    type2: String
    banner_url: String
    background_url: String
    departure: Location
    destination: Location
    agent: User!
  }
  
  input LocationInputData {
    city: String
    country: String
    airport: String
    date: String
  }
  
  input TripInputData {
    ref: String
    title: String
    comments: String
    type: String
    type2: String
    banner_url: String
    background_url: String
    departure: LocationInputData
    destination: LocationInputData
  }
  
  type SignInPayload {
    token: String
    user: User
  }
  
  type Query {
    allUsers: [User!]!
    allTrips: [Trip!]!
  }
  
  type Mutation {
    createUser(authProvider: AuthProviderSignupData!): User
    signIn(signInData: AuthProviderSignupData!): SignInPayload
    createTrip(tripInputData: TripInputData!): Trip
  }
`;

module.exports = makeExecutableSchema({typeDefs, resolvers});