export function* genTest123(...args: any[]): Generator<unknown, any, unknown> {

    yield 1; // { value: 1, done: false}
    yield 2;// { value: 1, done: false}
    yield 3;// { value: 1, done: false}

    return 4; // { value: 4, done: true}
}
