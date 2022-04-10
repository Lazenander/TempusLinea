function forward(timeValues, dist = 1) {
    if (dist < 0)
        return backward(timeValues, -dist);
    timeValues[0] = parseInt(timeValues[0]);
    timeValues[1] = parseInt(timeValues[1]) - 1;
    timeValues[2] = parseInt(timeValues[2]) - 1;
    timeValues[3] = parseInt(timeValues[3]) - 1;
    let int1 = timeValues[0] * 360 + timeValues[1] * 90 + timeValues[2] * 10 + timeValues[3];
    int1 += dist;
    console.log(int1);
    timeValues[0] = Math.floor(int1 / 360);
    timeValues[1] = Math.floor((int1 - timeValues[0] * 360) / 90);
    timeValues[2] = Math.floor((int1 - timeValues[0] * 360 - timeValues[1] * 90) / 10);
    timeValues[3] = Math.floor((int1 - timeValues[0] * 360 - timeValues[1] * 90 - timeValues[2] * 10));
    timeValues[1]++;
    timeValues[2]++;
    timeValues[3]++;
    timeValues = timeValues.toString().split(',');
    return timeValues;
}

function backward(timeValues, dist = 1) {
    if (dist < 0)
        return forward(timeValues, -dist);
    timeValues[1] = parseInt(timeValues[1]) - 1;
    timeValues[2] = parseInt(timeValues[2]) - 1;
    timeValues[3] = parseInt(timeValues[3]) - 1;
    let int1 = timeValues[0] * 360 + timeValues[1] * 90 + timeValues[2] * 10 + timeValues[3];
    int1 -= dist;
    timeValues[0] = Math.floor(int1 / 360);
    timeValues[1] = Math.floor((int1 - timeValues[0] * 360) / 90);
    timeValues[2] = Math.floor((int1 - timeValues[0] * 360 - timeValues[1] * 90) / 10);
    timeValues[3] = Math.floor((int1 - timeValues[0] * 360 - timeValues[1] * 90 - timeValues[2] * 10));
    timeValues[1]++;
    timeValues[2]++;
    timeValues[3]++;
    timeValues = timeValues.toString().split(',');
    if (!isValid(timeValues))
        timeValues = ["0", "1", "1", "1"];
    return timeValues;
}

function distance(timeValues1, timeValues2) {
    timeValues1[0] = parseInt(timeValues1[0]);
    timeValues1[1] = parseInt(timeValues1[1]);
    timeValues1[2] = parseInt(timeValues1[2]);
    timeValues1[3] = parseInt(timeValues1[3]);
    timeValues2[0] = parseInt(timeValues2[0]);
    timeValues2[1] = parseInt(timeValues2[1]);
    timeValues2[2] = parseInt(timeValues2[2]);
    timeValues2[3] = parseInt(timeValues2[3]);
    let int1 = timeValues1[0] * 360 + timeValues1[1] * 90 + timeValues1[2] * 10 + timeValues1[3];
    let int2 = timeValues2[0] * 360 + timeValues2[1] * 90 + timeValues2[2] * 10 + timeValues2[3];
    return int1 - int2;
}

function isValid(timeValues) {
    timeValues[0] = parseInt(timeValues[0]);
    timeValues[1] = parseInt(timeValues[1]);
    timeValues[2] = parseInt(timeValues[2]);
    timeValues[3] = parseInt(timeValues[3]);
    if (timeValues[0] >= 0)
        if (timeValues[1] > 0 && timeValues[1] <= 4)
            if (timeValues[2] > 0 && timeValues[2] <= 9)
                if (timeValues[3] > 0 && timeValues[3] <= 10)
                    return true;
    return false;
}

function print(timeValues) {
    return timeValues[0] + "." + timeValues[1] + "." + timeValues[2] + "." + timeValues[3];
}

exports.info = {
    timeValueNames: ["年 Year", "季 Season", "旬 Week", "日 Day"],
    timeValueLength: 4,
    defaultStartTime: ["0", "1", "1", "1"],
    defaultEndTime: ["10", "1", "1", "1"],
    version: "1.0.0",
};
exports.forward = forward;
exports.backward = backward;
exports.distance = distance;
exports.isValid = isValid;
exports.print = print;