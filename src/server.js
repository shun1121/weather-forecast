const {ApolloServer,gql} = require('apollo-server')

//GraphQLのスキーマ定義
const typeDefs = gql`
  type Query {
    info: String!
  }
`
