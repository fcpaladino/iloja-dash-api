export const logDev = (...args) => {
  console.log('\n', ...args, '\n');
}

export const logDevJson = (arg:any) => {
  console.log('\n', JSON.stringify(arg, null, 2), '\n');
}
