var parents = 3;
var depth = 3;
var children = 3;

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
            element[property] = (value === true || value === "true");
            break;

        case "function":

            if (value && typeof value === "object") {
                value = Object.entries(value);
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

/*
let identifyCounter = 0;

function identify(element, prefix = "anonymous-element-") {

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
*/

// TEMP - just to test the Checkbox constructor.
class Checkbox {

    constructor(input) {
        this.element = input;
        this.children = [];
    }

    addChild(child) {
        this.children.push(child);
        child.parent = this;
    }

}

function drawList(
    number,
    prefix = "Checkbox",
    listDepth = randomInt(depth),
    parentCheckbox = null
) {

    let startNode = document.createElement("ul");

    times(number, (i) => {

        let j = i + 1;
        let text = `${prefix}-${j}`;
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
                    randomInt(children) + 1,
                    text,
                    listDepth - 1,
                    checkbox
                )
            );

        }

        startNode.append(child);

    });

    return startNode;

}

// document.body.append(drawList(parents));
