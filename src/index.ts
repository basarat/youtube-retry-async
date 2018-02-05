let _everySecond = 0;
async function everySecond() {
  if (++_everySecond % 2 == 0) {
    return 'success';
  }
  throw new Error('fail');
}

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