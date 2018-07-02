"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (callback) {
    // connect to a database if needed, then pass it to `callback`:

    var testDb = {
        "database": {
            "0": "blah blah blah",
            "1": "blue blue blue"
        }
    };

    callback(testDb);
};
//# sourceMappingURL=db.js.map