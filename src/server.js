const {ApolloServer,gql} = require('apollo-server')
const fs = require('fs')
const path = require('path') //どこにschema.graphqlがあるか

// HackerNewsの各投稿
let links = [
  {
    id: 'link-0',
    description: 'learn something on udemy',
    url: 'www.something.com'
  },
]

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
  //__dirnameは現在のディレクトリ、つまりsrc/, その配下のschema.graphql
  typeDefs: fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf-8'),
  resolvers,
})

server.listen().then(({ url }) => console.log(`${url}でサーバ起動`))