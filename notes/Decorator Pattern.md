# Decorator pattern

Handy for times when you need to extend a class dynamically but there are too many possibilities to justify sub-classing. It's also really handy when you need to be able to dynamically apply modifications.

```js
class Product {

    constructor(name, price) {
        this.name = name;
        this.price = price;
    }

    getName() {
        return this.name;
    }

    getPrice() {
        return this.price;
    }

}

let bread = new Product("Bread", 1);
bread.getPrice(); // -> 1

class HalfPriceDecorator {

    constructor(product) {
        this.product = product;
    }

    getName() {
        return this.product.getName();
    }

    getPrice() {
        return this.product.getPrice() / 2;
    }

}

bread = new HalfPriceDecorator(bread);
bread.getPrice(); // -> 0.5
```

It's a handy pattern when you want to offer a variety of options for a product but you don't necessarily know which options a user will want.

```js
// NOTE: not sure how useful the getName() and addExtra() methods are.

class Holiday {

    constructor() {
        this.extras = [];
    }

    getPrice() {
        return 25;
    }

    addExtra(option) {
        this.extras.push(option);
    }

    getExtras() {
        return this.extras;
    }

}

class HolidayDecorator {

    constructor(holiday) {
        this.holiday = holiday;
        holiday.addExtra(this);
    }

    getName() {
        return "An optional extra";
    }

    getPrice() {
        return this.holiday.getPrice();
    }

    addExtra(option) {
        this.holiday.addExtra(option);
    }

    getExtras() {
        return this.holiday.getExtras();
    }

}

class CarParkingDecorator extends HolidayDecorator {

    getName() {
        return "Car parking for 1 car";
    }

    getPrice() {
        return this.holiday.getPrice() + 10;
    }

}

class SmallTentDecorator extends HolidayDecorator {

    getName() {
        return "A 1-person tent";
    }

    getPrice() {
        return this.holiday.getPrice() + 2;
    }

}

class MediumTentDecorator extends HolidayDecorator {

    getName() {
        return "A 2-person tent";
    }

    getPrice() {
        return this.holiday.getPrice() + 3.5;
    }

}

class LargeTentDecorator extends HolidayDecorator {

    getName() {
        return "A 4-person tent";
    }

    getPrice() {
        return this.holiday.getPrice() + 5;
    }

}

let holiday = new Holiday();
holiday.getPrice(); // -> 25
holiday.getExtras(); // -> []

holiday = new CarParkingDecorator(holiday);
holiday.getPrice(); // -> 35
holiday.getExtras(); // -> [CarParkingDecorator]

holiday = new SmallTentDecorator(holiday);
holiday = new SmallTentDecorator(holiday);
holiday = new MediumTentDecorator(holiday);
holiday.getPrice(); // -> 42.5
holiday.getExtras(); // -> [CarParkingDecorator, SmallTentDecorator, SmallTentDecorator, MediumTentDecorator]
```

You keep replacing `holiday` with the newly decorated `holiday` but that doesn't matter - you won't need the old one anymore.

It doesn't just have to be price. It could be things like assembly instructions or cooking ingredients.
