function forward(timeValues, dist = 1) {
    if (dist < 0)
        return backward(timeValues, -dist);
    timeValues[0] = parseInt(timeValues[0]);
    timeValues[1] = parseInt(timeValues[1]);
    timeValues[2] = parseInt(timeValues[2]);
    for (let i = 0; i < dist; i++) {
        timeValues[2]++;
        switch (timeValues[1]) {
            case 1:
                if (timeValues[2] > 31) {
                    timeValues[1]++;
                    timeValues[2] = 1;
                }
                break;
            case 2:
                if (timeValues[0] % 4 == 0 && timeValues[0] % 400 != 0) {
                    if (timeValues[2] > 29) {
                        timeValues[1]++;
                        timeValues[2] = 1;
                    }
                } else {
                    if (timeValues[2] > 28) {
                        timeValues[1]++;
                        timeValues[2] = 1;
                    }
                }
                break;
            case 3:
                if (timeValues[2] > 30) {
                    timeValues[1]++;
                    timeValues[2] = 1;
                }
                break;
            case 4:
                if (timeValues[2] > 31) {
                    timeValues[1]++;
                    timeValues[2] = 1;
                }
                break;
            case 5:
                if (timeValues[2] > 30) {
                    timeValues[1]++;
                    timeValues[2] = 1;
                }
                break;
            case 6:
                if (timeValues[2] > 31) {
                    timeValues[1]++;
                    timeValues[2] = 1;
                }
                break;
            case 7:
                if (timeValues[2] > 31) {
                    timeValues[1]++;
                    timeValues[2] = 1;
                }
                break;
            case 8:
                if (timeValues[2] > 31) {
                    timeValues[1]++;
                    timeValues[2] = 1;
                }
                break;
            case 9:
                if (timeValues[2] > 30) {
                    timeValues[1]++;
                    timeValues[2] = 1;
                }
                break;
            case 10:
                if (timeValues[2] > 31) {
                    timeValues[1]++;
                    timeValues[2] = 1;
                }
                break;
            case 11:
                if (timeValues[2] > 30) {
                    timeValues[1]++;
                    timeValues[2] = 1;
                }
                break;
            case 12:
                if (timeValues[2] > 31) {
                    timeValues[1] = 1;
                    timeValues[2] = 1;
                    timeValues[0]++;
                }
                break;
        }
    }
    return timeValues;
}

function backward(timeValues, dist = 1) {
    if (dist < 0)
        return forward(timeValues, -dist);
    timeValues[0] = parseInt(timeValues[0]);
    timeValues[1] = parseInt(timeValues[1]);
    timeValues[2] = parseInt(timeValues[2]);
    for (let i = 0; i < dist; i++) {
        timeValues[2]--;
        switch (timeValues[1]) {
            case 1:
                if (timeValues[2] < 1) {
                    timeValues[1] = 12;
                    timeValues[2] = 31;
                    timeValues[0]--;
                }
                break;
            case 2:
                if (timeValues[2] < 1) {
                    timeValues[1]--;
                    timeValues[2] = 31;
                }
                break;
            case 3:
                if (timeValues[0] % 4 == 0 && timeValues[0] % 400 != 0) {
                    if (timeValues[2] < 1) {
                        timeValues[1]--;
                        timeValues[2] = 29;
                    }
                } else {
                    if (timeValues[2] < 1) {
                        timeValues[1]--;
                        timeValues[2] = 28;
                    }
                }
                break;
            case 4:
                if (timeValues[2] < 1) {
                    timeValues[1]--;
                    timeValues[2] = 31;
                }
                break;
            case 5:
                if (timeValues[2] < 1) {
                    timeValues[1]--;
                    timeValues[2] = 30;
                }
                break;
            case 6:
                if (timeValues[2] < 1) {
                    timeValues[1]--;
                    timeValues[2] = 31;
                }
                break;
            case 7:
                if (timeValues[2] < 1) {
                    timeValues[1]--;
                    timeValues[2] = 30;
                }
                break;
            case 8:
                if (timeValues[2] < 1) {
                    timeValues[1]--;
                    timeValues[2] = 31;
                }
                break;
            case 9:
                if (timeValues[2] < 1) {
                    timeValues[1]--;
                    timeValues[2] = 31;
                }
                break;
            case 10:
                if (timeValues[2] < 1) {
                    timeValues[1]--;
                    timeValues[2] = 30;
                }
                break;
            case 11:
                if (timeValues[2] < 1) {
                    timeValues[1]--;
                    timeValues[2] = 31;
                }
                break;
            case 12:
                if (timeValues[2] < 1) {
                    timeValues[1]--;
                    timeValues[2] = 30;
                }
                break;
        }
    }
    return timeValues;
}

