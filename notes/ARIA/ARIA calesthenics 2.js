class Value {

    constructor() {
        this.write("");
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

class Attribute extends Observer {

    write(newValue) {

        let value = this.value;
        let name = this.name.toString();
        let previous = value.get();
        let preUpdate = this.createEvent(this.constructor.EVENT_PRE_WRITE, {
            name,
            value: previous
        });

        this.trigger(preUpdate);

        if (preUpdate.defaultPrevented) {
            return false;
        }

        this.set(newValue);
        this.trigger(this.constructor.EVENT_WRITE, {
            name,
            value: value.get(),
            previous
        });

        return true;

    }

    set(newValue) {
        this.value.write(newValue);
    }

    read() {

        const {
            EVENT_PRE_READ,
            EVENT_READ
        } = this.constructor;
        // ...

    }

    get() {
        return this.value.read();
    }

    remove() {
    }

    unset() {
    }

}

class AttributeFactory {

    static singleton() {

        let {
            instance
        } = this;

        if (!instance) {

            instance = new this();
            this.instance = instance;

        }

        return instance;

    }

    constructor() {
        this.factories = {};
    }

    addFactory(name, Value, isOverride = false) {

        if (this.factories[name] && !isOverride) {
            return;
        }

        this.factories[name] = () => new Attribute(new Name(name), new Value());

    }

    forEach(handler, context) {

        Object
            .entries(this.factories)
            .forEach(([name, factory]) => handler.call(contact, name, factory));

    }

}

let factory = AttributeFactory.singleton();

factory.addFactory("role", ListValue);
factory.addFactory("checked", BooleanValue);
factory.addFactory("controls", ElementListValue);
factory.addFactory("describedby", ElementValue);

// Encapsulated array.
class ListType {
}

class ListValue extends Value {

    constructor(list = new ListType()) {
        this.value = list;
    }

    interpret(value) {

        if (typeof value === "string") {
            return value.trim().split(/\s+/);
        }

        if (value && value.length) {
            return [...value];
        }

        return [];

    }

    write(value) {
        this.empty();
        this.push(...this.interpret(value));
    }

    empty() {
    }

    push(...items) {

        items.forEach((item) => this.list.push(item));

        return this.list.length;

    }

    toString() {
        return this.list.join(" ");
    }

}

class ControlledListType extends ListType {

    constructor(whitelist, list = new List()) {
        super(list);
        this.whitelist = whitelist;
    }

    push(...items) {

        return super.push(
            ...items.filter((item) => this.whitelist.includes(item));
        );

    }

}

class ControlledListValue extends ListValue {

    static whitelist = [
    ];

    constructor() {
        super(new ControlledListType(this.constructor.whitelist));
    }

}

class RoleListValue extends ControlledListValue {

    static whitelist = [
        "button",
        "heading",
        // ...
    ];

}

class ControlledValue extends Value {

    static whitelist = [
    ];

    write(value) {

        if (!this.constructor.whitelist.includes(value)) {
            return false;
        }

        return super.write(value);

    }

}

/*class WhitelistListValue extends ListValue {

    constructor(whitelist) {

        super();
        this.whitelist = whitelist;

        // this.on(this.constructor.EVENT_PRE_WRITE, (e) => {
        //
        //     if (!this.whitelist.includes(e.detail.value)) {
        //         e.preventDefault();
        //     }
        //
        // });

    }

    push(...items) {

        return super.push(
            ...items.filter((item) => return this.whitelist.includes(item))
        );

    }

}

class RoleListValue extends WhitelistListValue {

    static whitelist = [
        "button",
        "heading",
        // ...
    ];

    constructor() {
        super(this.constructor.whitelist);
    }

}

AttributeFactory.singleton().addFactory("role", RoleListValue, AttributeFactory.OVERRIDE);*/

class AriaElement {

    constructor(element, factory = AttributeFactory.singleton()) {

        this.element = element;
        this.attributes = this.createFactories(factory);

        this.loadAttributes();

        return new Proxy(this, {

            set(target, name, value) {

                let attribute = this.getAttribute(name);

                return attribute && attribute.write(value);

            },

            get(target, name) {

                let attribute = this.getAttribute(name);

                return attribute && attribute.read();


            }

            deleteProperty(target, name) {

                let attribute = this.getAttribute(name);

                return attribute && attribute.remove();

            }

        });

    }

    createFactories(/* AttributeFactory */ factory) {

        let attributes = {};

        factory.each((name, factory) => {
            attributes[name] = factory;
        });

        return attributes;

    }

    loadAttributes() {

        this.getAttributes().forEach(([name, value]) => {

            let attribute = this.getAttribute(name);

            if (attribute) {
                // 2 indent :-(
                attribute.set(value);
            }

        });

    }

    getAttribute(name) {

        let normal = Name.normalise(name);
        let attribute = this.attributes[normal];

        if (!attributes) {
            return;
        }

        if (typeof attribute === "function") {

            attribute = attribute();
            attribute.on(
                "update",
                ({
                    detail: { name, value }
                }) => this.updateDOMAttribute(name, value)
            );
            this.attributes[normal] = attribute;

        }

        return attribute;

    }

    updateDOMAttribute(name, value) {

        let element = this.element;

        if (value === undefined || value === "") {
            return element.removeAttribute(name);
        }

        return element.setAttribute(name, value);

    }

}

// div.aria = new AriaElement(div);
