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

(() => {

    let values = {
        parents: 1,
        depth: 1,
        children: 1
    };

    function randomInt(max) {
        return Math.floor(Math.random() * max);
    }

    function times(number, handler, context) {

        let i = 0;
        let il = Math.floor(Math.abs(number)) || 0;

        while (i < il) {

            handler.call(context, i);
            i += 1;

        }

        return i;

    }

    let propMap = {
        class: "className",
        for: "htmlFor"
    };

    function setAttributes(element, attributes) {

        Object.entries(attributes).forEach(([key, value]) => {

            let property = propMap[key] || key;

            switch (typeof element[property]) {

            case "boolean":
                element[property] = Boolean(value);
                break;

            case "function":

                if (value && typeof value === "object") {
                    value == Object.entries(value);
                }

                element[property](...value);
                break;

            case "undefined":
                element.setAttribute(property, value);
                break;

            default:
                element[property] = value;

            }

        });

    }

    function isAppendable(object) {
        return typeof object === "string" || object instanceof Node;
    }

    function draw(nodeName, attributes = {}, children = []) {

        let node = document.createElement(nodeName);

        if (
            Array.isArray(attributes)
            || isAppendable(attributes)
        ) {
            [attributes, children] = [null, attributes];
        }

        if (attributes) {
            setAttributes(node, attributes);
        }

        if (isAppendable(children)) {
            children = [children];
        }

        children.forEach((child) => node.append(child));

        return node;

    }

    function drawList(
        number,
        prefix = "Checkbox",
        listDepth = randomInt(values.depth),
        parentCheckbox = null
    ) {

        let startNode = document.createElement("ul");

        times(number, (i) => {

            let text = `${prefix}-${i + 1}`;
            let input = draw("input", {
                type: "checkbox",
                name: text,
                id: text
            });
            let child = draw("li", [
                input,
                draw("label", {
                    for: text
                }, text)
            ]);
            let checkbox = new Checkbox(input);
            input.checkbox = checkbox;

            if (parentCheckbox) {
                parentCheckbox.addChild(checkbox);
            }

            if (listDepth) {

                child.append(
                    drawList(
                        randomInt(values.children) + 1,
                        text,
                        Math.max(0, randomInt(listDepth) - 1),
                        checkbox
                    )
                );

            }

            startNode.append(child);

        });

        return startNode;

    }

    let output = document.getElementById("checkboxes-output");
    document
        .getElementById("checkboxes-input")
        .addEventListener("submit", function (e) {

            e.preventDefault();

            this.querySelectorAll("input")
                .forEach((input) => values[input.name] = Number(input.value));

            output.innerHTML = "";
            output.append(drawList(values.parents));

        });

})();
