Today we are going to be demonstrating how to create a retry wrapper for any async function

Let's kickoff with an example function that only works every second time you call it

```js
let _track = 0;
async function sometimesSucceeds() {
  if (++_track % 2 == 0) {
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
    console.log(await sometimesSucceeds()); // First call 
  }
  catch (e) {
    console.log((e as Error).message);
  }
  console.log(await sometimesSucceeds()); // Second call 
  try {
    console.log(await sometimesSucceeds()); // Third call 
  }
  catch (e) {
    console.log((e as Error).message);
  }
  console.log(await sometimesSucceeds()); // Fourth call 
}

main();
```

***Run demo***
You can see that the first call fails and the second call succeeds, the third call fails and then the fourth call succeeds. 

Now lets write a simple retry utility function. 
* Its takes an function that returns a promise of type T, 
* And a number of attempts to try 
* This function itself returns a promise of type T
  * Within body we track any last error 
  * Next we try to call the function n times tracking the last error at each point, 
* If the function never succeeds in the n times we throw the last error.

```js
async function retry<T>(fn: () => Promise<T>, n: number): Promise<T> {
  let lastError: any;
  for (let index = 0; index < n; index++) {
    try {
      return await fn();
    }
    catch (e) {
      lastError = e;
    }
  }
  throw lastError;
}
```

Now in our main function body we can easily create a safe version of the `sometimesSucceeds` function by wrapping it in a retry with 2 attempts.

Now if we call this safe function you can see that it works every single time. 

```js
async function main() {
  const safe = () => retry(sometimesSucceeds, 2);
  console.log(await safe());
  console.log(await safe());
  console.log(await safe());
  console.log(await safe());
}
```

As a final example lets make the `sometimesSucceeds` function succeed only every 5th time and lets bump up our `safe` version to `10` reattempts

```js
let _track = 0;
async function sometimesSucceeds() {
  if (++_track % 5 == 0) {
    return 'success';
  }
  throw new Error('fail');
}
async function main() {
  const safe = () => retry(sometimesSucceeds, 10);
  console.log(await safe());
  console.log(await safe());
  console.log(await safe());
  console.log(await safe());
}
```

You can see how any unsafe function can be scalled to a desired level of reliability.

> Thanks for watching, If you enjoyed this video and would like to learn more JavaScript patterns and practices don't forget to subscribe.
