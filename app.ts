import Interceptor from "./src/interceptor";

const inter = new Interceptor();

const wait = (ms: number) => {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
};

const task = (id: number) => {
  return async (ctx: any, next: any) => {
    console.log(`task: ${id} begin`)
    ctx.count++
    await wait(1000)
    console.log(`count: ${ctx.count}`)
    await next()
    console.log(`task: ${id} end`)
  };
};

inter.use(task(0));
inter.use(task(1));
inter.use(task(2));
inter.use(task(3));

inter.run({count: 0})
