class ValidationAdapter {
    static check(form) {
        return false;
    }
    constructor(form) {
        this.form = form;
    }
    getErrors() {
        return [];
    }
    hasErrors() {
        return this.getErrors().length > 0;
    }
}

class NativeValidationAdapter extends ValidationAdapter {
    static check(form) {
        return (
            !form.matches("[novalidate]")
            && ("reportValidity" in form)
        );
    }
    getErrors() {
        return [...this.form.querySelectorAll("...")]
            .filter((element) => !element.validity.valid)
            .map((element) => ({
                element, message: element.validationMessage
            }));
    }
}

class JqueryValidationAdapter extends ValidationAdapter {
    static check(form) {
        return Boolean($(form).data("validator"));
    }
    constructor(form) {
        super(form);
        this.validator = $(form).data("validator");
    }
    getErrors() {
        return this.validator.errorList;
    }
}

class CO2CalculatorValidationAdapter extends ValidationAdapter {
    static check(form) { return form.id === "co2-calculator"; }
    getErrors() {
        return [...this.form.querySelectorAll("...")]
            .filter((element) => this.isErrorElement(element))
            .map((element) => ({
                element,
                message: "This field is required"
            }));
    }
    getBorderColor(element) {/* getComputedStyle... */}
    isErrorElement(element) {/* "red", "rgb(255, 0, 0)" ... */}
}
