Today we are going to be demonstrating how to create a retry wrapper for any async function

Let's kickoff with an example function that only works every second time you call it

```js
let _everySecond = 0;
async function everySecond() {
  if (++_everySecond % 2 == 0) {
    return 'success';
  }
  throw new Error('fail');
}
```

This is just a place holder for a real world function that works unreliably. 

We can demonstrate this by calling this from a main function

```js
async function main() {
  try {
    console.log(await everySecond()); // First call 
  }
  catch (e) {
    console.log((e as Error).message);
  }
  console.log(await everySecond()); // Second call 
  try {
    console.log(await everySecond()); // Third call 
  }
  catch (e) {
    console.log((e as Error).message);
  }
  console.log(await everySecond()); // Fourth call 
}

main();
```

***Run demo***
You can see that the first call fails and the second call succeeds, the third call fails and then the fourth call succeeds. 

Now lets write a simple retry utility function. 

 