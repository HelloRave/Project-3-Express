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

const createProductForm = (brands, categories, allergens) => {
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
        category_id: fields.string({
            label: 'Category',
            required: true,
            errorAfterField: true,
            widget: widgets.select(),
            choices: categories
        }),
        allergens: fields.string({
            required: false,
            errorAfterField: true,
            widget: widgets.multipleSelect(),
            choices: allergens
        })
    })
}

const createVariantForm = (flavour) => {
    return forms.create({
        flavour_id: fields.string({
            label: 'Flavour',
            required: true,
            errorAfterField: true,
            widget: widgets.select(),
            choices: flavour
        }),
        stock: fields.string({
            required: true,
            errorAfterField: true,
            validators: [validators.integer(), validators.min(0), validators.max(999)]
        }),
        product_image_url: fields.string({
            widget: widgets.hidden()
        }),
        product_thumbnail_url: fields.string({
            widget: widgets.hidden()
        })
    })
}

const createSearchForm = (categories, brands, allergens, flavours) => {
    return forms.create({
        name: fields.string({
            required: false,
            errorAfterField: true
        }),
        min_cost: fields.string({
            label: 'Minimum cost',
            required: false,
            errorAfterField: true,
            validators: [validators.integer(), validators.min(0)]
        }),
        max_cost: fields.string({
            label: 'Maximum cost',
            required: false,
            errorAfterField: true,
            validators: [validators.integer(), validators.min(0)]
        }),
        min_serving_size: fields.string({
            label: 'Min serving',
            required: false,
            errorAfterField: true,
            validators: [validators.integer(), validators.min(0)]
        }),
        max_serving_size: fields.string({
            label: 'Max serving',
            required: false,
            errorAfterField: true,
            validators: [validators.integer(), validators.min(0)]
        }),
        category_id: fields.string({
            label: 'Category',
            required: false,
            errorAfterField: true,
            widget: widgets.select(),
            choices: categories
        }),
        brand_id: fields.string({
            label: 'Brand',
            required: false,
            errorAfterField: true,
            widget: widgets.select(),
            choices: brands
        }),
        allergen: fields.string({
            required: false,
            errorAfterField: true,
            widget: widgets.multipleSelect(),
            choices: allergens
        }),
        flavour: fields.string({
            required: false,
            errorAfterField: true,
            widget: widgets.select(),
            choices: flavours
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

module.exports = { createProductForm, createUserForm, createLoginForm, createVariantForm, createSearchForm, bootstrapField }