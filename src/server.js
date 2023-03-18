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

  type Mutation {
    post(url: String!, description: String!): Link!
  }

  type Link {
    id: ID!
    description: String!
    url: String!
  }
`

//リゾルバ関数 型に情報を入れる
const resolvers = {
  Query: {
    info: () => 'News',
    feed: () => links,
  },

  Mutation: {
    post: (parent, args) => {
      let idCount = links.length;
      const link = {
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url
      }
      links.push(link)
      return link
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => console.log(`${url}でサーバ起動`))