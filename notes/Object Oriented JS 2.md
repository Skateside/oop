- Hands to yourself!
    - Only call your own methods or sandbox methods.
    - Don't access DOM elements outside of your box.
    - Don't access non-native global objects.
- Ask, don't take!
    - Anything you need, ask the sandbox.
- Don't leave your toys around!
    - Don't create global objects.
- Don't talk to strangers!
    - Don't directly reference other modules.

## Hands to Yourself!

Only call your own methods.

```js
class Hoozit {

    constructor(thing) {
        this.thing = thing;
    }

    getThing() {
        return this.thing;
    }

}

class Gizmo {

    constructor(hoozit) {
        this.hoozit = hoozit;
    }

    getSomething() {
        return "something";
    }

}

let gizmo = new Gizmo(new Hoozit("thingamibob"));

// Good:
gizmo.getSomething();

// Bad:
gizmo.hoozit.getThing();
```

If you need access to the `hoozit` methods from the `gizmo` variable, create a wrapper method in the `Gizmo` class. The class is allowed to access the methods of its properties.

```js
// Good:
class Gizmo {

    // ...

    getThing() {
        return this.hoozit.getThing();
    }

}

gizmo.getThing();
```

The class shouldn't be allowed to access methods from `Hoozit` properties.

```js
// Bad:
class Gizmo {
    // ...
    getUpperThing() {
        return this.hoozit.thing.toUpperCase();
    }
}

// Good:
class Hoozit {
    // ...
    getUpperThing() {
        return this.thing.toUpperCase();
    }
}

class Gizmo {
    // ...
    getUpperThing() {
        return this.hoozit.getUpperThing();
    }
}
```

We keep this rule so that we can change `Hoozit` for something else without having to re-write `Gizmo`. So long as the new thing has the same methods as `Hoozit`, the code will work fine.

`Gizmo` shouldn't know anything about `Hoozit`. Don't rely on any of `Hoozit`'s methods, for example.

```js
// Bad:
class Gizmo {
    constructor(thing) {
        this.hoozit = new Hoozit(thing);
    }
}

// Good:
class Gizmo {
    constructor(hoozit) {
        this.hoozit = hoozit;
    }
}
```

Ideally, this extends to non-native globals as well. In theory, your class shouldn't know anything about other global variables - pass in anything you need, including all DOM nodes that you'll be working with.

```js
// Bad:
class Popup {
    constructor(id) {
        this.jQpopup = $(`#${id}`);
    }
}

// Good:
class Popup {
    constructor(jQpopup) {
        this.jQpopup = jQpopup;
    }
}
```

Since jQuery allows its methods to chain, we can bend the earlier rule of not calling nested methods slightly.

```js
class Popup {
    // ...
    setup() {
        this.jQpopup
            .addClass("...")
            .on("...", () => {})
            .trigger("...");
    }
}
```

## Ask, Don't Take!

Don't access a property, call a method.

```js
// Bad:
class Gizmo {
    constructor(name) {
        this.name = name;
    }
}

let gizmo = new Gizmo("name");
gizmo.name;

// Good:
class Gizmo {
    // ...
    getName() {
        return this.name;
    }
}

let gizmo = new Gizmo("name");
gizmo.getName();
```

As well as allowing us change the way the data is stored in the future without having to re-write everything else, it also means that we don't need an interface - if the method doesn't exist, we'll get a `TypeError`.
