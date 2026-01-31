// import * as Sentry from '@sentry/node';

export function SentryProfile(nameOverride?: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const className = target.constructor.name;
      const methodName = propertyKey;

      const transactionName = nameOverride || `${className}.${methodName}`;
      console.log(`Starting transaction: ${transactionName}`);

      // const existingTransaction = Sentry.getCurrentHub().getScope()?.getTransaction();
      let createdTransaction = false;
      // let transaction = existingTransaction;

      // if (!transaction) {
      //   transaction = Sentry.startTransaction({
      //     name: transactionName,
      //     op: 'function.profile'
      //   });
      //   Sentry.getCurrentHub().configureScope(scope => {
      //     scope.setSpan(transaction!);
      //   });
      //   createdTransaction = true;
      // }

      try {
        return await originalMethod.apply(this, args);
      } finally {
        // if (createdTransaction && transaction) {
        //   transaction.finish();
        // }
      }
    };

    return descriptor;
  };
}
