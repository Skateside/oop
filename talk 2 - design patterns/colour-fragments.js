var colourFrags = [
    {
        check: "#pro-js-dp",
        find: ".js--fragment--one",
        className: "display-blue"
    },
    {
        check: "#this-talk",
        find: ".js--fragment--two",
        className: "display-green"
    }
];

Reveal.addEventListener("fragmentshown", ({ fragment }) => {

    colourFrags.forEach(({ check, find, className }) => {

        if (fragment.matches(check)) {

            document.querySelectorAll(find).forEach(function (el) {
                el.classList.add(className);
            });

        }

    });

});

Reveal.addEventListener("fragmenthidden", ({ fragment }) => {

    colourFrags.forEach(({ check, find, className }) => {

        if (fragment.matches(check)) {

            document.querySelectorAll(find).forEach(function (el) {
                el.classList.remove(className);
            });

        }

    });

});
