// Packages
const getPort = require('get-port')
const serve = require('micro/lib')
const getModule = require('micro/lib/handler')

// Utilities
const listening = require('./listening')

module.exports = async (file, flags, module = getModule(file)) => {
  const server = serve(module)

  // `3000` is the default port
  let port = parseInt(flags.port, 10) || 3000

  // Check if the specified port is already in use (if none
  // is specified, the default one will be checked)
  const open = await getPort(port)
  let inUse = open !== port

  if (inUse) {
    port = open

    inUse = {
      old: flags.port,
      open
    }
  }

  server.listen(port, flags.host, err => {
    if (err) {
      console.error('micro:', err.stack)
      process.exit(1)
    }

    return listening(server, inUse, flags.silent)
  })
}