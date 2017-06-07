/* jsdom package

Includes a virtual DOM (jsdom), jQuery, and a MutationObserver.

To compile, run:
./build-dompackage.sh
 */
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM(`<!DOCTYPE html>`);
const jQuery = require('jquery')(window);

self["jQuery"] = jQuery;
self["window"] = window;
self["document"] = window.document;
self["jsdom"] = jsdom;

self["diffDOM"] = require("./dependency.diffDOM.js");

