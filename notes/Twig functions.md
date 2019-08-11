# Super-charging Twig with Front-end Knowledge

Have you ever had to create a list of links from an array in [Twig](#)? It's remarkably straight forward because Twig has a [for operator](#).

```
{% set links = [ ... ] %}
<ul class="list">
    {% for link in links %}
        <li class="item">
            <a href="{{ link.href }}" class="link">{{ link.text }}</a>
        </li>
    {% endfor %}
</ul>
```

Let's suppose that one of those links can be active and you want to highlight that somehow. You could add a class, but it looks pretty ugly

```
{% set links = [ ... ] %}
<ul class="list">
    {% for link in links %}
        <li class="item">
            <a href="{{ link.href }}" class="link {{ link.active ? 'active' }}">{{ link.text }}</a>
        </li>
    {% endfor %}
</ul>
```

If you're familiar with [WGCA guidelines](#) you'll prefer to use a WAI-ARIA attribute, but that looks even uglier.

```
{% set links = [ ... ] %}
<ul class="list">
    {% for link in links %}
        <li class="item">
            <a href="{{ link.href }}" class="link" {% if link.active %}aria-current="true"{% endif %}>{{ link.text }}</a>
        </li>
    {% endfor %}
</ul>
```

Neither option are great, but as a full-stack developer, I'm familiar enough with JavaScript to know a better solution and confident enough with PHP to add that solution to my project. Let me introduce you to a JavaScript library called [classnames](https://github.com/JedWatson/classnames). That little library creates a function that creates a string of classes based on the classes that are passed. What makes it notable is that as well as strings, we can pass in an object of classes where the value is a boolean - if that boolean value is falsy, the key isn't added as a class.

```js
classNames("foo", "bar"); // -> "foo bar"
classNames("foo", { bar: false }); // -> "foo"
classNames({ foo: false }, "bar", { baz: true, blip: true, clop: false }, "dave");
// -> "bar baz blip dave"
```

If we could write a Twig function to do the same thing, we could change our class example to look like this:

```
{% set links = [ ... ] %}
<ul class="list">
    {% for link in links %}
        <li class="item">
            <a href="{{ link.href }}" class="{{ classes('link', { 'active': link.active }) }}">{{ link.text }}</a>
        </li>
    {% endfor %}
</ul>
```

We could also apply a similar mentality to attributes and end up with something like this:

```
{% set links = [ ... ] %}
<ul class="list">
    {% for link in links %}
        <li class="item">
            <a {{ attributes({ 'href': link.href }, link.active ? { 'aria-current': true }) }}>{{ link.text }}</a>
        </li>
    {% endfor %}
</ul>
```

> Here's how to do it: https://git.xigen.co.uk/epson/digigraphie-v2/blob/master/src/Twig/AppExtension.php
