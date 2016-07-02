
export function objectAverage(objArr, pass: Array<string> = [], fn = (a) => a) :any {
  const keys = Object.keys(objArr[0]);
  const keyProps = keys.map(key => {
    if (pass.indexOf(key) !== -1) return { [key]: objArr[0][key] };
    if (!(typeof objArr[0][key] === "number")) return { [key]: objArr[0][key] };
    return {
      [key]: objArr.reduce((pre, cur, index) => {
        const div = index === 0 ? 1 : 2;
        return fn((pre + cur[key]) / div);
      }, 0)
    };
  });
  return keyProps.reduce((cur, pre) => Object.assign({}, cur, pre), {});
};
