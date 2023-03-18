const {ApolloServer,gql} = require('apollo-server')

// HackerNewsの各投稿
let links = [
  {
    id: 'link-0',
    description: 'learn something on udemy',
    url: 'www.something.com'
  },
]

//GraphQLのスキーマ定義
const typeDefs = gql`
  type Query {
    info: String!
    feed: [Link]!
  }

  type Link {
    if: ID!
    description: String!
    url: String!
  }
`
//リゾルバ関数 型に情報を入れる
const resolvers = {
  Query: {
    info: () => 'News',
    feed: () => links,
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => console.log(`${url}でサーバ起動`))