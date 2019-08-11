## Composite Pattern

This composite pattern is used when you have nested objects that all behave the same. Think of something like a folder structure.

```js
class Branch {

    constructor() {
        this.nodes = [];
    }

    doSomething() {
        this.nodes.forEach((node) => node.doSomething());
    }

}

class Leaf {

    doSomething() {
        // does something.
    }

}
```

Critically, `Branch` and `Leaf` have a method with the same name - `doSomething`. This means that `Branch#nodes` can contain any number of `Leaf` instances but is can also contain `Branch` instances. This allows for infinite nesting.


## Nested Checkboxes

Start with a `Checkbox` class that may have children.

```js
class Checkbox {

    constructor(input) {

        this.input = input;
        this.children = [];

        this.addHandlers();

    }

    addHandlers() {

        let input = this.input;

        input.addEventListener("change", () => {
            this.setState(input.checked);
        });

    }

    setState(state) {
        // ...
    }

}
```

Allow the `Checkbox` to have children and a parent. The parent will be another instance of `Checkbox`.

```js
class Checkbox {

    // ...

    addChild(child) {

        child.setParent(this);
        this.children.push(child);

    }

    setParent(parent) {
        this.parent = parent;
    }

}
```

Setting the state of a `Checkbox` should update the children and immediate parent.

```js
class Checkbox {

    // ...

    setState(state) {

        let input = this.input;

        if (!this.isSetting) {

            this.isSetting = true;

            if (typeof state === "boolean") {

                input.indeterminate = false;
                input.checked = state;
                this.children.forEach((child) => child.setState(state));

            } else if (state === "mixed") {

                input.checked = false;
                input.indeterminate = true;
            }

            if (this.parent) {
                this.parent.update();
            }

            this.isSetting = false;

        }

    }

    getState() {

        return (
            this.input.indeterminate
            ? "mixed"
            : this.input.checked
        );

    }

}
```

.. but since `parent` is another `Checkbox`, we need to add an `update` method.

```js
class Checkbox {

    // ...

    update() {

        let children = this.children;
        let mixed = 0;
        let checked = 0;

        children.forEach((child) => {

            let state = child.getState();

            if (state === "mixed") {
                mixed += 1;
            } else if (state) {
                checked += 1;
            }

        });

        if (checked === children.length) {
            this.setState(true);
        } else if (mixed || checked) {
            this.setState("mixed");
        } else {
            this.setState(false);
        }

    }

}
```


```js
// Whole class for reference:
class Checkbox {

    constructor(input) {
        this.input = input;
        this.children = [];
        this.addHandlers();
    }

    addHandlers() {

        let input = this.input;

        input.addEventListener("change", () => {
            this.setState(input.checked);
        });

    }

    setParent(parent) {
        this.parent = parent;
    }

    addChild(child) {

        child.setParent(this);
        this.children.push(child);

    }

    setState(state) {

        if (!this.isSetting) {

            this.isSetting = true;

            if (typeof state === "boolean") {

                this.input.checked = state;
                this.children.forEach((child) => child.setState(state));

            } else if (state === "mixed") {
                this.input.indeterminate = true;
            }

            if (this.parent) {
                this.parent.update();
            }

            this.isSetting = false;

        }

    }

    update() {

        let children = this.children;
        let mixed = 0;
        let checked = 0;

        children.forEach((child) => {

            let state = child.getState();

            if (state === "mixed") {
                mixed += 1;
            } else if (state) {
                checked += 1;
            }

        });

        if (checked === children.length) {
            this.setState(true);
        } else if (mixed || checked) {
            this.setState("mixed");
        } else {
            this.setState(false);
        }

    }

    getState() {

        return (
            this.input.indeterminate
            ? "mixed"
            : this.input.checked
        );

    }

    getIsChecked() {
        return this.getState() === true;
    }

}
```
