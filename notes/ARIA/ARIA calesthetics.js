import {
    hasOwn,
    identity
} from "./util.js";

class Collection {

    set(index, item) {
        return this.setIndex(index, this.mapIn(item));
    }

    get(index) {
        return this.mapOut(index);
    }

    setIndex(index, item) {

        this.data[index] = item;
        this.update();

        return true;

    }

    getIndex(index) {
        return this.data[index];
    }

    hasIndex(index) {
        return hasOwn(this.data, index);
    }

    removeIndex(index) {

        if (!this.hasIndex(index)) {
            return false;
        }

        delete this.data[index];
        this.update();
        return true;

    }

    getLength() {
        return this.data.length;
    }

    map(handler, context) {
        return this.toArray().map((item, i) => handler.call(context, item, i));
    }

    forEach(handler, context) {
        this.map(handler, context);
    }

    mapIn(item) {
        return item;
    }

    mapOut(item) {
        return item;
    }

    tidy() {

        this.data = this.data.reduce((data, item) => {

            data.push(item);

            return data;

        }, []);

        this.update();

    }

    update() {
        this.update();
    }

    toArray(mode = this.constructor.MAPPED) {

        return this.data.map(
            mode === this.constructor.UNMAPPED
            ? identity
            : (item) => this.mapOut(item)
        );

    }

    static from(iterable, map = identity, context) {

        let collection = new this();

        Array.from(iterable, map, context).forEach((item, i) => {
            collection.setIndex(i, item);
        });

        return collection;

    }

}

class WhitelistCollection extends Collection {

    constructor() {
        super();
        this.setWhitelist([]);
    }

    setWhitelist(whitelist) {
        this.whitelist = whitelist;
    }

    setIndex(index, value) {

        if (!this.whitelist.includes(value)) {
            return false;
        }

        return super.setIndex(index, value);

    }

}

class ElementCollection extends Collection {

    mapIn(item) {
        return AriaElement.create(item).identify();
    }

    mapOut(item) {
        return AriaElement.lookup(item);
    }

}

class AriaElement {

    static isNativeElement(element) {
        return element instanceof Element;
    }

    static isElement(element) {
        return element instanceof this;
    }

    static lookup(id) {

        if (this.isNativeElement(id)) {
            return id;
        }

        if (this.isElement(id)) {
            return id.unwrap();
        }

        return document.getElementById(id);

    }

    static create(element) {

        if (typeof element === "string") {
            element = this.lookup(element);
        }

        if (!element) {
            return new NullElement();
        }

        return new this(element);

    }

    constructor(element) {

        this.element = element;
        this.attributes = {};

        this.observer = this.createObserver();

    }

    upwrap() {
        return this.element;
    }

    bindAttribute(attribute) {

        let name = attribute.getName();

        if (!this.attributes[name]) {

            this.attributes[name] = attribute;
            attribute.onUpdate(() => this.updateAttribute(attribute));

        }

    }

    updateAttribute(attribute) {

        let name = attribute.getName();
        let value = attribute.getValue();

        return (
            (value === undefined || value === "")
            ? this.element.removeAttribute(name)
            : this.element.setAttribute(name, value)
        );

    }

    createObserver() {

        let observer = new MutationObserver(
            (mutations) => mutations.forEach(
                (mutation) => this.handleMutation(mutation)
            ),
            {
                attributes: true
            }
        );

        observer.observe(this.element);

        return observer;

    }

    handleMutation({ type, attributeName, target }) {

        if (!type === "attributes") {
            return;
        }

        let attribute = this.attributes[attributeName];

        if (attribute) {
            attribute.setValue(target.getAttribute(attributeName));
        }

    }

}

class NullElement extends AriaElement {

    constructor() {
        super(null);
    }

    updateAttribute(attribute) {
        return false;
    }

    createObserver() {
        return;
    }

}

class Name {

    static get PREFIX() {
        return "aria-";
    }

    static cache = Object.create(null);
    static translations = Object.assign(
        Object.create(null),
        {
            "aria-role": "role"
        }
    );

    static addTranslation(source, translation) {
        this.translations[source] = translation;
    }

    static isName(name) {
        return name instanceof this;
    }

    static create(name) {

        if (this.isName(name)) {
            return name;
        }

        let cached = this.cache[name];

        if (!cached) {

            cached = new this(name);
            this.cache[name] = cached;

        }

        return cached;

    }

    constructor(rawName) {
        this.rawName = rawName;
    }

    normalise() {

        if (!this.normal) {

            this.normal = this.translate(
                this.prefix(
                    this.coerce(this.rawName)
                )
            );

        }

        return this.normal;

    }

    translate(string) {
        return this.constructor.translations[string] || string;
    }

    prefix(string) {

        let PREFIX = this.constructor.PREFIX;

        if (!string.startsWith(PREFIX)) {
            string = PREFIX + string;
        }

        return string;

    }

    unprefix(string) {
        return this.normalise().slice(this.constructor.PREFIX.length);
    }

    coerce(string) {
        // String.interpret()

        if (string === "" || string === null || string === undefined) {
            return "";
        }

        return String(string).trim();

    }

}

class Attribute {

    // static cache = Object.create(null);

    // static create(attribute) {
    //
    //     let cache = this.cache;
    //
    //     if (cache[attribute]) {
    //         return cache[attribute];
    //     }
    //
    //     let instance = new this(
    //         this.translate(this.prefix(this.coerce(attribute)))
    //     );
    //
    // }

    constructor(/* Name */ name, Observer = Observer) {

        this.name = name;
        this.value = "":
        this.updater = new Observer();

    }

    getName() {
        return this.name.normalise();
    }

    // unprefix() {
    //     return this.constructor.unprefix(this.name);
    // }

    mapIn(item) {
        return item;
    }

    mapOut(item) {
        return item;
    }

    getValue() {
        return this.mapOut(this.value);
    }

    setValue(value) {
        this.value = this.mapIn(value);
        this.update();
    }

    update() {
        this.updater.trigger("update");
    }

    onUpdate(handler) {
        this.updater.on("update", handler);
    }

}

class ListAttribute extends Attribute {

    constructor(Collection) {

        super();
        this.value = new Collection();

    }

    setValue(value) {
        // ...
    }

    getValue() {
        return this.value.toArray().join(" ");
    }

    // Do I want these wrappers?
    push(...values) {
        return this.value.push(...values);
    }

    item(index) {
        return this.value[index];
    }

}

class ElementAttribute extends Attribute {

    setValue(value) {
        return super.setValue(AriaElement.create(value).identify());
    }

    getValue() {
        return AriaElement.lookup(this.value);
    }

}

class ElementListAttribute extends ListAttribute {

    constructor() {
        super(ElementCollection);
    }



}

class NumberAttribute extends Attribute {

    mapIn(item) {

        let number = parseFloat(item);

        return (
            Number.isNaN(number)
            ? undefined
            : number
        );

    }

    mapOut(item) {

        if (Number.isNaN(Number(item))) {
            return undefined;
        }

        return item;

    }

}

class IntegerAttribute extends NumberAttribute {

    mapIn(item) {
        return super.mapIn(Math.floor(item));
    }

}

// This is why we should probably use "Property" instead of "Attribute".
class BooleanAttribute extends Attribute {

    mapOut(item) {

        let isTrue = item === "true";

        return (
            (isTrue || item === "false")
            ? isTrue
            : undefined
        );

    }

}

let factories = {
    "aria-checked": BooleanAttribute
};
