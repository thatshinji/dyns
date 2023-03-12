class Interceptor {
  #aspects: any[] = [];

  use(/*async*/ functor: any) {
    this.#aspects.push(functor);
  }

  run(context: any) {
    const aspect = this.#aspects;
    const exector = aspect.reduceRight(
      (prev, cur) => {
        return async () => {
          await cur(context, prev);
        };
      },
      () => {
        Promise.resolve();
      }
    );
    try {
      exector();
    } catch (error) {
      throw error;
    }
    return context;
  }
}

export default Interceptor;
