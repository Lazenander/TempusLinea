function DEEPCOPY(obj) {
    return JSON.parse(JSON.stringify(obj));
}

class EVENT {
    constructor(time, tags, title, description) {
        this.time = time;
        this.title = title;
        this.description = description;
        this.tags = tags;
    }

    containText(text) {
        let ptext = text.toLowerCase();
        let ptitle = this.title.toLowerCase();
        let pdescription = this.description.toLowerCase();
        if (ptitle.indexOf(ptext) != -1 || pdescription.indexOf(ptext) != -1)
            return true;
        return false;
    }

    isTag(tag) {
        return this.tags.indexOf(tag) != -1;
    }

    deleteTagByIndex(index) {
        this.tags.splice(index, 1);
    }

    deleteTag(tag) {
        let index = this.tags.indexOf(tag);
        if (index != -1)
            this.tags.splice(index, 1);
    }

    addTag(tag) {
        this.tags.push(tag);
    }
}

class EVENTLIST {
    constructor() {
        this.length = 0;
        this.events = [];
        this.tagsLength = 0;
        this.tags = [];
    }

    lowerBound(time, distance) {
        let left = 0,
            right = this.length,
            mid, ans = this.length;
        while (left <= right) {
            if (left == this.length)
                return this.length;
            mid = Math.floor((right - left) / 2) + left;
            if (distance(DEEPCOPY(this.events[mid].time), DEEPCOPY(time)) > 0) {
                ans = mid;
                right = mid - 1;
            } else
                left = mid + 1;
        }
        return ans;
    }

    upperBound(time, distance) {
        let left = 0,
            right = this.length,
            mid, ans = this.length;
        while (left <= right) {
            if (left == this.length)
                return this.length;
            mid = Math.floor((right - left) / 2) + left;
            if (distance(DEEPCOPY(this.events[mid].time), DEEPCOPY(time)) >= 0) {
                ans = mid;
                right = mid - 1;
            } else
                left = mid + 1;
        }
        return ans;
    }

    addEvent(newEvent, distance) {
        this.events.splice(this.lowerBound(newEvent.time, distance), 0, newEvent);
        this.length++;
    }

    deleteEventByIndex(index) {
        this.events.splice(index, 1);
        console.log(index)
        this.length--;
    }

    deleteEvent(delEvent) {
        for (let i = 0; i < this.events.length; i++)
            if (this.events[i] === delEvent) {
                this.deleteEventByIndex(i);
                break;
            }
    }

    updateEventByIndex(index, newEvent, distance) {
        this.deleteEventByIndex(index);
        this.addEvent(newEvent, distance);
    };

    updateEvent(oldEvent, newEvent, distance) {
        console.log(oldEvent)
        for (let i = 0; i < this.events.length; i++)
            if (this.events[i] === oldEvent) {
                this.updateEventByIndex(i, newEvent, distance)
                console.log(i)
                break;
            }
    }

    hasTag(tag) {
        return this.tags.indexOf(tag) != -1;
    }

    addTag(tag) {
        this.tags.push(tag);
        this.tagsLength++;
    }

    deleteTagByIndex(index) {
        let delTag = this.tags[index];
        this.tags.splice(index, 1);
        this.tagsLength--;
        for (let i = 0; i < this.events.length; i++)
            this.events[i].deleteTag(delTag);
    }

    deleteTag(tag) {
        let index = this.tags.indexOf(tag);
        if (index != -1)
            this.deleteTagByIndex(index);
    }

    giveRegion(startTime, endTime, distance) {
        return {
            left: this.upperBound(startTime, distance),
            right: this.lowerBound(endTime, distance)
        };
    }
}

exports.EVENT = EVENT;
exports.EVENTLIST = EVENTLIST;