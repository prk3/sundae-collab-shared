"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var BadPath = /** @class */ (function (_super) {
    __extends(BadPath, _super);
    function BadPath(message) {
        var _this = _super.call(this, message) || this;
        _this.name = _this.constructor.name;
        return _this;
    }
    return BadPath;
}(Error));
var INTEGER_REGEX = /^([1-9][0-9]*|0)$/;
/**
 * Extracts a part of a document pointed by path (JSON pointer string).
 * Returns a tuple with a value and a function that wraps jot operation
 * with necessary ATINDEX and APPLY operations so that it affects correct,
 * possibly nested field. jot dependency must be passed as an argument.
 */
function reach(doc, path, explicitJot) {
    var fields = path === '' ? [] : path.split('/').slice(1);
    var enhancers = [];
    var value = doc;
    var _loop_1 = function () {
        var field = fields.shift();
        if (Array.isArray(value)) {
            if (!field.match(INTEGER_REGEX)) {
                throw new BadPath('Non integer array index.');
            }
            var index_1 = Number(field);
            if (index_1 >= value.length) {
                throw new BadPath('Index out of bounds.');
            }
            enhancers.push(function (op) { return new explicitJot.ATINDEX(index_1, op); });
            value = value[index_1];
        }
        else if (typeof value === 'object' && value) {
            if (!(field in value)) {
                throw new BadPath('Property missing.');
            }
            enhancers.push(function (op) { return new explicitJot.APPLY(field, op); });
            value = value[field];
        }
        else {
            throw new BadPath('Path dereferences null or primitive.');
        }
    };
    while (fields.length > 0) {
        _loop_1();
    }
    return [value, function (op) { return enhancers.reduceRight(function (acc, enhancer) { return enhancer(acc); }, op); }];
}
exports.default = reach;
//# sourceMappingURL=reach.js.map