const generateNonce = () => {
  return Math.floor(Math.random() * 1000000)
}

export {
  generateNonce
}