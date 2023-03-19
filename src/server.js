const {ApolloServer,gql} = require('apollo-server')
const fs = require('fs')
const path = require('path') //どこにschema.graphqlがあるか

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

//リゾルバ関数 型に情報を入れる
const resolvers = {
  Query: {
    info: () => 'News',
    feed: async (parent, args, context) => {
      // linkはモデル名
      return context.prisma.link.findMany()
    },
  },

  Mutation: {
    post: (parent, args, context) => {
      const newLink = context.prisma.link.create({
        data: {
          url: args.url,
          description: args.description
        }
      })
      return newLink
    }
  }
}

const server = new ApolloServer({
  //__dirnameは現在のディレクトリ、つまりsrc/, その配下のschema.graphql
  typeDefs: fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf-8'),
  resolvers,
  // 今回はresolver内でprismaが使えるようにする。データの取得など可能になる。
  context: {
    prisma,
  }
})

server.listen().then(({ url }) => console.log(`${url}でサーバ起動`))