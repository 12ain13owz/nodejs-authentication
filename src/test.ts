// function test():number {
//   return 1;
// }

// function clg<T>() {
//   const a = test() as T;
//   return a;
// }

// const b = clg();

// console.log("Type: ", );

function getFirst<T>(arr: T[]): T {
  return arr[0];
}

const a = getFirst<number>([1, 2, 3]);
//    a: number

const b = getFirst<string>(["One", "Two", "Three", "Four", "Five"]);
//    b: string

console.log(b);
