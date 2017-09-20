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
    agency: Agency!
    agency_name: String
    messengerTrips: [Trip]
  }
  
  type Session {
    id: ID!
    user: User!
  }
    
  type Location {
    city: String
    country: String
    airport: String
    date: String
  }
  
  type Message {
    author: User
    content: String
    sent: String
  }
  
  type Attachment {
    id: ID!
    file: String
    filename: String
    documentType: String
    lastSeenAt: String
    createdAt: String
    updatedAt: String
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
    users: [User]
    messages: [Message]
    attachments: [Attachment]
  }
  
  type Agency {
    id: ID!
    name: String!
    logo_url: String!
    mobile_color: String
    mobile_font: String
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
  
  input AuthProviderSignupData {
    email: String!
    password: String!
  }
  
  type SignInPayload {
    token: String
    user: User
  }
  
  type Query {
    allUsers: [User!]
    allTrips: [Trip!]
    allAgencies: [Agency!]
    allSessions: [Session!]
  }
  
  type Mutation {
    createUser(authProvider: AuthProviderSignupData!): User
    signIn(signInData: AuthProviderSignupData!): SignInPayload
    createTrip(tripInputData: TripInputData!): Trip
  }
`;

module.exports = makeExecutableSchema({typeDefs, resolvers});