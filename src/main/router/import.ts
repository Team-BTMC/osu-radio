import "./dir-router";
import "./error-router";
import "./queue";
import "./resource-router";
import "./songs-pool-router";
import "./search-router";



// Router.respond("bidirectionalInit", () => {
//   return {
//     initialIndex: 1
//   }
// });
//
// const BUFFER_SIZE = 10;
//
// Router.respond("bidirectional", (_evt, request) => {
//   if (request.index < 0 || request.index === 20) {
//     return none();
//   }
//
//   if (request.direction === "up") {
//     return some({
//       index: request.index - 1,
//       total: 200,
//         items: new Array(BUFFER_SIZE)
//           .fill(request.index * BUFFER_SIZE)
//           .map((n, i) => n + i)
//     });
//   }
//
//   return some({
//     index: request.index + 1,
//     total: 200,
//     items: new Array(BUFFER_SIZE)
//       .fill(request.index * BUFFER_SIZE)
//       .map((n, i) => n + i)
//   });
// });