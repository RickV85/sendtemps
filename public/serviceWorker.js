self.addEventListener("install", () => {
  // console.log("sw installed");
});

self.addEventListener("activate", () => {
  // console.log("sw activated");
});

// Added to trigger browser add to home screen pop-up
self.addEventListener("fetch", (e) => {
  // console.log("sw fetch event", e);
});