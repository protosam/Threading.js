/* jsdom package

Includes a virtual DOM (jsdom), jQuery, and a MutationObserver.

To compile, run:
./buildpackage.sh dompackage
 */
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM(`<!DOCTYPE html>`);
const $ = require('jquery')(window);

self["$"] = $;
self["window"] = window;
self["document"] = window.document;
self["jsdom"] = jsdom;

require("./mutationobserver");
