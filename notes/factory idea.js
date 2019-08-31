class Factory {
    constructor(options) {
        this.options = Object.create(null);
    }
    define(option, definition) {
        if (this.options[option]) {
            throw new Error("...");
        }
        this.options[option] = definition;
    }
    require(option) {
        let factory = this.options[option];
        if (!factory) {
            throw new ReferenceError("...");
        }
        return factory;
    }
    create(option) {
        return this.require(option)();
    }
}

let employeeFactory = new Factory();
employeeFactory.define("designer", () => new Designer());
employeeFactory.define("developer", () => new Developer());

let designer = employeeFactory.create("designer");
designer.code(); // -> TypeError()
designer.drinkCoffee(); // -> Logs: "yum"

let developer = employeeFactory.create("developer");
developer.draw(); // -> TypeError()
developer.drinkCoffee(); // -> Logs: "yum"


class AvailableFactory extends Factory {
    getAvailable(...params) {
        for (let option of Object.values(this.options)) {
            if (option.check()) {
                return option.definition(...params);
            }
        }
        throw new Error("...");
    }
    define(option, definition, check) {
        super.define(option, { definition, check });
    }
    create(option) {
        return this.require(option).definition();
    }
}

let asyncFactory = new AvailableFactory();
asyncFactory.define("fetch", {
    check() { return typeof window.fetch === "function"; },
    definition(url) { return fetch(url); }
});
asyncFactory.define("xhr", {
    check() {
        return typeof window.XmlHttpRequest === "function";
    },
    definition(url) {
        return new Promise(function (resolve, reject) {
            let xhr = new XmlHttpRequest();
            xhr.open("GET", url);
            // ...
        });
    }
});

asyncFactory.getAvailable("https://...")
    .done((response) => {/* ... */});
