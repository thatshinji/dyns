import Server from './src/server'

const app = new Server()

// add interceptor
app.use(async({res}: any, next: any) => {
  res.setHeader('Content-Type', 'text/html')
  res.body=`<h1>Hello Dyns</h1>`
  await next()
})

app.listen({
  port: 8080,
  host: '0.0.0.0'
})
