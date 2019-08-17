class Observer {
    constructor(eventElement = document.createElement("div")) {
        this.eventElement = eventElement;
    }
    addEventListener(name, handler) {
        this.eventElement.addEventListener(name, handler);
    }
    removeEventListener(name, handler) {
        this.eventElement.removeEventListener(name, handler);
    }
    createEvent(name, detail) {
        return new CustomEvent(name, {
            bubbles: true,
            cancelable: true,
            detail
        });
    }
    dispatchEvent(event, detail) {
        if (typeof event === "string") {
            event = this.createEvent(event, detail);
        }
        this.eventElement.dispatchEvent(event);
        return event;
    }
}

class Carousel extends Observer {

    constructor(/* Element[] */ items) {

        super();
        this.items = items;
        this.start = 0;
        this.page = 3;

    }

    hideAll() {
        this.items.forEach((item) => this.dispatchEvent("hide-item", item));
    }

    showVisible() {

        let {
            items,
            start,
            page
        } = this;

        items
            .slice(start, start + page)
            .forEach((item) => this.dispatchEvent("show-item", item));

    }

    render() {

        this.hideAll();
        this.showVisible();
        this.dispatchEvent("render");

    }

    pageSize(/* Number */ size) {

        this.page = size;
        this.render();

    }

    next() {

        this.start += this.page;
        this.render();

        if (this.start + this.page >= this.items.length) {
            this.dispatchEvent("end");
        }

    }

    prev() {

        this.start = Math.max(this.start - this.page, 0);
        this.render();

        if (this.start === 0) {
            this.dispatchEvent("start");
        }

    }

}

(() => {

    let carousel = new Carousel([...document.querySelectorAll(".carousel__item")]);
    let prev = document.querySelector("#prev");
    let next = document.querySelector("#next");

    prev.addEventListener("click", () => carousel.prev());
    next.addEventListener("click", () => carousel.next());

    carousel.addEventListener("hide-item", ({ detail: item }) => item.hidden = true);
    carousel.addEventListener("show-item", ({ detail: item }) => item.hidden = false);
    carousel.addEventListener("render", () => {

        prev.disabled = false;
        next.disabled = false;

    });
    carousel.addEventListener("start", () => prev.disabled = true);
    carousel.addEventListener("end", () => next.disabled = true);

})();