function distance(timeValues1, timeValues2) {
    timeValues1[0] = parseInt(timeValues1[0]);
    timeValues1[1] = parseInt(timeValues1[1]);
    timeValues1[2] = parseInt(timeValues1[2]);
    timeValues2[0] = parseInt(timeValues2[0]);
    timeValues2[1] = parseInt(timeValues2[1]);
    timeValues2[2] = parseInt(timeValues2[2]);
    if (timeValues1[0] == timeValues2[0]) {
        let int1 = 0;
        let int2 = 0;
        let timeValues = [timeValues1[0], "1", "1"];
        while (timeValues[0] != timeValues1[0] || timeValues[1] != timeValues1[1] || timeValues[2] != timeValues1[2]) {
            timeValues = forward(timeValues);
            int1++;
        }
        timeValues = [timeValues2[0], "1", "1"];
        while (timeValues[0] != timeValues2[0] || timeValues[1] != timeValues2[1] || timeValues[2] != timeValues2[2]) {
            timeValues = forward(timeValues);
            int2++;
        }
        return int1 - int2;
    } else if (timeValues1[0] > timeValues2[0]) {
        let int1 = 0;
        let int2 = 0;
        let timeValues = [timeValues1[0], "1", "1"];
        while (timeValues[0] != timeValues1[0] || timeValues[1] != timeValues1[1] || timeValues[2] != timeValues1[2]) {
            timeValues = forward(timeValues);
            int1++;
        }
        timeValues = [timeValues2[0], "12", "31"];
        while (timeValues[0] != timeValues2[0] || timeValues[1] != timeValues2[1] || timeValues[2] != timeValues2[2]) {
            timeValues2 = forward(timeValues2);
            int2++;
        }
        let jumpYearNum = Math.max(0, Math.floor((timeValues1[0] - 1) / 4) - Math.floor((timeValues2[0] + 1) / 4));
        return 365 * (timeValues1[0] - timeValues2[0] - 1) + jumpYearNum + int1 + int2 + 1;
    } else {
        return -distance(timeValues2, timeValues1);
    }
}

function isValid(timeValues) {
    timeValues[0] = parseInt(timeValues[0]);
    timeValues[1] = parseInt(timeValues[1]);
    timeValues[2] = parseInt(timeValues[2]);
    if (timeValues[1] > 0 && timeValues[1] <= 12)
        switch (timeValues[1]) {
            case 1:
                if (timeValues[2] > 31)
                    return false;
                return true;
            case 2:
                if (timeValues[0] % 4 == 0 && timeValues[0] % 400 != 0) {
                    if (timeValues[2] > 29)
                        return false;
                    return true;
                }
                if (timeValues[2] > 28)
                    return false;
                return true;
            case 3:
                if (timeValues[2] > 30)
                    return false;
                return true;
            case 4:
                if (timeValues[2] > 31)
                    return false;
                return true;
            case 5:
                if (timeValues[2] > 30)
                    return false;
                return true;
            case 6:
                if (timeValues[2] > 31)
                    return false;
                return true;
            case 7:
                if (timeValues[2] > 31)
                    return false;
                return true;
            case 8:
                if (timeValues[2] > 31)
                    return false;
                return true;
            case 9:
                if (timeValues[2] > 30)
                    return false;
                return true;
            case 10:
                if (timeValues[2] > 31)
                    return false;
                return true;
            case 11:
                if (timeValues[2] > 30)
                    return false;
                return true;
            case 12:
                if (timeValues[2] > 31)
                    return false;
                return true;
        }
    return false;
}

function print(timeValues) {
    let period = "AD ";
    if (parseInt(timeValues[0]) < 0)
        period = "BC ";
    timeValues[0] = Math.abs(parseInt(timeValues[0]));
    return period + timeValues[0] + "." + timeValues[1] + "." + timeValues[2];
}


exports.info = {
    timeValueNames: ["年 Year", "月 Month", "日 Day"],
    timeValueLength: 3,
    defaultStartTime: [2020, 1, 1],
    defaultEndTime: [2030, 1, 1],
    version: "1.0.0",
};
exports.forward = forward;
exports.backward = backward;
exports.distance = distance;
exports.isValid = isValid;
exports.print = print;