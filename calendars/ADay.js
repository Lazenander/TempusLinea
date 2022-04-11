function forward(timeValues, dist = 1) {
    if (dist < 0)
        return backward(timeValues, -dist);
    timeValues[0] = parseInt(timeValues[0]);
    timeValues[1] = parseInt(timeValues[1]);
    timeValues[2] = parseInt(timeValues[2]);
    let int1 = timeValues[0] * 3600 + timeValues[1] * 60 + timeValues[2];
    int1 += dist;
    timeValues[0] = Math.floor(int1 / 3600);
    timeValues[1] = Math.floor((int1 % 3600) / 60);
    timeValues[2] = int1 % 60;
    timeValues = timeValues.toString().split(',');
    if (!isValid(timeValues))
        timeValues = ["23", "59", "59"];
    return timeValues;
}

function backward(timeValues, dist = 1) {
    if (dist < 0)
        return forward(timeValues, -dist);
    timeValues[0] = parseInt(timeValues[0]);
    timeValues[1] = parseInt(timeValues[1]);
    timeValues[2] = parseInt(timeValues[2]);
    let int1 = timeValues[0] * 3600 + timeValues[1] * 60 + timeValues[2];
    int1 -= dist;
    timeValues[0] = Math.floor(int1 / 3600);
    timeValues[1] = Math.floor((int1 % 3600) / 60);
    timeValues[2] = int1 % 60;
    timeValues = timeValues.toString().split(',');
    if (!isValid(timeValues))
        timeValues = ["0", "0", "0"];
    return timeValues;
}

function distance(timeValues1, timeValues2) {
    timeValues1[0] = parseInt(timeValues1[0]);
    timeValues1[1] = parseInt(timeValues1[1]);
    timeValues1[2] = parseInt(timeValues1[2]);
    timeValues2[0] = parseInt(timeValues2[0]);
    timeValues2[1] = parseInt(timeValues2[1]);
    timeValues2[2] = parseInt(timeValues2[2]);
    let int1 = timeValues1[0] * 3600 + timeValues1[1] * 60 + timeValues1[2];
    let int2 = timeValues2[0] * 3600 + timeValues2[1] * 60 + timeValues2[2];
    return int1 - int2;
}

function isValid(timeValues) {
    timeValues[0] = parseInt(timeValues[0]);
    timeValues[1] = parseInt(timeValues[1]);
    timeValues[2] = parseInt(timeValues[2]);
    if (timeValues[0] >= 0 && timeValues[0] < 24)
        if (timeValues[1] >= 0 && timeValues[1] < 60)
            if (timeValues[2] >= 0 && timeValues[2] < 60)
                return true;
    return false;
}

function print(timeValues) {
    timeValues = timeValues.toString().split(',');
    if (timeValues[0].length == 1)
        timeValues[0] = "0" + timeValues[0];
    if (timeValues[1].length == 1)
        timeValues[1] = "0" + timeValues[1];
    if (timeValues[2].length == 1)
        timeValues[2] = "0" + timeValues[2];
    return timeValues[0] + ":" + timeValues[1] + ":" + timeValues[2];
}

exports.info = {
    timeValueNames: ["时 Hour", "分 Minute", "秒 Second"],
    timeValueLength: 3,
    defaultStartTime: ["0", "0", "0"],
    defaultEndTime: ["23", "59", "59"],
    version: "1.0.0",
};
exports.forward = forward;
exports.backward = backward;
exports.distance = distance;
exports.isValid = isValid;
exports.print = print;