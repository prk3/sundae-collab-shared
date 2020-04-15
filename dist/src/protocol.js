"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var yup = __importStar(require("yup"));
/**
 * Validates the shape of a request packet.
 */
exports.requestPacketValidator = yup.object().required().shape({
    uid: yup.string().required(),
    message: yup.mixed().defined(),
});
/**
 * Validates the shape of a response packet.
 */
exports.responsePacketValidator = yup.object().required().shape({
    responseTo: yup.string().required(),
    data: yup.mixed().defined(),
});
/**
 * Validates the shape of a message.
 */
exports.messageValidator = yup.object().required().shape({
    type: yup.string().required(),
    data: yup.mixed().defined(),
});
/**
 * Validates response data to check if an error occurred.
 */
exports.errorDataValidator = yup.object().required().shape({
    error: yup.object().required().shape({
        name: yup.string().defined(),
        message: yup.string().defined(),
    }),
});
//# sourceMappingURL=protocol.js.map