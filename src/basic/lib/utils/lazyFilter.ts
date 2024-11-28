export function* lazyFilter<T>(iterable: Iterable<T>, predicates: Array<(item: T) => boolean>): Generator<T> {
  for (const value of iterable) {
    if (predicates.every((predicate) => predicate(value))) {
      yield value;
    }
  }
}