const { ipcRenderer } = require("electron");
const { EVENT, EVENTLIST } = require("../modules/event");

const mainContainer = document.getElementById("mainContainer");

const slider = document.getElementById("sliderSettings");
const hintButton = document.getElementById("hint");
const clockButton = document.getElementById("clock");
const searchButton = document.getElementById("search");
const viewButton = document.getElementById("view");
const infoButton = document.getElementById("info");
const plusButton = document.getElementById("plus");
const zoomInButton = document.getElementById("zoom_in");
const zoomOutButton = document.getElementById("zoom_out");
const sliderButton = document.getElementById("sliders");
const leftTime = document.getElementById("leftTime");
const rightTime = document.getElementById("rightTime");

const timeTypeEditor = document.getElementById("timeTypeEditor");
const timeTypeEditorButton = document.getElementById("timeTypeEditorButton");
const startTimeTypeEditorContainer = document.getElementById("startTimeTypeEditorContainer");
const sliderStartTimeEditor = document.getElementById("sliderStartTimeEditor");
const startTimeTypeEditorButton = document.getElementById("startTimeTypeEditorButton");
const endTimeTypeEditorContainer = document.getElementById("endTimeTypeEditorContainer");
const sliderEndTimeEditor = document.getElementById("sliderEndTimeEditor");
const endTimeTypeEditorButton = document.getElementById("endTimeTypeEditorButton");
const tagsContainer = document.getElementById("tagsContainer");
const sliderTagsEditor = document.getElementById("sliderTagsEditor");
const sliderNewTag = document.getElementById("sliderNewTag");
const sliderDeleteTag = document.getElementById("sliderDeleteTag");
const searchContainer = document.getElementById("searchContainer");
const sliderSearch = document.getElementById("sliderSearch");
const informationContainer = document.getElementById("informationContainer");

const eventEditor = document.getElementById("eventEditor");
const xButton = document.getElementById("x");
const eventTimeEditor = document.getElementById("eventTimeEditor");
const eventTagsEditor = document.getElementById("eventTagsEditor");
const eventEditorNewTag = document.getElementById("eventEditorNewTag");
const eventEditorDeleteTag = document.getElementById("eventEditorDeleteTag");
const eventTitle = document.getElementById("eventTitle");
const eventDescription = document.getElementById("eventDescription");

const eventsContainer = document.getElementById("eventsContainer");
const eventLinesContainer = document.getElementById("eventLinesContainer");

const eventShower = document.getElementById("eventShower");
const eventShowerTime = document.getElementById("eventShowerTime");
const eventShowerTitle = document.getElementById("eventShowerTitle");
const eventShowerTags = document.getElementById("eventShowerTags");
const eventShowerDescription = document.getElementById("eventShowerDescription");

const unsettedTimeRegion = [timeTypeEditor, timeTypeEditorButton];
const settedTimeRegion = [startTimeTypeEditorContainer, startTimeTypeEditorButton, endTimeTypeEditorContainer, endTimeTypeEditorButton];
const viewRegion = [tagsContainer];
const searchRegion = [searchContainer];
const infoRegion = [informationContainer];

const blockWidth = 150;
const blockHeight = 60;
const spaceBetweenBlocks = 30;
const lineWidth = 2;
const startPos = 125;
const endPos = 125;

const emptyEvent = new EVENT([], [], "", "");

let isSliderOpen = false;
let isTimeTypeUnset = true;
let isNewEventOpen = false;
let isEventShowerOpen = false;
let isEventEditorType = { type: "new", event: emptyEvent };

let showEvent = emptyEvent;

let sliderSetting = "clock";

let eventList = new EVENTLIST();
let viewableTags = {};
let viewableText = "";

let pxWidth = 800 - startPos - endPos;

var calendar,
    calendarInfo,
    calendarForward,
    calendarBackward,
    calendarDistance,
    calendarIsValid,
    calendarPrint;
var startTime,
    endTime;

var minimizeTime2px;

