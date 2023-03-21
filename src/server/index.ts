import http from 'http'
import Interceptor from "../interceptor"

export default class Dyns {
  server: http.Server<any, any>
  interceptor: Interceptor

  constructor() {
    const interceptor = new Interceptor()
    this.server = http.createServer(async(req, res) => {
      await interceptor.run({req, res})
      if (!res.writableEnded) {
        let body = res?.body || '200 OK'
        if (body.pipe) {
          body.pipe(res)
        } else {
          if (typeof body !== 'string' && res.getHeader('Content-Type') === 'application/json') {
            body = JSON.stringify(body)
          }
          res.end(body)
        }
      }
    })
    this.server.on('clientError', (err, socket) => {
      socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
    });

    this.interceptor = interceptor
  }
  listen(opts: any, cb=(factor: any) => {}) {
    if (typeof opts === 'number') opts = {port: opts}
    opts.host = opts.host || '0.0.0.0'
    console.log(`Starting up http-server
      http://${opts.host}:${opts.port}`
    )
    this.server.listen(opts, () => cb(this.server))
  }
  use(aspect: any) {
    return this.interceptor.use(aspect)
  }
}
