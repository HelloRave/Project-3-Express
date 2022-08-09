const forms = require('forms')

const fields = forms.fields
const validators = forms.validators
const widgets = forms.widgets

const bootstrapField = function (name, object) {
    if (!Array.isArray(object.widget.classes)) { object.widget.classes = []; }

    if (object.widget.classes.indexOf('form-control') === -1) {
        object.widget.classes.push('form-control');
    }

    var validationclass = object.value && !object.error ? 'is-valid' : '';
    validationclass = object.error ? 'is-invalid' : validationclass;
    if (validationclass) {
        object.widget.classes.push(validationclass);
    }

    var label = object.labelHTML(name);
    var error = object.error ? '<div class="invalid-feedback">' + object.error + '</div>' : '';

    var widget = object.widget.toHTML(name, object);
    return '<div class="form-group">' + label + widget + error + '</div>';
};

const createProductForm = (brands, allergens) => {
    return forms.create({
        product_name: fields.string({
            label: 'Product Name',
            required: true,
            errorAfterField: true
        }),
        description: fields.string({
            required: false,
            errorAfterField: true
        }),
        cost: fields.number({
            required: true,
            errorAfterField: true,
            validators: [validators.integer()]
        }),
        serving_size: fields.number({
            label: 'Serving Size',
            required: true,
            errorAfterField: true,
            validators: [validators.integer()]
        }),
        brand_id: fields.string({
            label: 'Brand',
            required: true,
            errorAfterField: true,
            widget: widgets.select(),
            choices: brands
        }),
        allergens: fields.string({
            required: false,
            errorAfterField: true,
            widget: widgets.multipleSelect(),
            choices: allergens
        })
    })
}

const createUserForm = () => {
    return forms.create({
        email: fields.string({
            required: true,
            errorAfterField: true
        }),
        first_name: fields.string({
            required: true,
            errorAfterField: true
        }),
        last_name: fields.string({
            required: true,
            errorAfterField: true
        }),
        password: fields.password({
            required: true, 
            errorAfterField: true
        }),
        confirm_password: fields.password({
            required: true,
            errorAfterField: true,
            validators: [validators.matchField('password')]
        })
    })
}

const createLoginForm = () => {
    return forms.create({
        email: fields.string({
            required: true,
            errorAfterField: true
        }),
        password: fields.password({
            required: true,
            errorAfterField: true
        })
    })
}

module.exports = { createProductForm, createUserForm, createLoginForm, bootstrapField }