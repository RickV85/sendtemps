// self.addEventListener("install", () => {
  // console.log("sw installed");
// });

// self.addEventListener("activate", () => {
  // console.log("sw activated");
// });

// Added to trigger browser add to home screen pop-up
// Changed to allow network requests in standalone
// self.addEventListener('fetch', event => {
//   event.respondWith(
//       fetch(event.request)
//           .catch((err) => {
//               alert(`An error occurred with the network.
//               Please try your request again. ${err}`)
//           })
//   );
// });