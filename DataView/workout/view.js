// Requires: dataviewjs and metaedit

const { update } = this.app.plugins.plugins.metaedit.api

const lifts = input.lifts
const path = input.path
const container = input.target

function create(l, s, t, tr, ty = "text") {
    const td = document.createElement("td")
    tr.appendChild(td)

    const input = document.createElement("input")
    td.appendChild(input)

    input.type = ty
    switch (ty) {
        case "checkbox":
            input.value = lifts[l].sets[s][t]
            input.checked = lifts[l].sets[s][t]
            input.addEventListener("change", e => {
                lifts[l].sets[s][t] = !lifts[l].sets[s][t]
                update("workout", lifts, path)
            })
            break;
        default:
            input.value = lifts[l].sets[s][t] || ""
            input.addEventListener("change", e => {
                lifts[l].sets[s][t] = e.target.value
                update("workout", lifts, path)
            })

    }
}

lifts.forEach((lift, lift_index) => {
    const liftContainer = document.createElement("div")
    liftContainer.innerHTML = `<h1>${lift.lift}</h1><span>${lift.notes.replaceAll("\n", "<br>")}</span>`
    container.appendChild(liftContainer)

    const table = document.createElement("table")
    table.innerHTML = "<thead><tr><th>Weight</th><th>Reps</th><th>Notes</th><th></th></tr></thead>"
    liftContainer.appendChild(table)

    const tbody = document.createElement("tbody")
    table.appendChild(tbody)

    lift.sets.forEach((set, set_index) => {
        const tr = document.createElement("tr")
        tbody.appendChild(tr)

        // ---- Weight
        create(lift_index, set_index, "weight", tr)

        // ---- Reps
        create(lift_index, set_index, "reps", tr)

        // ---- Notes
        create(lift_index, set_index, "notes", tr)

        // ---- Complete
        create(lift_index, set_index, "complete", tr, "checkbox")
    })
})