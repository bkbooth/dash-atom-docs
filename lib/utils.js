/**
 * Filter an array with an async predicate function
 *
 * @param {*[]} arr
 * @param {Function} predicate
 */
async function asyncFilter(arr, predicate) {
  const filtered = Symbol();
  return (await Promise.all(arr.map(async item => ((await predicate(item)) ? item : filtered)))).filter(
    item => item !== filtered
  );
}

module.exports = { asyncFilter };
