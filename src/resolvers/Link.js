// 誰によって投稿されたのかのリゾルバ
function postedBy(parent, args, context) {
  return context.prisma.link.findUnique({
    where: { id: parent.id },
  }).postedBy()
  // ↑ postedBy()を最後につけるのは、今回はschema.graphqlのpostedByフィールドに設定しているから。modelの時と違う。
}

module.exports = {
  postedBy,
}