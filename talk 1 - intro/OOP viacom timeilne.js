/*
<div class="event">Event 1</div>
<div class="event">Event 2</div>
<div class="event">Event 3</div>
<div class="event" hidden>Event 4</div>
<div class="event" hidden>Event 5</div>
<div class="event" hidden>Event 6</div>
<div class="event" hidden>Event 7</div>

<button type="button" id="prev" disabled>&lt;- Previous</button>
<button type="button" id="next">Next -&gt;</button>
 */

// Step 0: Functional style.

var firstVisible = 0;
var numberVisible = 3;

var events = [...document.querySelectorAll(".event")];
var visible = events.slice(firstVisible, numberVisible);

var next = document.getElementById("next");
var prev = document.getElementById("prev");

next.addEventListener("click", function () {

    visible.forEach((el) => el.hidden = true);
    firstVisible += numberVisible;
    visible = events.slice(firstVisible, firstVisible + numberVisible);
    visible.forEach((el) => el.hidden = false);
    prev.disabled = false;

    if (firstVisible + numberVisible >= events.length) {
        next.disabled = true;
    }

});

prev.addEventListener("click", function () {

    visible.forEach((el) => el.hidden = true);
    firstVisible -= numberVisible;

    if (firstVisible < 0) {
        firstVisible = 0;
    }

    visible = events.slice(firstVisible, firstVisible + numberVisible);
    visible.forEach((el) => el.hidden = false);
    next.disabled = false;

    if (firstVisible === 0) {
        prev.disabled = true;
    }

});

// Step 1: Start with basic functionality.

class Timeline {

    constructor(elements) {
        this.elements = elements;
    }

    hideAll() {
        this.elements.forEach((el) => el.hidden = true);
    }

    showVisible() {

        let {
            elements,
            start,
            page
        } = this;

        elements
            .slice(start, start + page)
            .forEach((el) => el.hidden = false);

    }

    render() {

        this.hideAll();
        this.showVisible();

    }

    pageSize(size) {

        this.page = size;
        this.render();

    }

    next() {

        this.start = Math.min(this.start + this.page, this.elements.length);
        this.render();

    }

    prev() {

        this.start = Math.max(this.start - this.page, 0);
        this.render();

    }

}

// Step 2: Add some event triggers so we know when things have happened.
// Abstract everything out through the observer.
// Observer from https://gist.github.com/james-jlo-long/fe69c667463d127063617a2b4d5a54c5

class Timeline extends Observer {

    constructor(/* Element[] */ elements) {

        super();
        this.elements = elements;

    }

    hideAll() {
        this.elements.forEach((el) => this.dispatch("hide-element", el));
    }

    showVisible() {

        let {
            elements,
            start,
            page
        } = this;

        elements
            .slice(start, start + page)
            .forEach((el) => this.dispatch("show-element", el));

    }

    render() {

        this.hideAll();
        this.showVisible();
        this.trigger("render");

    }

    pageSize(/* Number */ size) {

        this.page = size;
        this.render();

    }

    next() {

        this.start += this.page;
        this.render();

        if (this.start + this.page >= this.elements.length) {
            this.trigger("end");
        }

    }

    prev() {

        this.start = Math.max(this.start - this.page, 0);
        this.render();

        if (this.start === 0) {
            this.trigger("start");
        }

    }

}

// Step 3: hook it all up.

let timeline = new Timeline([...document.querySelectorAll("...")]);
let prev = document.querySelector("...");
let next = document.querySelector("...");

prev.addEventListener("click", () => timeline.prev());
next.addEventListener("click", () => timeline.next());

timeline.on("hide-element", ({ element: detail }) => element.hidden = true);
timeline.on("show-element", ({ element: detail }) => element.hidden = false);
timeline.on("render", () => {

    prev.disabled = true;
    next.disabled = true;

});
timeline.on("start", () => next.disabled = true);
timeline.on("end", () => prev.disabled = true);

// BreakPoints from https://gist.github.com/james-jlo-long/fe69c667463d127063617a2b4d5a54c5
let dims = { /* ... */ };
let breakpoints = new BreakPoints({ /* ... */ });
breakpoints.on("change", ({ detail }) => {
    timeline.pageSize(dims[detail.name]);
}, true);
