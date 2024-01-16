const monthMap = {
    "Jan": 1,
    "Feb": 2,
    "Mar": 3,
    "Apr": 4,
    "May": 5,
    "Jun": 6,
    "Jul": 7,
    "Aug": 8,
    "Sep": 9,
    "Oct": 10,
    "Nov": 11,
    "Dec": 12,
}

const birthday_icon = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns" width="16" height="16" viewBox="0 0 32 32" version="1.1">
                <g class="icon-fill" id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage">
                    <g id="Icon-Set-Filled" sketch:type="MSLayerGroup" transform="translate(-102.000000, -777.000000)" fill="#000000">
                        <path class="icon-fill" d="M119,797 L130,797 L130,799 L119,799 L119,807 L117,807 L117,799 L106,799 L106,797 L117,797 L117,789 L104,789 L104,805 C104,807.209 105.791,809 108,809 L128,809 C130.209,809 132,807.209 132,805 L132,789 L119,789 L119,797 L119,797 Z M121,783 C119.896,783 119,782.104 119,781 C119,779.896 119.896,779 121,779 C122.104,779 123,779.896 123,781 C123,782.104 122.104,783 121,783 L121,783 Z M115,783 C113.896,783 113,782.104 113,781 C113,779.896 113.896,779 115,779 C116.104,779 117,779.896 117,781 C117,782.104 116.104,783 115,783 L115,783 Z M132,783 L124.445,783 C124.789,782.41 125,781.732 125,781 C125,778.791 123.209,777 121,777 C119.798,777 118.733,777.541 118,778.38 C117.267,777.541 116.202,777 115,777 C112.791,777 111,778.791 111,781 C111,781.732 111.211,782.41 111.555,783 L104,783 C102.896,783 102,783.896 102,785 L102,787 L134,787 L134,785 C134,783.896 133.104,783 132,783 L132,783 Z" id="present" sketch:type="MSShapeGroup" />
                    </g>
                </g></svg>`

const year = input.year
const month = input.month
const habit_events = input.habit_events
const birthdays = input.birthday_pages
    .filter(p => p.birthday && dv.date(p.birthday).get("month") === month)
    .map(p => {
        const day = dv.date(p.birthday).get("day")
        return {
            day: day,
            person: p.file.name,
        }
    })
    .array()

const event_pages = input.event_pages
    .filter(p => {
        const folder = p.file.folder.split('/')
        const p_year = Number(folder[folder.length - 2])
        const p_month = folder[folder.length - 1]
        return year === p_year && monthMap[p_month] === month
    })
    .map(p => {
        const day = Number(p.file.name.replace(/\s-.*/, ""))
        return {
            day: day,
            events: habit_events.filter(h => p[h.event]).map(h => h.icon).join("")
        }
    })

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const firstDay = new Date(year, month - 1, 1)
const lastDay = new Date(year, month, 0)
const numDays = lastDay.getDate()
const startingDay = firstDay.getDay()

const currentDay = new Date()

const headerRow = daysOfWeek.map(day => /*html*/`<div class="header-cell"><span class="header-cell-number">${day}</span></div>`)
    .join('')

const daysArray = Array.from({ length: numDays + 1 }, (_, index) => index)
    .map(day => (day <= startingDay - 1 || day > numDays) ? '' : { day: day, events: event_pages.filter(p => p.day === day).map(p => p.events).join("") + /*html*/`<br>${birthdays.filter(p => p.day === day).length > 0 ? /*html*/`<span title="${birthdays.filter(p => p.day === day).map(p => p.person).join(", ")}">${birthday_icon}</span>` : ''}` })
    .map(content => /*html*/`<div class="day-cell${content === '' ? ' empty-cell' : ''}${content.day && content.day === currentDay.getDate() ? ' current-day' : ''}${content.day && content.day < currentDay.getDate() ? ' past-day' : ''}"><div class="header-cell-number">${content.day ? content.day : ''}</div><div>${content.events ? content.events : ''}</div></div>`)
    .join('')

dv.container.innerHTML = /*html*/`<div class="calendar-container">${headerRow}${daysArray}</div>`