ipcRenderer.on("resize", (e, data) => {
    console.log(data[0]);
    let newpxWidth = data[0] - startPos - endPos;
    if (isTimeTypeUnset == false) {
        updateMT2P()
        updateTimeByWidth(newpxWidth);
        pxWidth = newpxWidth;
        updateTimeLine();
        return;
    }
    pxWidth = newpxWidth;
});

function outputSettings() {
    return {
        calender: {
            info: calendarInfo,
            forward: calendarForward,
            backward: calendarBackward,
            distance: calendarDistance,
            isValid: calendarIsValid,
            print: calendarPrint
        },
        startTime: startTime,
        endTime: endTime,
        minimizeTime2px: minimizeTime2px,
        pxWidth: pxWidth,
        viewableTags: viewableTags,
        viewableText: viewableText
    }
}

function readSettings(settings) {
    calendarInfo = settings.calendar.info;
    calendarForward = settings.calendar.forward;
    calendarBackward = settings.calendar.backward;
    calendarDistance = settings.calendar.distance;
    calendarIsValid = settings.calendar.isValid;
    calendarPrint = settings.calendar.print;
    startTime = settings.startTime;
    endTime = settings.endTime;
    minimizeTime2px = settings.minimizeTime2px;
    pxWidth = settings.pxWidth;
    viewableTags = settings.viewableTags;
    viewableText = settings.viewableText;
    ipcRenderer.send("resizeWin", [pxWidth + startPos + endPos, 600]);
    isTimeTypeUnset = false;
}

function updateMT2P() {
    minimizeTime2px = calendarDistance(DEEPCOPY(endTime), DEEPCOPY(startTime)) / pxWidth;
    console.log(minimizeTime2px, pxWidth, calendarDistance(DEEPCOPY(endTime), DEEPCOPY(startTime)));
}

function updateTimeByWidth(newpxWidth) {
    let newDistance = Math.round(minimizeTime2px * (newpxWidth - pxWidth) / 2);
    console.log(newDistance);
    let time1 = calendarBackward(DEEPCOPY(startTime), newDistance);
    let time2 = calendarForward(DEEPCOPY(endTime), newDistance);
    let distanceAfter = calendarDistance(DEEPCOPY(time1), DEEPCOPY(time2));
    if (distanceAfter == 0) {
        time2 = calendarForward(DEEPCOPY(endTime), 1);
        distanceAfter = calendarDistance(DEEPCOPY(time1), DEEPCOPY(time2));
        if (distanceAfter == 0)
            time1 = calendarBackward(DEEPCOPY(startTime), 1);
    }
    if (distanceAfter > 0) {
        let tmp = DEEPCOPY(time1);
        time1 = DEEPCOPY(time2);
        time2 = tmp;
    }
    changeLeftTime(time1);
    changeRightTime(time2);
    console.log(newpxWidth, minimizeTime2px, calendarDistance(DEEPCOPY(endTime), DEEPCOPY(startTime)) / newpxWidth)
}

