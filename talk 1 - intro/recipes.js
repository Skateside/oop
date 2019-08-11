class WhiteSauce {

    constructor() {

        this.ingredients = [
            "butter",
            "flour",
            "milk"
        ];

    }

    cook() {
        this.ingredients.forEach((ingredient) => this.addToPan(ingredient));
    }

    addToPan(/* Pan */ pan) {
        // ...
    }

}

class CheeseSauce extends WhiteSauce {

    constructor() {
        super();
        this.ingredients.push("cheese");
    }

}

class MacAndCheese extends CheeseSauce {

    constructor() {
        super();
        this.ingredients.push("macaroni");
    }

}

class SaucyTuna extends WhiteSauce {

    constructor() {
        super();
        this.ingredients.push("tuna");
    }

}

class Pie {

    constructor() {
        this.contents = "";
    }

    cook() {
        this.rollPastry();
        this.addContents(this.contents);
        this.addToOven();
    }

    rollPastry() {
        // ...
    }

    addContents(contents) {
        // ...
    }

    addToOven(/* Oven */ oven) {
        // ...
    }

}

class TunaPie extends Pie {

    constructor() {
        super();
        this.contents = new SaucyTuna();
    }

}
