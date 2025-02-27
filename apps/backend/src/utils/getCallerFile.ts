import path from 'path';
export function _getCallerFile(stackPoint = 1) {
  const err = new Error();

  Error.prepareStackTrace = (_, stack) => stack;

  const stack = err.stack as unknown as NodeJS.CallSite[];

  Error.prepareStackTrace = undefined;
  const filePath = stack[stackPoint].getFileName();
  return path.basename(filePath as string);
}
