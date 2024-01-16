const page = input
const name = page.file.name

const references = page.references ? page.references : []
const similar = page.similar_ideas ? page.similar_ideas : []
const opposite = page.opposite_ideas ? page.opposite_ideas : []
const come = page.comes_from ? page.comes_from : []
const lead = page.leads_to ? page.leads_to : []

const width = 800
const height = 250
const centroid = {
	x: width/2,
	y: height/2,
}

const opposite_height = 45 * opposite.length
const similar_height = 45 * similar.length

const come_width = 155 * come.length
const lead_width = 155 * lead.length

function cleanLink(l) {
	return /\|(.*)\]\]$/.exec(l)[1]
}

function pathTo(start, end, hor = true) {
	const sx = hor ? start.x + 75 : start.x
	const sy = hor ? start.y : start.y + 20
	const ex = hor ? end.x - 75 : end.x
	const ey = hor ? end.y : end.y - 20
	return `<path fill="none" stroke="white" strokeWidth="2" d="M${sx},${sy} L${ex},${ey}" />`
}

function rectText(text, color = "#aaaaaa", x = 0, y = 0) {
	return `<g transform="translate(${x}, ${y})"><rect width="150" height="40" fill="${color}" stroke="white" strokeWidth="1" style="opacity: 0.25;" rx="5"/>
		<text dominant-baseline="middle" text-anchor="middle" x="75" y="25">${text}</text></g>`
}

const TEMPLATE = `<svg width="100%" height="250px" viewBox="0 0 800 250" style="fill: white;">
	<g id="opposite-ideas" transform="translate(0, ${centroid.y - opposite_height/2})">
		${opposite.map((v, i) => rectText(cleanLink(v), "#ffaaaa", 0, i * 45)).join("")}
	</g>
	<g id="comes-from" transform="translate(${centroid.x - come_width/2}, 0)">
		${come.map((v, i) => rectText(cleanLink(v), "#aaaaaa", i * 155)).join("")}
	</g>
	<g id="note" transform="translate(${centroid.x - 150/2}, ${centroid.y - 40/2})">
		${rectText(name)}
	</g>
	<g id="leads-to" transform="translate(${centroid.x - lead_width/2}, 210)">
		${lead.map((v, i) => rectText(cleanLink(v), "#aaaaaa", i * 155)).join("")}
	</g>
	<g id="similar-ideas" transform="translate(650, ${centroid.y - similar_height/2})">
		${similar.map((v, i) => rectText(cleanLink(v), "#aaffaa", 0, i * 45)).join("")}
	</g>
	<g id="paths">
		${opposite.map((_, i) => pathTo({ x: 75, y: i * 45 + 20 + centroid.y - opposite_height/2 }, { x: centroid.x, y: centroid.y })).join("")}
		${similar.map((_, i) => pathTo({ x: centroid.x, y: centroid.y }, { x: 75 + 650, y: i * 45 + 20 + centroid.y - similar_height/2 })).join("")}
		${come.map((_, i) => pathTo({ x: 75 + i * 155 + centroid.x - come_width/2, y: 20 }, { x: centroid.x, y: centroid.y }, false)).join("")}
		${lead.map((_, i) => pathTo({ x: centroid.x, y: centroid.y }, { x: 75 + i * 155 + centroid.x - lead_width/2, y: 20 + 210 }, false)).join("")}
	</g>
</svg>`

dv.paragraph(TEMPLATE)