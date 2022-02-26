const {buildSchema} = require('graphql')

module.exports =  buildSchema(`

type Booking {
    event:Event!
    _id:ID!
    user:User!
    createdAt:String!
    updatedAt:String!
}

type Event {
    _id:ID!
    title:String!
    description:String!
    street:String!
    city:String!
    date:String!
    creator:User!
    postal_code:String!
    price:Int!
    email:String!
    username:String!
}

type User {
  _id:ID!,
  username: String!
  firstname:String!
  lastname:String!
  email:String!
  password:String!
  createdEvents:[Event!]
}

input EventInput {
  title:String!
  description:String!
  street:String!
  city:String!
  date:String!
  postal_code:String!
  price:Int!
  email:String!
  username:String!
}

input UserInput {
  username: String!
  firstname:String!
  lastname:String!
  email:String!
  password:String!
}

type RootQuery {
    events: [Event!]!
    bookings:[Booking!]!
}
type RootMutation {
    createEvent(eventInput:EventInput): Event
    createUser(userInput:UserInput) : User
    bookEvent(eventId:ID!) : Booking!
    cancelBooking(bookingId:ID!) : Event!
}
schema {
    query: RootQuery
    mutation: RootMutation
}
`)