'use strict';

var constant = {};
constant.corpID = "wx9b41eed392c6d447";
constant.token = "GuEccJzML5RxVB8fLhhzRPBda5aJNw5J";
constant.encodingAESKey = "FWj4LPoWHVbHglyHnxC4gifhjFfOn89hfYXMH3Y7N9b";
constant.qyapiPrefix = "https://qyapi.weixin.qq.com/cgi-bin/";
constant.smartStationSuite = {};
constant.smartStationSuite.suiteID = "tj75d1122acf5ed4aa";
constant.smartStationSuite.suiteSecret = "YpLfaMsOAR0e0TKSSjQRNfgIMd-bHew9kyNMqHghaHcF9HOdHBGXNs7CNbOiPER1";
constant.smartStationSuite.waterStationApp = {};
constant.smartStationSuite.waterStationApp.menu = {
    "button": [
        {
            "type": "view",
            "name": "����̨",
            "url": "http://pascal.gridvo.com/wechat/ui"
        },
        {
            "type": "view",
            "name": "������ͼ",
            "url": "#"
        },
        {
            "name": "������־",
            "sub_button": [
                {
                    "type": "view",
                    "name": "���Ӱ�",
                    "url": "#"
                },
                {
                    "type": "view",
                    "name": "̨ ��",
                    "url": "#"
                }
            ]
        }
    ]
};
module.exports = constant;