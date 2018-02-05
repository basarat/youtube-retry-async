let _track = 0;
async function sometimesSucceeds() {
  if (++_track % 5 == 0) {
    return 'success';
  }
  throw new Error('fail');
}

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

async function main() {
  const safe = () => retry(sometimesSucceeds, 10);
  console.log(await safe());
  console.log(await safe());
  console.log(await safe());
  console.log(await safe());
}

main();