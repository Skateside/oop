class DOMEx extends Error {

    constructor(type, message) {

        super();

        this.name = type;
        this.code = DOMException[type];
        this.message = message;

    }

};

const lists = new WeakMap();

const checkAndGetIndex = (list, item) => {

    if (item === "") {

        throw new DOMEx(
            "SYNTAX_ERR",
            "An invalid or illegal string was specified"
        );

    } else if (/\s/.test(item)) {

        throw new DOMEx(
            "INVALID_CHARACTER_ERR",
            "String contains an invalid character"
        );

    }

    return list.indexOf(item);

};

class List {

    constructor(iterable) {

        lists.set(this, []);

        if (typeof iterable === "string") {
            this.add(...iterable.trim().split(/\s+/));
        // } else if (ARIA.isArrayLike(iterable)) {
        } else if ( iterable && ( Array.isArray(iterable) || iterable[Symbol.iterator] )) {
            this.add(...iterable);
        }

        /**
         * The number of items in the current {@link List}.
         *
         * @name length
         * @type {Number}
         */
        Object.defineProperty(this, "length", {

            get() {
                return lists.get(this).length;
            },

            set(value) {

                let newArray = lists.get(this);

                newArray.length = value;
                lists.set(this, newArray);

            }

        });

        /*
        return new Proxy(this, {

            get(target, name) {

                let property = target[name];

                return (
                    Number.isInteger(Number(name))
                    ? target.item(name)
                    : (
                        typeof property === "function"
                        ? property.bind(target)
                        : property
                    )
                );

            },

            set(target, name, value) {

                let list = lists.get(target);
                let isSet = false;

                if (Number.isInteger(Number(name))) {

                    if (checkAndGetIndex(list, value)) {

                        list[name] = value;
                        isSet = true;

                    }

                } else {

                    target[name] = value;
                    isSet = true;

                }

                return isSet;

            }

        });
        */

    }

    item(i) {
        return lists.get(this)[i];
    }

    add(...items) {

        let list = lists.get(this);

        items.forEach((item) => {

            item = String(item);

            if (checkAndGetIndex(list, item) < 0) {
                list.push(item);
            }

        });

        lists.set(this, list);

    }

    remove(...items) {

        let list = lists.get(this);

        items.forEach((item) => {

            let index = checkAndGetIndex(list, item);

            if (index > -1) {
                list.splice(index, 1);
            }

        });

        lists.set(this, list);
    }

    contains(item) {
        return checkAndGetIndex(lists.get(this), item) > -1;
    }

    toArray(map, context) {
        return Array.from(lists.get(this), map, context);
    }

    toString(glue = " ") {
        return lists.get(this).join(glue);
    }

    [Symbol.iterator]() {

        let i = 0;
        let list = lists.get(this);

        return {

            next() {

                let returnValue =  (
                    i < lists.length
                    ? {
                        done: false,
                        value: list[i]
                    }
                    : {
                        done: true
                    }
                );

                i += 1;

                return returnValue;

            }

        };

    }

}
