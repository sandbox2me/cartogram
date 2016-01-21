(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Cartogram"] = factory();
	else
		root["Cartogram"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }\n\nvar _curve = __webpack_require__(1);\n\nvar _curve2 = _interopRequireDefault(_curve);\n\ndescribe('generateQuadraticBezierCurve', function () {\n\n    it('generates a single point accurately', function () {\n        expect(generateQuadraticCurve({ x: 0, y: 100 }, { x: 100, y: 200 }, { x: 200, y: 0 }, 1)[0]).toBeTruthy();\n    });\n});\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/utils/curve.spec.js\n ** module id = 0\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./src/utils/curve.spec.js?");

/***/ },
/* 1 */
/***/ function(module, exports) {

	eval("/**\n * generateQuadraticBezierCurve\n * derived from: http://math.stackexchange.com/questions/1360891/find-quadratic-bezier-curve-equation-based-on-its-control-points\n *\n * @param  {Object} controlPoint0 x, y coords for the first control point\n * @param  {Object} controlPoint1 x, y coords for the second control point\n * @param  {Object} controlPoint2 x, y coords for the third control point\n * @param  {Integer} steps the number of points to generate\n * @return {Array<Object>} an array of x,y coordinates for the number of steps specified\n */\n\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\nexports.generateQuadraticBezierCurve = generateQuadraticBezierCurve;\n\nfunction generateQuadraticBezierCurve(controlPoint0, controlPoint1, controlPoint2, steps) {\n    var curvePoints = [];\n\n    for (var i = 0; i < steps; i++) {\n        var position = i / steps;\n\n        var positionSquared = position * position;\n        var negativePosition = 1 - position;\n        var negativePositionSquared = negativePosition * negativePosition;\n\n        var a = negativePositionSquared;\n        var b = negativePosition * position * 2;\n        var c = positionSquared;\n\n        curvePoints.push({\n            x: a * controlPoint0.x + b * controlPoint1.x + c * controlPoint2.x,\n            y: a * controlPoint0.y + b * controlPoint1.y + c * controlPoint2.y\n        });\n    }\n\n    return curvePoints;\n}\n\n;\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/utils/curve.js\n ** module id = 1\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./src/utils/curve.js?");

/***/ }
/******/ ])
});
;