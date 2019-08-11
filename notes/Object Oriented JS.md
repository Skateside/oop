# OOP

If you build objects carefully, you'd be surprised at how much you **don't need to know**. The less you know, the less will go wrong.

## Treat Objects Like Little Children.

- Ask don't take.
- Don't leave your toys lying around.
- Don't talk to strangers.

### Ask Don't Take

Don't just grab a property, execute a method. JavaScript doesn't have a native way of handling interfaces. Accessing a property that doesn't exist will just return `undefined` and can easily hide the fact you're looking at the wrong kind of object. Trying to execute a method that doesn't exist will throw an `Error` so you'll easily see it.

```js
class Child {

    constructor(name) {
        this.name = name;
    }

}

class Parent {

    constructor() {
        this.children = [];
    }

    addChild(child) {
        this.children.push(child);
    }

    getChildren() {
        return this.children;
    }

}

let parent = new Parent();
parent.addChild(new Child("alpha"));
parent.addChild(new Child("bravo"));

parent.getChildren().forEach((child) => child.name);
```

Use methods instead.

```js
class Child {

    // ...

    getName() {
        return this.name;
    }

}

parent.getChildren().forEach((child) => child.getName());
```

Things like checking the `length` property can be an exception to this rule.

```js
// Code won't execute if length is 0.
if (parent.getChildren().length) {
    parent.getChildren().forEach((child) => /* ... */);
}
```

If we change the way that data is stored, we can make sure we update the `getChildren()` method to always return an array.

```js
class Parent {

    constructor() {
        this.children = {};
    }

    addChild(child) {
        this.children[child.getName()] = child;
    }

    getChildren() {
        return Object.values(this.children);
    }

}
```

Using these tricks, we **don't need to know** how the `children` are stored.


### Don't Leave Your Toys Lying Around

No global variables.



### Don't Talk to Strangers

Only access methods you're allowed to, don't chain methods.



- Hands to yourself!
    - Only call your own methods or sandbox methods.
    - Don't access DOM elements outside of your box.
    - Don't access non-native global objects.
- Ask, don't take!
    - Anything you need, ask the sandbox.
- Don't leave your toys around!
    - Don't create global objects.
- Don't talk to strangers!
    - Don't directly reference other modules.



What is an object?

```js
var me = {
    name: "JLo",
    age: 34
};
```

Build a step-by-step form.

```js
class Step {

    constructor(element) {
        this.element = element;
    }

    createEvent(name, detail) {

        return new CustomEvent(name, {
            bubbles: true,
            cancelable: true,
            detail: detail
        });

    }

    move(direction) {

        let hasMoved = false;
        let event = this.createEvent("pre-" + direction);
        this.element.dispatchEvent(event);

        if (!event.defaultPrevented) {

            this.element.hidden = direction === "leave";
            this.element.dispatchEvent(this.createEvent(direction));
            hasMoved = true;

        }

        return hasMoved;

    }

    enter() {
        return this.move("enter");
    }

    leave() {
        return this.move("leave");
    }

}

class StepGroup {

    constructor(element) {
        this.element = element;
        this.steps = [];
        this.index = 0;
    }

    addStep(step) {
        this.steps.push(step);
    }

    goto(index) {

        if (this.steps[this.index].leave()) {

            this.steps[index].enter();
            this.index = index;

        }

    }

    gotoNext() {
        this.goto(this.index + 1);
    }

    gotoPrev() {
        this.goto(this.index - 1);
    }

}
```

This lets you add any number of steps you want.

```js
let steps = document.querySelector(".js--steps--group");
let group = new StepGroup(steps);
steps.querySelectorAll(".js--steps--step").forEach(function (step) {
    group.addStep(new Step(step));
});

steps.querySelector(".js--steps--advance").addEventListener("click", (e) => {
    e.preventDefault();
    steps.gotoNext();
});
steps.querySelector(".js--steps--retreat").addEventListener("click", (e) => {
    e.preventDefault();
    steps.gotoPrev();
});
```

Let's make this more complicated.

```js
class ValidStep extends Step {

    static get SELECTOR() {
        return "input,select,textarea";
    }

    constructor(element) {
        super(element);
        this.addHandlers();
    }

    addHandlers() {

        this.element.addEventListener("pre-leave", (e) => {

            let inputs = [
                ...this.element.querySelectorAll(ValidStep.SELECTOR)
            ];

            if (!inputs.every((input) => input.willValidate)) {
                e.preventDefault();
            }

        });

    }

}

// ...
steps.querySelectorAll(".js--steps--step").forEach(function (step) {

    let StepClass = Step;

    if (step.querySelector(ValidStep.SELECTOR)) {
        StepClass = ValidStep;
    }

    group.addStep(new StepClass(step));

});
// ...
```
