class Sale {
    static decorators = Object.create(null);
    constructor(price = 100) {
        this.price = price;
    }
    getPrice() {
        return this.price;
    }
    decorate(decorator) {
        let decoration = this.constructor.decorators[decorator];
        if (!decoration) {
            throw new ReferenceError("...");
        }
        return Object.assign(
            Object.create(this),
            { uber: this },
            decoration
        );
    }
}

Sale.decorators.halfPrice = {
    getPrice() {
        return this.uber.getPrice() / 2;
    }
};
Sale.decorators.tax = {
    getPrice() {
        return this.uber.getPrice() * 1.2;
    }
};

let sale = new Sale();
sale = sale.decorate("halfPrice");
sale = sale.decorate("tax");

class Sale2 extends Sale {
    decorate(decorator) {
        let decoration = this.constructor.decorators[decorator];
        if (!decoration) {
            throw new ReferenceError("...");
        }
        Object.entries(decoration).forEach(([name, func]) => {
            let previous = this[name].bind(this);
            this[name] = (...args) => func(previous, ...args);
        });
    }
}

Sale2.decorators.halfPrice = {
    getPrice(previous) {
        return previous() / 2;
    }
};
Sale2.decorators.tax = {
    getPrice(previous) {
        return previous() * 1.2;
    }
};
