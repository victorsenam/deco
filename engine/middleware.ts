import {
  BaseContext,
  Resolvable,
  Resolver,
} from "$live/engine/core/resolver.ts";

export interface ResolverMiddlewareContext<T> extends BaseContext {
  next?(): Promise<T>;
}
export type ResolverMiddleware<
  T,
  TParent = unknown,
  TContext extends ResolverMiddlewareContext<T> = ResolverMiddlewareContext<T>,
> = Resolver<T, TParent, TContext>;

export const compose = <
  T,
  TParent,
  TContext extends ResolverMiddlewareContext<T>,
>(
  ...middlewares: ResolverMiddleware<T, TParent, TContext>[]
): Resolver<T, TParent, TContext> => {
  const last = middlewares[middlewares.length - 1];
  return async function (p: TParent, ctx: TContext) {
    // last called middleware #
    let index = -1;
    return await dispatch(0);
    async function dispatch(
      i: number,
      // deno-lint-ignore no-explicit-any
    ): Promise<Resolvable<T, TContext, any>> {
      if (i <= index) {
        return Promise.reject(new Error("next() called multiple times"));
      }
      index = i;
      const resolver = middlewares[i];
      if (i === middlewares.length) {
        return await last(p, ctx);
      }
      return await resolver(p, {
        ...ctx,
        next: dispatch.bind(null, i + 1),
      });
    }
  };
};
