const ingredients = input.page.ingredients
const servings = input.page.servings

function title(str) {
    return str
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
}

function unit(u) {
    return u.toLowerCase().replace(/s$/, "")
}

function convertIngredientString(i) {
    const quantity = /(\d+\s?\w+)/.exec(i)[1]
    const ingredient = i.replace(quantity, "")

    return {
        ingredient,
        quantity: Number(/(\d+)/.exec(quantity)[1]),
        unit: unit(/([a-zA-Z]+)/.exec(quantity)[1]),
    }
}

const displayIngredientList = Object.keys(ingredients)
    .map(k => /*html*/`<h6>${title(k)}</h6><ul>${ingredients[k].map(i => /*html*/`<li>${i}</li>`).join("")}</ul>`)
    .join("")

const displayNutrition = Object.keys(ingredients)
    .flatMap(k => ingredients[k])
    .map(convertIngredientString)
    .reduce((res, item) => {
    }, [])

dv.el("div", /*html*/`<div>${displayIngredientList}</div><div></div>`)