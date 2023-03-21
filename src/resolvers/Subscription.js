function newLinkSubscribe(parent, args, context) {
  // 非同期で何度も繰り返す。引数はトリガーの名前。sub側(サーバ側)の設定
  return context.pubsub.asyncIterator('NEW_LINK')
}

const newLink = {
  subscribe: newLinkSubscribe,
  resolve: (payload) => {
    return payload
  }
}

module.exports = {
  newLink,
}
