const {ApolloServer,gql} = require('apollo-server')
const fs = require('fs')
const path = require('path') //どこにschema.graphqlがあるか
const getUserId = require('./utils')

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
    // schema.graphqlにあるtype Mutationの中身と対応している。
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
  // contextはどのresolverでも指定した値を使えるようにするためのもの、reqはplaygroundで再生ボタンを押したときに送るリクエスト情報
  context: ({ req }) => {
    return {
      ...req,
      prisma,
      userId: req && req.headers.authorization ? getUserId(req) : null,
    }
  }
})

server.listen().then(({ url }) => console.log(`${url}でサーバ起動`))