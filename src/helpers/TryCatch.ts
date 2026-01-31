export function TryCatch() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (req, res, next) {
      try {
        await originalMethod.call(this, req, res, next);
      } catch (err) {
        console.error('TryCatch', err);
        next(err);
      }
    };

    return descriptor;
  };
}
