# Command Pattern

This is used when you have something like a UI and you need to interact with a lot of different objects in a consistent way. Each `Command` has an `execute` method which your UI actually works with.

```js
class Command {

    constructor(action) {
        this.action = action;
    }

    execute() {
        this.action();
    }

}

// Some random objects.
let counter = {
    number: 0,
    increase() {
        this.number += 1;
    },
    decrease() {
        this.number -= 1;
    }
};
let logger = {
    log(message) {
        console.log(message);
    }
};

// Creating commands.
let increaseCounterCommand = new Command(() => counter.increase());
let decreaseCounterCommand = new Command(() => counter.decrease());
let logCounterCommand = new Command(() => logger.log(counter.number));

// Defining buttons.
class Button {

    constructor(name, command) {
        this.name = name;
        this.command = command;
    }

    draw() {

        let element = this.element;

        if (!element) {

            element = document.createElement("button");
            element.type = "button";
            element.textContent = this.name;
            element.addEventListener("click", () => this.command.execute());

            this.element = element;

        }

        return element;

    }

}

// Creating buttons.
let increaseCounterButton = new Button("Increase", increaseCounterCommand);
let decreaseCounterButton = new Button("Decrease", decreaseCounterCommand);
let logCounterButton = new Button("Log", logCounterCommand);

let menu = document.createElement("ul");

[
    increaseCounterButton,
    decreaseCounterButton,
    logCounterButton
].forEach((button) => {

    let item = document.createElement("li");
    item.append(button.draw());
    menu.append(item);

});
```
