// Was: (extrapolate this to make it bigger).
class Element {
    constructor(/* Element */ element) {}
    prefix(/* String */ attribute) {}
    interpretString(/* mixed */ mixed) {}
    translate(/* String */ attribute) {}
    unprefix(/* String */ attribute) {}
    setAttribute(/* String */ attribute, /* mixed */ value) {}
    getAttribute(/* String */ attribute) {}
    hasAttribute(/* String */ attribute) {}
    removeAttribute(/* String */ attribute) {}
}

/* -------------------------------------------------------------------------- */

class Name {
    static coerce(/* mixed */ mixed) {}
    static prefix(/* String */ attribute) {}
    static unprefix(/* String */ attribute) {}
    static translate(/* String */ attribute) {}
    static normalise(/* mixed */ attribute) {
        return this.translate(this.prefix(this.coerce(attribute)));
    }
    constructor(/* String */, rawName) {
        this.normalised = this.constructor.normalise(rawName);
    }
    name() {
        return this.normalised;
    }
    toString() {}
}

class Value {
    constructor(value = new StringType()) {
        this.value = value;
    }
    read() {}
    write(value) {}
    toString() {}
}

class Attribute {
    constructor(/* Name */ name, /* Value */ value) {}
    update(/* mixed */ value) {}
    name() { // better name needed?
        return this.name.toString();
    }
    toString() {
        return `[${this.name()}="${this.value.toString()}"]`;
    }
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

class StringType {
    constructor() {
        this.string = "";
    }
    read() {
        return this.string;
    }
    write(value) {
        this.string = String(value);
    }
    toString() {
        return this.string;
    }
}

class ElementValue extends Value {
    constructor() {
        super(new ElementType());
        // this.value = new ElementType();
    }
    read() {
        return this.value.unwrap();
    }
    write(value) {
        this.value.interpret(value);
    }
    toString() {
        return this.value.identify();
    }
}

class ElementType {
    static isElement(/* mixed */ element) {
        return element instanceof window.Element;
    }
    static lookup(/* String */ id) {
        return document.getElementById(id);
    }
    constructor(/* Element */ element) {
        this.interpret(element);
    }
    unwrap() {
        return this.element;
    }
    interpret(/* mixed */ value) {
        if (typeof value === "string") {
            return this.interpret(this.constructor.lookup(value));
        }
        if (value === null) {
            throw new ReferenceError();
        }
        if (!this.constructor.isElement(value)) {
            throw new TypeError();
        }
        this.element = value;
    }
    identify() {
        if (!this.element.id) {
            this.element.id = this.generateId();
        }
        return this.element.id;
    }
    generateId() {}
}

class ListValue extends Value {
}

class ListType {
}

class ElementListValue extends Value {
}

class ElementListType {
}

class BooleanValue extends Value {
}

class BooleanType {
}
