function feed (parent, args, context) {
  // linkはモデル名
  return context.prisma.link.findMany()
}

module.exports = {
  feed,
}