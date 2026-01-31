// // import * as Sentry from "@sentry/node";
// // import { UserRequest } from "../helpers/UserRequest";
//
//
// export class ErrorLogger {
//
//   static log(err: Error, functionName: string, extras?: Record<string, any>): void;
//   static log(err: Error, extras?: Record<string, any>): void;
//
//   static log(err: Error,
//              functionNameOrExtras?: string | Record<string, any>,
//              maybeExtras?: Record<string, any>): void {
//
//     if (!(err instanceof Error)) {
//       console.log("O argumento não é uma instância de Error.");
//       return;
//     }
//
//     let functionName = "undefined";
//     let extras: Record<string, any> | undefined;
//     if (typeof functionNameOrExtras === "string") {
//       functionName = functionNameOrExtras;
//       extras = maybeExtras;
//     } else {
//       extras = functionNameOrExtras;
//     }
//
//
//     const userData = UserRequest.get();
//
//
//     // Get StackTrace
//     const stackLines = err.stack.split("\n");
//     let fileName = '***';
//     let lineNumber = '0';
//
//     if (stackLines.length > 1) {
//       // Formato esperado: "    at nomeDaFuncao (caminho/do/arquivo.js:linha:coluna)"
//       const regex = /\s*at\s+(.*?)\s+\((.*?):(\d+):(\d+)\)/;
//       const match = regex.exec(stackLines[2]);
//       if (match && functionName === "undefined") {
//         functionName = match[1];
//         fileName = match[2];
//         lineNumber = match[3];
//       } else {
//         // Tenta outro formato: "    at caminho/do/arquivo.js:linha:coluna"
//         const regex2 = /\s*at\s+(.*?):(\d+):(\d+)/;
//         const match2 = regex2.exec(stackLines[1]);
//         if (match2) {
//           fileName = match2[1];
//           lineNumber = match2[2];
//         }
//       }
//     }
//
//     const msgErro = `
//     File: ${fileName}
//     Function: ${functionName}
//     Line: ${lineNumber}
//     Message: ${err.message}
//     Stacktrace: ${err.stack}
//     `
//
//     console.log("❌ Error:", msgErro);
//
//     // if (Sentry) {
//       // Sentry.configureScope(function (scope) {
//       //   scope.clear();
//       //   scope.setUser({ id: userData?.userId })
//       //   scope.setExtra('fileName', fileName);
//       //   scope.setExtra('function', functionName)
//       //   scope.setExtra('companyId', userData?.companyId)
//       //   scope.setExtra('companyName', userData?.companyName)
//       //   scope.setExtra('userId', userData?.userId)
//       //   scope.setExtra('userEmail', userData?.userEmail)
//       //   // scope.setExtra('tokenHeader', tokenHeader)
//       //   scope.setTag('companyId', userData?.companyId);
//       //
//       //   if (extras) {
//       //     for (const [key, value] of Object.entries(extras)) {
//       //       scope.setExtra(key, value);
//       //     }
//       //   }
//       //
//       //   Sentry.captureException(err);
//       //
//       // });
//     // }
//   }
// }
