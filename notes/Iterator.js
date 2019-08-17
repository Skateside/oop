function makeIterator(iterable) {

    let index = 0;
    let length = iterable.length;

    return {

        [Symbol.iterator]() {
            return this;
        },

        next() {

            let value = iterable[index];

            index += 1;

            return Object.freeze(
                index > length
                ? { done: true }
                : { done: false, value }
            );

        }

    };

}

class Iterator {

    constructor(iterable = []) {

        this.index = 0;
        this.length = iterable.length;
        this.iterable = iterable;

    }

    next() {

        let value = this.iterable[this.index];

        this.index += 1;

        return Object.freeze(
            this.index > this.length
            ? { done: true }
            : { done: false, value }
        );

    }

    [Symbol.iterator]() {
        return this;
    }

    // reset() {
    //
    //     this.index = 0;
    //     return this;
    //
    // }

}

class Range extends Iterator {

    constructor(start, end) {

        super();
        this.start = start;
        this.length = end - start;

    }

    next() {

        this.iterable[this.index] = this.start;
        this.start += 1;

        return super.next();

    }

}
