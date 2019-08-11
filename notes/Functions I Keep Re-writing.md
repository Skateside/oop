# Functions I Keep Re-writing

These are functions that I keep finding useful and keep adding back into projects I create.

## `identify()`

This function takes an element and returns its ID. If the element doesn't have an ID, a unique one is created and assigned before being returned.

```js
let identifyCounter = 0;

function identify(element, prefix = "anonymous-") {

    let id = element.id;

    if (!id) {

        do {

            id = prefix + identifyCounter;
            identifyCounter += 1;

        } while (document.getElementById(id));

        element.id = id;

    }

    return id;

}

// Usage:
// <div class="one" id="abc">
// <div class="two">
identify(document.querySelector(".one")); // -> "abc"
identify(document.querySelector(".two")); // -> "anonymous-0"
// <div class="one" id="abc">
// <div class="two" id="anonymous-0">
```

## `times()`

I can't think of anything better sometimes.

```js
function toPosInt(number) {
    return Math.floor(Math.abs(number));
}

function times(number, handler, context) {

    let posInt = toPosInt(number) || 0;
    let i = 0;

    while (i < posInt) {

        handler.call(context, i);
        i += 1;

    }

    return posInt;

}

// Usage:
times("-4.1", (i) => console.log(i));
// Logs: 0
// Logs: 1
// Logs: 2
// Logs: 3
// -> 4
```

## `pluck()`

Converts an array of objects into an array of arrays. This is really handy when trying to convert element attributes into a plain object (combined with `Object.fromEntries`).

```js
function pluck(array, ...properties) {
    return Array.from(array, (item) => properties.map((prop) => item[prop]));
}

// Usage:
// <div class="one" id="abc" hidden aria-hidden="true">
Object.fromEntries(
    pluck(document.querySelector(".one").attributes, "name", "value")
);
// -> {
//     class: "one",
//     id: "abc",
//     hidden: "",
//     "aria-hidden": "true"
// }
```

## `Observer`

```js
let dummies = new WeakMap();

class Observer {

    getEventElement() {

        let dummy = dummies.get(this);

        if (!dummy) {

            dummy = document.createElement("div");
            dummies.set(this, dummy);

        }

        return dummy;

    }

    addEventListener(eventName, handler) {
        this.getEventElement().addEventListener(eventName, handler);
    }

    removeEventListener(eventName, handler) {
        this.getEventElement().removeEventListener(eventName, handler);
    }

    createEvent(eventName, detail) {

        return new CustomEvent(eventName, {
            bubbles: true,
            cancelable: true,
            detail
        });

    }

    dispatchEvent(eventName, detail) {

        if (typeof eventName === "string") {
            eventName = this.createEvent(eventName, detail);
        }

        this.getEventElement().dispatchEvent(eventName);

        return eventName;

    }

}

// Usage:
let obs = new Observer();
obs.addEventListener("my-event", (e) => console.log("Hello %s!", e.detail));
obs.dispatchEvent("my-event", "world");
// Logs: "Hello world!"

// Other usage:
class Component extends Observer {

    constructor(element) {
        super();
        this.element = element;
    }

    getEventElement() {
        return this.element;
    }

}
```
