div.aria.role.add("thing");

div.aria.controls.add(document.querySelector("..."))
div.aria.controls.add(...document.querySelectorAll("..."))
div.aria.controls = document.querySelector("...");
div.aria.controls = document.querySelectorAll("...");

div.aria.controls.toString();
[...div.aria.controls];

class StringType {

    constructor() {
        this.value = "";
    }

    write(value) {
        this.value = value;
    }

    read() {
        return this.value;
    }

    toString() {
        return this.value.toString();
    }

}

class ListType extends StringType {

    constructor() {
        super();
        this.value = [];
    }

    coerce(value) {

        if (
            value === ""
            || value === null
            || value === undefined
            || (typeof value === "string" && value.trim() === "")
        ) {
            return [];
        }

        if (typeof value === "string") {
            return value.trim().split(/\s+/);
        }

        if (value[Symbol.iterator]) {
            return [...value];
        }

        return [value];

    }

    write(value) {

        this.value.length = 0;
        this.add(...this.coerce(value));

    }

    read() {
        return [...this.value];
    }

    add(...values) {

        values.forEach((value) => {

            if (!this.contains(value)) {
                this.value.push(value);
            }

        });

    }

    remove(...values) {

        values.forEach((value) => {

            let index = this.value.indexOf(value);

            if (index > -1) {
                this.value.splice(index, 1);
            }

        });

    }

    contains(value) {
        return this.value.includes(value);
    }

    toggle(value, force) {

        if (force === undefined) {
            force = !this.contains(value);
        }

        this[
            force
            ? "add"
            : "remove"
        ](value);

    }

    // item(i) {
    //
    //     let value = this.value;
    //     let item;
    //
    //     // Prevents people passing in a string to access the array methods.
    //     if (Object.prototype.hasOwnProperty.call(value, i)) {
    //         item = value[i];
    //     }
    //
    //     return item;
    //
    // }

    *keys() {

        let i = 0;
        let il = this.value.length;

        while (i < il) {
            yield i++;
        }

    }

    *values() {

        let i = 0;
        let il = this.value.length;

        while (i < il) {
            yield this.value[i++];
        }

    }

    *entries() {

        let i = 0;
        let il = this.value.length;

        while (i < il) {
            yield [i, this.value[i++]];
        }

    }

    forEach(handler, context) {
        this.value.forEach((value, i) => handler.call(context, value, i));
    }

    // *[Symbol.iterator]() {
    //
    //     let i = 0;
    //     let il = this.value.length;
    //
    //     while (i < il) {
    //         yield this.value[i++];
    //     }
    //
    // }

    toString() {
        return this.value.map((item) => item.toString()).join(" ");
    }

}
ListType.prototype[Symbol.iterator] = ListType.prototype.values;

class ReferenceType extends StringType {

    write(value) {

        super.write(
            typeof value === "string"
            ? WrappedElement.getById(value)
            : new WrappedElement(value)
        );

    }

    read() {
        return this.value.identify();
    }

}

class ReferenceListType extends ListType {

    // write(value) {
    // }

    read() {
    }

    add(...values) {

        return super.add(
            ...Array.from(values, (value) => Reference.interpret(value))
        );

    }

    remove(...values) {

        return super.remove(
            ...Array.from(values, (value) => Reference.interpret(value))
        );

    }

    contains(value) {
        return super.contains(Reference.interpret(value));
    }

    toggle(value, force) {
        return super.toggle(Reference.interpret(value), force);
    }

}

class Reference {

    static defaultPrefix = "aria-element-";
    static counter = 0;

    constructor(element) {
        this.reference = element;
    }

    element() {
        return this.reference;
    }

    toString() {
        return this.identify();
    }

    identify() {

        if (!this.reference) {
            return undefined;
        }

        let id = this.id;

        if (!id) {

            id = Attribute.create(this, "id");
            this.id = id;

        }

        if (!id.exists()) {
            id.write(this.generateId());
        }

        return id.read();

    }

    generateId(prefix = this.constructor.defaultPrefix) {

        let id;

        do {
            id = `${prefix}${this.constructor.counter++}`;
        } while (this.constructor.lookup(id));

        return id;

    }

    static lookup(id) {
        return document.getElementById(id);
    }

    static interpret(value) {

        let reference = null;

        if (value instanceof Element) {
            reference = value;
        }

        if (typeof value === "string") {
            reference = this.lookup(value);
        }

        return new this(reference);

    }

}

class Attribute {

    constructor(raw) {
        this.raw = raw;
    }

    name() {
        return this.raw;
    }

    setElement(element) {
        this.element = element;
    }

    read() {

        let {
            element
        } = this;

        return (
            element
            ? element.getAttribute(this.name())
            : undefined
        );

    }

    write(value) {

        let {
            element
        } = this;

        if (!element) {
            return false;
        }

        element.setAttribute(this.name(), value.toString());

        return true;

    }

    clear() {

        let {
            element
        } = this;

        if (!element) {
            return false;
        }

        element.removeAttribute(this.name());

        return true;

    }

    exists() {

        let {
            element
        } = this;

        return Boolean(element) && element.hasAttribute(this.name());

    }

    static create(reference, attribute) {

        let attr = new this(attribute);

        attr.setElement(reference.element());

        return attr;

    }

}

class AriaAttribute extends Attribute {

    static get RAW() {
        return "raw";
    }

    static get PREFIXED() {
        return "prefixed";
    }

    static get UNPREFIXED() {
        return "unprefixed";
    }

    static prefix = "aria-";

    constructor(raw) {

        super(raw);
        this.nameCache = Object.create(null);

    }

    name(mode = this.constructor.PREFIXED) {

        let {
            nameCache
        } = this;

        if (nameCache[mode]) {
            return nameCache[mode];
        }

        let method = `create_${mode}`;

        if (!this[method]) {
            throw new Error(`Unrecognised name mode '${mode}'`);
        }

        nameCache[mode] = this[method]();

        return nameCache[mode];

    }

    coerce(raw) {

        if (
            raw === ""
            || raw === null
            || raw === undefined
        ) {
            return "";
        }

        return String(raw).trim().toLowerCase();

    }

    create_raw() {
        return this.coerce(this.raw);
    }

    create_prefixed() {

        let name = this.coerce(this.raw);
        let prefix = this.constructor.prefix;

        if (!name.startsWith(prefix)) {
            name = `${prefix}${name}`;
        }

        return name;

    }

    create_unprefixed() {

        let name = this.coerce(this.raw);
        let prefix = this.constructor.prefix;

        if (name.startsWith(prefix)) {
            name = name.substr(prefix.length);
        }

        return name;

    }

}
