import http from 'http'
import Interceptor from "./src/interceptor"

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
}
