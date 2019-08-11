# Styling with Algebra

I've been a web developer for 10 years (and a hobbyist for roughly 7 years before then) and the best skill I ever developed was learning how to solve a problem. My background with maths (specifically algebra) helped enormously. In its purest form, algebra is problems solving: "I know some things, how can I use that to work out something I need to know?"

Let's put that into something a little less abstract so you can see how useful that thought process can be. We recently had a design which called for a few buttons to appear on the left side of the screen. The right edge of the buttons needed to be on the right edge of the container, but the background needed to stretch to the end of the screen. As a further twist, the website layout only went as wide as 1900 pixels so the button background needed to stop there as well.

> Image of Digigraphie hero buttons here.

Whatever solution we put in place has to be CSS-based. We can use a tiny amount of JavaScript, but CSS will be the main technology used. Besides, this is a styling issue - we should be able to fix it with styling. We also want CSS to work it out (we can use [CSS's *calc()* function](https://developer.mozilla.org/en-US/docs/Web/CSS/calc) for that) rather than having it hard-coded as a "magic number" since it'll be less confusing for future developers and it's like likely to be forgotten about if a change is made. In fact, if we do it properly, we won't need to update it even if the values are changed elsewhere!

Button the buttons on the right side of the container is extremely easy.

```css
.hero {
    position: relative;
}

.hero-buttons {

    background-color: orange;

    position: absolute;
    bottom: 0;
    right: 0;

}
```

The extended background will be a pseudo element with the same background colour as the buttons.

```css
.hero-buttons::after {

    background-color: orange;

    content: "";
    display: block;

    position: absolute;
    left: 100%;
    height: 100%;

    /* max-width: something clever */
    /* width: something else clever */

}
```

The `left: 100%` style will align the pseudo element's left edge with the hero buttons' right edge. All we need now are the widths.

Here's where some algebra knowledge kicks in. If we sketch out what we already know and denote them with letters, we can see how we can work out things we need.

> Sketch of Digigraphie elements here.

Let's break down what we know:

- We know the width of the screen (*s*). I need a little magic to fully know it, but I'll explain that later.
- We know the width of the container (*c*). It changes between breakpoints, but it's always a known width and we can adjust our pseudo element at those same breakpoints.
- We know the maximum size of the outer container (*o*) - it's 1900 pixels.

OK - what do we need to know?

- We need to know the distance from the edge of the container to the edge of the outer container. We'll call that *x* and it will be our pseudo element's `max-width`.
- We need to know the distance from the edge of the container to the edge of the screen. This will be our pseudo element's `width` and we'll call it *y*.

All we need now is a couple of formulae to get *x* or *y* in terms of *s*, *c* and *o*. We can use one of our unknowns to get the other (we could work out *y* in terms of *x*, for example) but we can't do that with both unknowns. As it happens, we don't need to.

If we take *o* and subtract *c* we get the difference between the container and the outer container - the combined size of both sides. If we divide that by 2, we get one of those sides. Looking at the sketch you'll see that we called that *x* so we write *x* like this:

_x = (o - c) / 2_

If we do the same with the container and the screen, we can get *y*. Therefore, we can express *y* like this:

_y = (s - c) / 2_

All we need now are some actual values for *s*, *c* and *o*.

As I've said before, *o* is a constant 1900 pixels and *c* is a known size for any given break point. We can apply those to our styles.

```css
.hero-buttons::after {
    /* ... */
    max-width: calc((1900px - 100%) / 2);
}

@media (min-width: 768px) {

    .hero-buttons::after {
        max-width: calc((1900px - 720px) / 2);
    }

}

@media (min-width: 992px) {

    .hero-buttons::after {
        max-width: calc((1900px - 960px) / 2);
    }

}

@media (min-width: 1200px) {

    .hero-buttons::after {
        max-width: calc((1900px - 1200px) / 2);
    }

}
```

The screen width (*s*) is slightly more complicated. It should just be `100vw`, but scrollbars aren't included. The width of the scrollbars changes depending on operating system and browser (I use Opera on Ubuntu, so my scrollbars are 15 pixels). Additionally, IE scrollbars usually sit on top of the screen and don't adjust the screen size. Some CSS resets force the IE scrollbars to appear for cross-browser consistency, but that'll work against us for a trick we're about to pull. The first thing we need to do is check our reset to see if the scrollbars are being defined.

```css
/* This forces the scrollbars to always be present. Either set this value to
   -ms-autohiding-scrollbar or just remove the property, which we did here. */
html {
    /*-ms-overflow-style: scrollbar;*/
}
```

For our next trick, we'll detect the scrollbar width using JavaScript and store it in a [CSS custom property](#) so that our styles can read the value. IE11 does not understand CSS custom properties, but it doesn't have a scrollbar width now, so we can get away with it. Admittedly, that's more luck than judgement. [David Walsh described how to detect scrollbar width](https://davidwalsh.name/detect-scrollbar-width) so I'll use his work.

```js
// Based on the work by David Walsh.
// https://davidwalsh.name/detect-scrollbar-width
function getScrollbarWidth() {

    var scrollDiv = document.createElement("div");
    var scrollbarWidth = 0;

    scrollDiv.style.cssText = (
        "height:100px;" +
        "overflow:scroll;" +
        "position:absolute;" +
        "top:-9999px;" +
        "width:100px;"
    );
    document.body.appendChild(scrollDiv);
    scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    document.body.removeChild(scrollDiv);

    return scrollbarWidth;

}

document.documentElement.style.setProperty(
    "--scroll-bar",
    getScrollbarWidth() + "px"
);
```

With this knowledge, we can replace *s* with `100vw - var(--scroll-bar, 0px)` and we already know *c* so we can include our `width` calculations. We need to add a fallback for browsers that don't understand CSS custom properties. It should be enough to simply include the recognisable property before the advanced one, but for safety's sake, let's make sure with [@supports](https://developer.mozilla.org/en-US/docs/Web/CSS/@supports).

```css
.hero-buttons::after {
    /* ... */
    max-width: calc((1900px - 100%) / 2);
    width: calc((100vw - 100%) / 2);
}

@supports (width: var(--scroll-bar)) {
    .hero-buttons::after {
        width: calc(((100vw - var(--scroll-bar, 0px)) - 100%) / 2);
    }
}

@media (min-width: 768px) {

    .hero-buttons::after {
        max-width: calc((1900px - 720px) / 2);
        width: calc((100vw - 720px) / 2);
    }

    @supports (width: var(--scroll-bar)) {
        .hero-buttons::after {
            width: calc(((100vw - var(--scroll-bar, 0px)) - 720px) / 2);
        }
    }

}

@media (min-width: 992px) {

    .hero-buttons::after {
        max-width: calc((1900px - 960px) / 2);
        width: calc((100vw - 960px) / 2);
    }

    @supports (width: var(--scroll-bar)) {
        .hero-buttons::after {
            width: calc(((100vw - var(--scroll-bar, 0px)) - 960px) / 2);
        }
    }

}

@media (min-width: 1200px) {

    .hero-buttons::after {
        max-width: calc((1900px - 1200px) / 2);
        width: calc((100vw - 1200px) / 2);
    }

    @supports (width: var(--scroll-bar)) {
        .hero-buttons::after {
            width: calc(((100vw - var(--scroll-bar, 0px)) - 1200px) / 2);
        }
    }

}
```

Well ... that's ugly! Instead of using pure CSS, let's use SASS as a preprocessor to generate those same styles.

```scss
$grid-breakpoints: (
    sm: 400px,
    md: 768px,
    lg: 992px,
    xl: 1200px
);
$container-max-widths: (
    sm: 100%,
    md: 720px,
    lg: 960px,
    xl: 1200px
);
$container-max-outer-width: 1900px;

.hero-buttons::after {

    // ...

    @each $name, $size in $container-max-widths {

        @include media-breakpoint-up($name) {

            max-width: calc((#{$container-max-outer-width} - #{$size}) / 2);
            width: calc((100vw - #{$size}) / 2);

            @supports (width: var(--scroll-bar)) {
                width: calc(
                    ((100vw - var(--scroll-bar, 0px)) - #{$size}) / 2
                );
            }

        }

    }

}
```

Did you notice that our SASS variable `$container-max-outer-width` is the same as the *o* we were using earlier, or that the `$size` variable inside the loop is the same as *c*? I often find that programming languages were built by people who thought in mathematical terms - CSS included.
