function daysInMonth(y, m) {
    const isLeapYear = (y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0)

    const daysInMonthMap = [
        31, (isLeapYear ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31
    ]

    return daysInMonthMap[m - 1]
}

function getDayOfWeek(year, month, day) {
    month--;

    const specifiedDay = new Date(year, month, day);

    const dayOfWeek = specifiedDay.getDay();

    const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];

    return daysOfWeek[dayOfWeek];
}

function getSaturdays(year, month) {
    month--;

    const saturdays = [];

    for (let day = 1; day <= new Date(year, month + 1, 0).getDate(); day++) {
        const currentDay = new Date(year, month, day);

        if (currentDay.getDay() === 6) {
            saturdays.push(day);
        }
    }

    return saturdays;
}

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

    return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
    };
}

function describeArc(endAngle) {

    const x = 8
    const y = 8
    const startAngle = 0
    const radius = 7

    endAngle = endAngle % 360

    var start = polarToCartesian(x, y, radius, endAngle);
    var end = polarToCartesian(x, y, radius, startAngle);

    var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    var d = [
        "M", start.x, start.y,
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");

    return d;
}

function castHabit(v) {
    if (v === null)
        return 0

    if (typeof v === "undefined")
        return 0

    if (typeof v === "boolean")
        return v ? 1 : 0

    return v
}

const MON = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
]

const HABITS = input.habits

const Y = input.date.year
const M = input.date.month
const d = input.date.day
const m = MON[M - 1]

const days = daysInMonth(Y, M)

const pages = dv.pages(`"${input.path}"`).filter(f => (new RegExp(`${Y}/${m}`)).test(f.file.folder))

function renderHabit(habit, data) {

    const percentage = data.percentage_total ? (v) => v / data.percentage_total : () => 1
    const tooltip = data.tooltip ? data.tooltip : () => ""

    const dots = [...Array(days).keys()]
        .map(day => day + 1 > d ? /*html*/`<span><svg viewBox="0 0 18 18" width="31" height="16"><circle style="opacity: 0.25;" cx="8" cy="8" r="7" fill="none" stroke="var(--color-base-60)" strokeWidth="1" /></svg></span>` : /*html*/`<span></span>`)

    pages.forEach(page => {
        const value = habit === "_page_" ? 1 : castHabit(page[habit])
        const day = Number(page.file.name.replace(/\s-.*/, "")) - 1


        dots[day] = value === 0 ? /*html*/`<span></span>` : /*html*/`<span title="${tooltip(value)}"><svg viewBox="0 0 18 18" width="31" height="16">
            ${percentage(value) == 1 ? /*html*/`<circle cx="8" cy="8" r="7" fill="none" stroke="var(--color-base-60)" strokeWidth="1" />` : /*html*/`<path stroke="var(--color-base-60)" fill="none" d="${describeArc(percentage(value) * 360)}" />`
            }
            ${percentage(value) >= 1 ? /*html*/`<circle style="opacity: 0.25;" cx="8" cy="8" r="5" fill="var(--color-base-60)" />` : ""}
        </svg></span>`
    })

    return /*html*/`<small class="habits-label">${data.label}</small>${dots.join("")}`
}

function renderNumber(n) {
    const numbers = [...Array(n).keys()]
        .map(v => /*html*/`<span class="habits-numbering">${v + 1}</span>`)
        .join('')
    return /*html*/`<span></span>${numbers}`
}

function renderLabel(n) {
    const labels = [...Array(n).keys()]
        .map(v => /*html*/`<span class="habits-numbering">${getDayOfWeek(Y, M, v + 1)}</span>`)
        .join('')
    return /*html*/`<span></span>${labels}`
}

function renderWeeks() {
    const saturdays = getSaturdays(Y, M)
    const cur = dv.date("today").day + 1
    return saturdays.map(d => /*html*/`<div class="habits-week-dividers" style="grid-column: ${d + 1} / span 1;"></div>`).join("") + /*html*/`<div class="habits-day-current" style="grid-column: ${cur} / span 1;"></div>`
}

const TEMPLATE = /*html*/`<div class="habits-container"><div class="habits" style="grid-template-columns: 2.5fr repeat(${days}, 1fr);">${Object.entries(HABITS).map(v => renderHabit(v[0], v[1])).join("")}${renderNumber(days)}${renderLabel(days)}${renderWeeks()}</div></div>`

dv.container.innerHTML = TEMPLATE
dv.container.style.overflowX = "auto"
dv.container.style.display = "flex"