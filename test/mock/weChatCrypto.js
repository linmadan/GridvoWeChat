'use strict';

function WeChatCrypto() {
};

WeChatCrypto.prototype.getSignature = function () {
    return "signature";
};

WeChatCrypto.prototype.decrypt = function () {
    return {message: "echostr"};
};

module.exports = WeChatCrypto;