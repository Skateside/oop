class Observer {
    constructor(eventElement = document.createElement("div")) {
        this.eventElement = eventElement;
    }
    addEventListener(name, handler) {
        this.eventElement.addEventListener(name, handler);
    }
    removeEventListener(name, handler) {
        this.eventElement.removeEventListener(name, handler);
    }
    // ...
}

class Observer {
    // ...
    createEvent(name, detail) {/* return new CustomEvent */}
    dispatchEvent(event, detail) {
        if (typeof event === "string") {
            event = this.createEvent(event, detail);
        }
        this.eventElement.dispatchEvent(event);
        return event;
    }
}

class Thing extends Observer {
    constructor(element) {
        super(element);
        // ...
    }
}

// As a mixin:
//  Pros:
//  -   doesn't polute prototype chain
//  -   Can use multiple mixins.
//  Cons:
//  -   auto-replaces any existing methods/properties of the same name.
//  -   can't be overridden in the class itself.
let observerMixin = Object.freeze({
    getEventElement() {
        if (!this.eventElement) {
            this.eventElement = document.createElement("div");
        }
        return this.eventElement;
    },
    addEventListener(name, handler) {
        this.getEventElement().addEventListener(name, handler);
    },
    removeEventListener(name, handler) {/* ... */},
    createEvent(name, detail) {/* ... */},
    dispatchEvent(event, detail) {/* ... */},
});

class Thing {/* ... */}
Object.assign(Thing.prototype, observerMixin);


// As a parameter:
//  Pros:
//  -   Creates fewer observers.
//  -   Doesn't polute the prototype chain.
//  Cons:
//  -   End up having to wrap the Observer methods.
//  -   Other classes/instances can trigger these methods.
class Observer { /* ... */ }
let observer = new Observer();
class Thing {
    constructor(observer) {
        this.observer = observer;
    }
    on(name, handler) {
        this.observer.addEventListener(name, handler)
    }
    // ...
}
let thing = new Thing(observer);
