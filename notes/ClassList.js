class ClassList {
    constructor(element) {
        this.element = element;
        this.tokens = [];
    }
    isValid(token) {
        if (token === "" || /\s/.test(token)) {
            throw new Error("...");
        }
        return true;    
    }
    indexOf(token) {
        return this.isValid(token) && this.tokens.indexOf(token);
    }
    contains(token) {
        return this.indexOf(token) > -1;
    }
    // ...
}
class ClassList {
    // ...
    add(...tokens) {
        tokens.forEach((token) => {
            if (this.indexOf(token) < 0) {
                this.tokens.push(token);
            }
        });
        this.update();
    }
    remove(...tokens) {
        tokens.forEach((token) => {
            let index = this.indexOf(token);
            if (index > -1) { this.tokens.splice(index, 1); }
        });
        this.update();    
    }
    toggle(token, force = !this.contains(token)) {
        this[force ? "add" : "remove"](token);
    }
    // ...
}
class ClassList {
    // ...
    update() {
        this.element.token = this.toString();
    }
    toString() {
        return this.tokens.join(" ");
    }
    *[Symbol.iterator]() {
        let i = 0;
        let il = this.tokens.length;
        while (i < il) {
            yield this.tokens[i++];
        }
    }
}

