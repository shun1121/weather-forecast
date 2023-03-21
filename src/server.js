const {ApolloServer,gql} = require('apollo-server')
const fs = require('fs')
const path = require('path') //どこにschema.graphqlがあるか
const {getUserId} = require('./utils')
const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')
const Link = require('./resolvers/Link')
const User = require('./resolvers/User')

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

//リゾルバ関数 型に情報を入れる
const resolvers = {
  Query,
  Mutation,
  Link,
  User,
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