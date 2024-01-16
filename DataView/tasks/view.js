function daysInMonth(y, m) {
    const isLeapYear = (y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0)

    const daysInMonthMap = [
        31, (isLeapYear ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31
    ]

    return daysInMonthMap[m - 1]
}

function getDayOfWeek(year, month, day) {
    month--

    const specifiedDay = new Date(year, month, day)

    const dayOfWeek = specifiedDay.getDay()

    const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"]

    return daysOfWeek[dayOfWeek]
}

function getSaturdays(year, month) {
    month--

    const saturdays = []

    for (let day = 1; day <= new Date(year, month + 1, 0).getDate(); day++) {
        const currentDay = new Date(year, month, day)

        if (currentDay.getDay() === 6)
            saturdays.push(day)
    }

    return saturdays
}

const MON = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
]

const Y = dv.date("today").year
const M = dv.date("today").month
const d = dv.date("today").day
const m = MON[M - 1]

const days = daysInMonth(Y, M)

const pages = dv.pages(`"${input.path}"`)
    .where(f => f.due_date && dv.date(f.due_date) > dv.date("today") && f.status != "Complete")

function renderNumber(n) {
    const numbers = [...Array(n).keys()]
        .map(v => /*html*/`<span class="tasks-numbering">${v + 1}</span>`)
        .join('')
    return /*html*/`${numbers}<span></span>`
}

function renderLabel(n) {
    const labels = [...Array(n).keys()]
        .map(v => /*html*/`<span class="tasks-numbering">${getDayOfWeek(Y, M, v + 1)}</span>`)
        .join('')
    return /*html*/`${labels}<span></span>`
}

function renderWeeks() {
    const saturdays = getSaturdays(Y, M)
    console.log(saturdays)
    const cur = dv.date("today").day
    return saturdays.map(d => /*html*/`<div class="tasks-week-dividers" style="grid-column: ${d} / span 1;"></div>`).join("") + /*html*/`<div class="tasks-day-current" style="grid-column: ${cur} / span 1;"></div>`
}

function renderTasks(tasks) {
    const arr = [...Array(days).keys()].map(f => [/*html*/`<span></span>`])
    tasks
        .forEach(t => {
            const day = t.due_date.day
            if (day < d) return
            arr[day - 1].push(/*html*/`<span style="transform: rotate(300deg)translate(9px, 22px); text-wrap: nowrap; min-width: 100px; max-width: 100px;">${t.file.name}</span>`)
        })
    return arr.map(t => {
        if (t.length > 2)
            return /*html*/`<span style="width: 31px; height: 100px;"><span style="transform: rotate(300deg)translate(9px, 22px); text-wrap: nowrap; min-width: 100px; max-width: 100px;">${t.length - 1} Tasks</span></span>`

        return /*html*/`<span style="width: 31px; height: 100px;">${t.join("")}</span>`
    }).join("") + /*html*/`<span></span>`
}

const TEMPLATE = /*html*/`<div class="tasks-container"><div class="tasks" style="grid-template-columns: repeat(${days}, 1fr) 1.4fr;">${renderTasks(pages)}${renderNumber(days)}${renderLabel(days)}${renderWeeks()}</div></div>`

dv.container.innerHTML = TEMPLATE
dv.container.style.overflowX = "auto"
dv.container.style.display = "flex"