function DEEPCOPY(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function REND_hideObj(obj) { obj.style.display = "none"; }

function REND_showObj(obj) { obj.style.display = "block"; }

function REND_clearShadow(obj) { obj.style.boxShadow = ""; }

function REND_insetShadow(obj) { obj.style.boxShadow = "inset 0 0 5px #151E17"; }

function REND_outsetShadow(obj) { obj.style.boxShadow = "0 0 5px #151E17"; }

function REND_hideObjs(objs) {
    for (let i = 0; i < objs.length; i++)
        REND_hideObj(objs[i]);
}

function REND_showObjs(objs) {
    for (let i = 0; i < objs.length; i++)
        REND_showObj(objs[i]);
}

function REND_addChild(parent, obj) {
    parent.appendChild(obj);
}

function REND_delChild(parent, obj) {
    parent.removeChild(obj);
}

function REND_UpdateChild(parent, obj) {
    REND_delChild(parent, obj);
    REND_addChild(parent, obj);
}

function level2Y(level) {
    return {
        top: spaceBetweenBlocks + (level - 1) * (blockHeight + spaceBetweenBlocks),
        bottom: level * (blockHeight + spaceBetweenBlocks)
    }
}

function time2X(time) {
    return calendarDistance(DEEPCOPY(time), DEEPCOPY(startTime)) / minimizeTime2px;
}

function formEventLine(xpos, ysize) {
    let eventLine = document.createElement("div");
    eventLine.className = "eventLine";
    eventLine.style.height = ysize + "px";
    eventLine.style.left = xpos - lineWidth / 2 + "px";
    return eventLine;
}

function addEventLine(xpos, level) {
    let eventLine = formEventLine(xpos, level2Y(level).top);
    REND_addChild(eventLinesContainer, eventLine);
}

function formEventBlock(xpos, ypos, event) {
    let eventBlock = document.createElement("div");
    eventBlock.className = "eventBlock";
    eventBlock.style.top = ypos + "px";
    eventBlock.style.left = xpos - blockWidth / 2 + "px";
    eventBlock.onclick = function() {
        if (isEventShowerOpen || isNewEventOpen)
            return;
        showEvent = event;
        ocEventShower();
    }
    let eventBlockTime = document.createElement("div");
    eventBlockTime.className = "eventBlockTime";
    let eventBlockB = document.createElement("b");
    eventBlockB.innerHTML = calendarPrint(event.time);
    let eventBlockTitle = document.createElement("div");
    eventBlockTitle.className = "eventBlockTitle";
    let eventBlockTitleSub = document.createElement("div");
    eventBlockTitleSub.className = "eventBlockTitleSub";
    let eventBlockP = document.createElement("p");
    eventBlockP.innerHTML = event.title;
    REND_addChild(eventBlockTime, eventBlockB);
    REND_addChild(eventBlockTitle, eventBlockP);
    REND_addChild(eventBlock, eventBlockTime);
    REND_addChild(eventBlock, eventBlockTitle);
    return eventBlock;
}

function addEventBlock(xpos, level, event) {
    let eventBlock = formEventBlock(xpos, level2Y(level).top, event);
    REND_addChild(eventsContainer, eventBlock);
}

function addEvent(xpos, level, event) {
    addEventBlock(xpos + startPos, level, event);
    addEventLine(xpos + startPos, level);
}

function renderTimeLine() {
    let region = eventList.giveRegion(startTime, endTime, calendarDistance);
    let mem = [];
    console.log(region.left, region.right);
    for (let i = region.left; i < region.right; i++) {
        let vflag = false;
        for (let j in viewableTags) {
            if (viewableTags[j] && eventList.events[i].isTag(j)) {
                vflag = true;
                break;
            }
        }
        if (!vflag || !eventList.events[i].containText(viewableText))
            continue;
        let xpos = time2X(eventList.events[i].time);
        let level = 1;
        let usedLevels = [];
        for (let j = mem.length - 1; j >= 0; j--) {
            if (xpos - mem[j].xpos >= blockWidth)
                break;
            usedLevels.push(mem[j].level);
        }
        usedLevels.sort();
        for (let j = 0; j < usedLevels.length; j++) {
            if (usedLevels[j] < level)
                continue;
            if (usedLevels[j] == level)
                level++;
            else
                break;
        }
        addEvent(xpos, level, eventList.events[i]);
        mem.push({ xpos: xpos, level: level })
    }
}

function updateTimeLine() {
    eventsContainer.innerHTML = "";
    eventLinesContainer.innerHTML = "";
    updateMT2P();
    renderTimeLine();
}

function timeTypeSetSuccessfully() {
    REND_hideObj(hint);
    isTimeTypeUnset = false;
    sliderContentChanged();
    updateMT2P();
}

function occallSliders() {
    if (isSliderOpen == false) {
        REND_UpdateChild(mainContainer, slider);
        REND_showObj(slider);
        isSliderOpen = true;
        sliderContentChanged();
    } else {
        REND_hideObj(slider);
        isSliderOpen = false;
    }
}

function ocsliderClock() {
    let newSliderSetting = "clock";
    sliderContentChanged(newSliderSetting);
}

function ocsliderView() {
    if (isTimeTypeUnset == false) {
        let newSliderSetting = "view";
        sliderContentChanged(newSliderSetting);
        changeEventEditorTagList();
        changeSliderTagList();
    }
}

function ocsliderSearch() {
    if (isTimeTypeUnset == false) {
        let newSliderSetting = "search";
        sliderContentChanged(newSliderSetting);
    }
}

function ocsliderInfo() {
    let newSliderSetting = "info";
    sliderContentChanged(newSliderSetting);
}

function ocsliderSearchConfirm() {
    viewableText = sliderSearch.value;
    updateTimeLine();
}

function ocsliderTimeTypeEditor() {
    let timeTypes = document.getElementsByName("timeType");
    for (let i = 0; i < timeTypes.length; i++)
        if (timeTypes[i].checked) {
            switch (timeTypes[i].value) {
                case "ADay":
                    loadCalendar("../calendars/ADay.js");
                    break;
                case "Gregorian":
                    loadCalendar("../calendars/Gregorian.js");
                    break;
                case "ECStandard":
                    loadCalendar("../calendars/ECStandard.js");
                    break;
                default:
                    loadCalendar("../calendars/Gregorian.js");
                    break;
            }
            timeTypeSetSuccessfully();
            return;
        }
}

function ocstartSliderTimeTypeEditor() {
    let timeValues = [];
    for (let i = 0; i < calendarInfo.timeValueLength; i++) {
        let timeValue = document.getElementById("startTime" + i).value;
        timeValues.push(timeValue);
    }
    if (calendarIsValid(DEEPCOPY(timeValues)) && calendarDistance(DEEPCOPY(timeValues), DEEPCOPY(endTime)) < 0)
        changeLeftTime(timeValues);
    else if (calendarDistance(DEEPCOPY(timeValues), DEEPCOPY(endTime)) >= 0)
        changeLeftTime(calendarBackward(DEEPCOPY(endTime)));
    for (let i = 0; i < calendarInfo.timeValueLength; i++)
        document.getElementById("startTime" + i).value = startTime[i];
    updateTimeLine();
}

function ocendSliderTimeTypeEditor() {
    let timeValues = [];
    for (let i = 0; i < calendarInfo.timeValueLength; i++) {
        let timeValue = document.getElementById("endTime" + i).value;
        timeValues.push(timeValue);
    }
    if (calendarIsValid(DEEPCOPY(timeValues)) && calendarDistance(DEEPCOPY(startTime), DEEPCOPY(timeValues)) < 0)
        changeRightTime(timeValues);
    else if (calendarDistance(DEEPCOPY(startTime), DEEPCOPY(timeValues)) >= 0)
        changeRightTime(calendarForward(DEEPCOPY(startTime)));
    for (let i = 0; i < calendarInfo.timeValueLength; i++)
        document.getElementById("endTime" + i).value = endTime[i];
    updateTimeLine();
}

function ocx() {
    if (isNewEventOpen) {
        REND_hideObj(eventEditor);
        isNewEventOpen = false;
    }
}

function ocesx() {
    if (isEventShowerOpen) {
        REND_hideObj(eventShower);
        isEventShowerOpen = false;
    }
}

function ocnewEvent() {
    if (isTimeTypeUnset)
        return;
    if (isNewEventOpen == false) {
        refreshEventEditor();
        REND_UpdateChild(mainContainer, eventEditor);
        REND_showObj(eventEditor);
        isNewEventOpen = true;
    }
}

function ocEventShower() {
    if (isEventShowerOpen == false && isNewEventOpen == false) {
        refreshEventShower();
        REND_UpdateChild(mainContainer, eventShower);
        REND_showObj(eventShower);
        isEventShowerOpen = true;
    }
}

function oceventTagsEditorPlus() {
    if (eventEditorNewTag.value != "" && eventList.hasTag(eventEditorNewTag.value) == false) {
        eventList.addTag(eventEditorNewTag.value);
        viewableTags[eventEditorNewTag.value] = true;
        REND_addChild(eventTagsEditor, formEventEditorTag(eventEditorNewTag.value));
        changeSliderTagList();
        eventEditorNewTag.value = "";
    }
}

function oceventTagsEditorMinus() {
    if (eventEditorDeleteTag.value != "") {
        eventList.deleteTag(eventEditorDeleteTag.value);
        changeEventEditorTagList();
        changeSliderTagList();
        eventEditorDeleteTag.value = "";
    }
}

function ocsliderTagsEditorPlus() {
    if (sliderNewTag.value != "" && eventList.hasTag(sliderNewTag.value) == false) {
        eventList.addTag(sliderNewTag.value);
        viewableTags[sliderNewTag.value] = true;
        changeEventEditorTagList();
        changeSliderTagList();
        sliderNewTag.value = "";
    }
}

function ocsliderTagsEditorMinus() {
    if (sliderDeleteTag.value != "") {
        eventList.deleteTag(sliderDeleteTag.value);
        delete viewableTags[sliderDeleteTag.value];
        changeEventEditorTagList();
        changeSliderTagList();
        sliderDeleteTag.value = "";
    }
}

function oczoomIn() {
    if (isTimeTypeUnset)
        return;
    updateTimeByWidth(pxWidth * 0.8);
    updateTimeLine();
}

function oczoomOut() {
    if (isTimeTypeUnset)
        return;
    updateTimeByWidth(pxWidth * 1.25);
    updateTimeLine();
}

function ocSliderTagsEditor() {
    let tags = document.getElementsByName("sliderTag");
    for (let i = 0; i < tags.length; i++) {
        if (tags[i].checked)
            viewableTags[tags[i].value] = true;
        else
            viewableTags[tags[i].value] = false;
    }
    updateTimeLine();
    console.log(viewableTags);
}

function oceventEditorFinished() {
    let eventTime = [];
    for (let i = 0; i < calendarInfo.timeValueLength; i++)
        eventTime.push(document.getElementById("eventTime" + i).value);
    if (!calendarIsValid(DEEPCOPY(eventTime))) {
        alert("时间不存在！Invalid time!");
        return;
    }
    let tags = document.getElementsByName("eventEditorTag");
    let checkedTags = [];
    for (let i = 0; i < eventList.tagsLength; i++) {
        if (tags[i].checked)
            checkedTags.push(tags[i].value);
    }
    if (checkedTags.length == 0) {
        alert("请给予一个标签！No tag!");
        return;
    }
    let title = eventTitle.value;
    if (title == "") {
        alert("无事件标题！No title!");
        return;
    }
    let description = eventDescription.value;
    if (description == "") {
        alert("无事件内容！No description!");
        return;
    }
    console.log(eventTime, checkedTags, title, description);
    console.log(isEventEditorType.type);
    if (isEventEditorType.type == "new")
        eventList.addEvent(new EVENT(eventTime, checkedTags, title, description), calendarDistance);
    else
        eventList.updateEvent(isEventEditorType.event, new EVENT(eventTime, checkedTags, title, description), calendarDistance);
    REND_hideObj(eventEditor);
    updateTimeLine();
    isNewEventOpen = false;
    isEventEditorType = { type: "new", event: emptyEvent };
}

function refreshEventEditor() {
    console.log(isEventEditorType);
    let timeValues = isEventEditorType.event.time,
        tags = isEventEditorType.event.tags,
        title = isEventEditorType.event.title,
        description = isEventEditorType.event.description;
    deleteEventTimeEditorDIV();
    formEventTimeEditorDIV(timeValues);
    let eventEditorTags = document.getElementsByName("eventEditorTag");
    for (let i = 0; i < eventEditorTags.length; i++)
        eventEditorTags[i].checked = false;
    for (let i = 0; i < tags.length; i++)
        for (let j = 0; j < eventEditorTags.length; j++) {
            if (eventEditorTags[j].value == tags[i]) {
                eventEditorTags[j].checked = true;
                break;
            }
        }
    eventTitle.value = title;
    eventDescription.value = description;
}

function refreshEventShower() {
    console.log(isEventEditorType);
    let timeValues = calendarPrint(showEvent.time),
        tags = showEvent.tags,
        title = showEvent.title,
        description = showEvent.description;
    eventShowerTime.textContent = timeValues;
    eventShowerTitle.textContent = title;
    eventShowerTags.textContent = tags.join(", ");
    eventShowerDescription.textContent = description;
}

function ocdeleteShowedEvent() {
    eventList.deleteEvent(showEvent);
    showEvent = emptyEvent;
    ocesx();
    updateTimeLine();
}

function oceditShowedEvent() {
    isEventEditorType = { type: "edit", event: showEvent };
    ocesx();
    refreshEventEditor();
    isNewEventOpen = true;
    REND_showObj(eventEditor);
}

function ocEE() {
    REND_UpdateChild(mainContainer, eventEditor);
}

function ocES() {
    REND_UpdateChild(mainContainer, eventShower);
}

function ocSS() {
    REND_UpdateChild(mainContainer, slider);
}

function loadCalendar(url) {
    calendar = require(url);
    calendarInfo = calendar.info;
    calendarForward = calendar.forward;
    calendarBackward = calendar.backward;
    calendarDistance = calendar.distance;
    calendarIsValid = calendar.isValid;
    calendarPrint = calendar.print;
    loadCalendar2Slider();
    changeLeftTime(calendarInfo.defaultStartTime);
    changeRightTime(calendarInfo.defaultEndTime);
}

function loadCalendar2Slider() {
    formSliderStartTimeEditor();
    formSliderEndTimeEditor();
}

function sliderContentChanged(newSliderSetting = "clock") {
    REND_clearShadow(clockButton);
    REND_clearShadow(viewButton);
    REND_clearShadow(searchButton);
    REND_clearShadow(infoButton);
    REND_hideObjs(unsettedTimeRegion);
    REND_hideObjs(settedTimeRegion);
    REND_hideObjs(searchRegion);
    REND_hideObjs(viewRegion);
    REND_hideObjs(infoRegion);
    switch (newSliderSetting) {
        case "clock":
            REND_insetShadow(clockButton);
            if (isTimeTypeUnset)
                REND_showObjs(unsettedTimeRegion);
            else
                REND_showObjs(settedTimeRegion);
            break;
        case "view":
            REND_insetShadow(viewButton);
            REND_showObjs(viewRegion);
            break;
        case "search":
            REND_insetShadow(searchButton);
            REND_showObjs(searchRegion);
            break;
        case "info":
            REND_insetShadow(infoButton);
            REND_showObjs(infoRegion);
            break;
        default:
            REND_insetShadow(clockButton);
            if (isTimeTypeUnset)
                REND_showObjs(unsettedTimeRegion);
            else
                REND_showObjs(settedTimeRegion);
            newSliderSetting = "clock";
            break;
    }
    sliderSetting = newSliderSetting;
}

function formTimeEditorDIV(timeName, idName, timeValue) {
    let div = document.createElement("div");
    div.className = "subSliderTimeEditor";
    let title = document.createElement("div");
    title.className = "title";
    title.innerHTML = timeName;
    let space = document.createElement("div");
    space.className = "space";
    let timeInputContainer = document.createElement("div");
    timeInputContainer.className = "timeInputContainer";
    let timeInput = document.createElement("input");
    timeInput.id = idName;
    timeInput.type = "text";
    timeInput.className = "timeInput";
    timeInput.value = timeValue;
    timeInputContainer.appendChild(timeInput);
    div.appendChild(title);
    div.appendChild(space);
    div.appendChild(timeInputContainer);
    return div;
}

function addSliderStartTimeEditorDIV(timeName, idName, timeValue) {
    let div = formTimeEditorDIV(timeName, idName, timeValue);
    REND_addChild(sliderStartTimeEditor, div);
}

function formSliderStartTimeEditor() {
    for (let i = 0; i < calendarInfo.timeValueLength; i++)
        addSliderStartTimeEditorDIV(calendarInfo.timeValueNames[i], "startTime" + i, calendarInfo.defaultStartTime[i]);
}

function addSliderEndTimeEditorDIV(timeName, idName, timeValue) {
    let div = formTimeEditorDIV(timeName, idName, timeValue);
    REND_addChild(sliderEndTimeEditor, div);
}

function formSliderEndTimeEditor() {
    for (let i = 0; i < calendarInfo.timeValueLength; i++)
        addSliderEndTimeEditorDIV(calendarInfo.timeValueNames[i], "endTime" + i, calendarInfo.defaultEndTime[i]);
}

function addEventTimeEditorDIV(timeName, idName, timeValue) {
    let div = formTimeEditorDIV(timeName, idName, timeValue);
    REND_addChild(eventTimeEditor, div);
}

function formEventTimeEditorDIV(timeValues) {
    for (let i = 0; i < calendarInfo.timeValueLength; i++)
        addEventTimeEditorDIV(calendarInfo.timeValueNames[i], "eventTime" + i, timeValues[i]);
}

function deleteEventTimeEditorDIV() {
    eventTimeEditor.innerHTML = "";
}

function updateSliderStartTime() {
    for (let i = 0; i < calendarInfo.timeValueLength; i++)
        document.getElementById("startTime" + i).value = startTime[i];
}

function changeLeftTime(timeValues) {
    leftTime.innerHTML = calendarPrint(DEEPCOPY(timeValues));
    startTime = timeValues;
    emptyEvent.time = startTime;
    updateSliderStartTime();
}

function updateSliderEndTime() {
    for (let i = 0; i < calendarInfo.timeValueLength; i++)
        document.getElementById("endTime" + i).value = endTime[i];
}

function changeRightTime(timeValues) {
    rightTime.innerHTML = calendarPrint(DEEPCOPY(timeValues));
    endTime = timeValues;
    updateSliderEndTime();
}

function formEventEditorTag(tagValue) {
    let tagContainer = document.createElement("div");
    tagContainer.className = "checkBoxContainer";
    let tag = document.createElement("input");
    tag.type = "checkbox";
    tag.name = "eventEditorTag";
    tag.value = tagValue;
    let p = document.createElement("p");
    p.innerHTML = tagValue;
    tagContainer.appendChild(tag);
    tagContainer.appendChild(p);
    return tagContainer;
}

function formEventEditorTagList() {
    for (let i = 0; i < eventList.tags.length; i++)
        REND_addChild(eventTagsEditor, formEventEditorTag(eventList.tags[i]));
}

function deleteEventEditorTagList() {
    eventTagsEditor.innerHTML = "";
}

function changeEventEditorTagList() {
    deleteEventEditorTagList();
    formEventEditorTagList();
}

function formSliderTag(tagName) {
    let tagContainer = document.createElement("div");
    tagContainer.className = "checkBoxContainer";
    let tag = document.createElement("input");
    tag.type = "checkbox";
    tag.name = "sliderTag";
    tag.value = tagName;
    if (viewableTags[tagName])
        tag.checked = true;
    let p = document.createElement("p");
    p.innerHTML = tagName;
    REND_addChild(tagContainer, tag);
    REND_addChild(tagContainer, p);
    return tagContainer;
}

function formSliderTagList() {
    for (let i = 0; i < eventList.tags.length; i++)
        REND_addChild(sliderTagsEditor, formSliderTag(eventList.tags[i]));
}

function deleteSliderTagList() {
    sliderTagsEditor.innerHTML = "";
}

function changeSliderTagList() {
    deleteSliderTagList();
    formSliderTagList();
}