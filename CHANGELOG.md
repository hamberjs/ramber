# ramber changelog

## 0.27.0

* Change license from LIL to MIT
* Fix index server route mapping

## 0.26.1

* Handle skipped segments

## 0.26.0

* Update to Hamber 3
* Slot-based nested routes
* Make `page`, `preloading` and `session` stores available to components
* Handle missing/empty refs when exporting
* Prevent race condition when exporting
* Fix redirects with base path
* Add `<link rel="preload">` to exported HTML
* Handle deep links that are invalid selectors on initial load
* Use shared queue for exporting
* Handle `+` character in query string
* Spread routes
* Fix navigation from `/a/[id]` to `/b/[id]`
* Allow `preload` functions to return falsy values
* Mount error pages correctly
