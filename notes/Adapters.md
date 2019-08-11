# Adapter Pattern

Practical example: Epson need to track the errors on forms, but there are a few different validators that are used.

Solution: Add an adapter that checks for them.

```js
class ValidatorAdapter {

    constructor(form) {
        this.form = form;
    }

    getErrors() {
        return [];
    }

    hasErrors() {
        return this.getErrors().length > 0;
    }

    static check(form) {
        return false;
    }

}
```

I can use the adapter to get the information I need.

```js
class FormTracker {

    static adapters = [];

    constructor(form) {

        this.form = form;

        this.discoverValidator();
        this.addHandlers();

    }

    discoverValidator() {

        let form = this.form;
        let Adapter = FormTracker.adapters.find(
            (adapter) => adapter.check(form)
        );

        if (Adapter) {
            this.validator = new Adapter(form);
        }

    }

    addHandlers() {

        let validator = this.validator;

        this.form.addEventListener("submit", () => {

            if (validator && validator.hasErrors()) {
                this.trackErrors(validator.getErrors());
            } else {
                this.trackSuccess();
            }

        });

    }

}
```

Now I can create adapters for specific validators.

```js
class NativeValidatorAdapter extends ValidatorAdapter {

    getErrors() {

        let errors = [];

        this.form
            .querySelectorAll("input,select,textarea")
            .forEach(function (input) {

                if (!input.validity.valid) {

                    errors.push({
                        element: input,
                        message: input.validationMessage
                    });

                }

            });

        return errors;

    }

    static check(form) {

        return (
            ("reportValidity" in form)
            && !form.matches("[novalidate]")
        );

    }

}

Form.adapters.push(NativeValidatorAdapter);
```

```js
class JQueryValidatorAdapter extends ValidatorAdapter {

    constructor(form) {

        super(form);
        this.validator = $(form).data("validator");

    }

    getErrors() {
        return this.validator.errorList;
    }

    static check(form) {

        return (
            window.$
            && $.fn.validate
            && $(form).data("validator")
        );

    }

}

Form.adapters.push(JQueryValidatorAdapter);
```

The CO2 calculator validator just changes the border colour of required fields. I need to track that as well.

```js
class CO2ValidatorAdapter extends ValidatorAdapter {

    getErrors() {

        let form = this.form;
        let errors = [];

        $("input,label,.select_display", form).each(function () {

            let input = this;
            let jQinput = $(input);

            if (jQinput.css("border-color") === "red") {

                if (jQinput.is("label")) {

                    let id = jQinput.attr("for");
                    input = $(`input[id="${id}"]`, form)[0];

                } else if (jQinput.is(".select_display")) {

                    let name = jQinput.data("select-name");
                    input = $(`select[name="${name}"]`, form)[0];

                }

                if (input) {

                    errors.push({
                        element: input,
                        message: "This field is required"
                    });

                }

            }

        });

        return errors;

    }

    static check(form) {
        return form.classList.contains("co2-calculator");
    }

}
```
