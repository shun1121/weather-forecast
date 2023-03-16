const {ApolloServer,gql} = require('apollo-server')

//GraphQLのスキーマ定義
const typeDefs = gql`
  type Query {
    info: String!
  }
`
//リゾルバ関数 型に情報を入れる
const resolvers = {
  Query: {
    info: () => 'News',
  }
}