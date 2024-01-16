const CharacterStatBlockClass = `
	min-width: 200px;
	max-width: 200px;
`
const STAT = ["Strength", "Dexterity", "Constitution", "Intelligence", "Wisdom", "Charisma"]
const STAT_IND = ["STR", "DEX", "CON", "INT", "WIS", "CHA"]
const PASSIVES = {
    "INT": ["Investigation"],
    "WIS": ["Perception", "Insight"],
}

const SKILLS = [
    ["Athletics"],
    ["Acrobatics", "Sleight of Hand", "Stealth"],
    [],
    ["Arcana", "History", "Investigation", "Nature", "Religion"],
    ["Animal Handling", "Insight", "Medicine", "Perception", "Survival"],
    ["Deception", "Intimidation", "Performance", "Persuasion"],
]

function genArray(n) {
    return [...Array(n).keys()]
}

function renderSkill(mod, skill) {
    const isProf = input.prof_skills.contains(skill)
    const newMod = isProf ? mod + Number(input.prof_bonus) : mod
    const pos = newMod >= 0 ? "+" : ""
    const pre = isProf ? "⚫" : "⚪"

    return /*html*/`
		<span style="display: block;font-size: 0.8em; margin: 0 -5px">
			<span style="margin-right: 3px;" class="dnd-light">${pre}</span> <span style="margin-right: 3px;">${pos}${newMod}</span> <small class="dnd-light" style="margin-right: 3px;">${skill}</small>
		</span>
	`
}

function renderStat(val, ind) {
    const isProf = input.main_stats.contains(STAT[ind])
    const mod = Math.floor((val - 10) / 2)
    const newMod = mod + (isProf ? Number(input.prof_bonus) : 0)
    const pos = mod >= 0 ? "+" : ""
    const pre = isProf ? "⚫" : "⚪"
    const passive = ["WIS", "INT"].contains(STAT_IND[ind]) ? STAT_IND[ind] : null
    const passive_cont = passive ? /*html*/`<small><span class="dnd-light">(Passive)</span> ${mod + 10}</small><br><small class="dnd-light">${PASSIVES[passive].join(", ")}</small>` : ""
    return /*html*/`
		<div class="dnd-card" style="${CharacterStatBlockClass}">
			<div style="text-align: center;">
				<h6 style="padding-top: 0;margin-top: 0;margin-bottom: 4px; border-bottom: 1px solid rgba(255, 255, 255, 0.2);">${STAT[ind]}</h6>
			</div>
			<div style="display: flex; flex-direction: row;">
                <span style="padding: 3px; padding-right: 10px;">
                    <b>${val}</b><br><small>${pos}${mod}</small>
                </span>
                <span style="text-align: left; padding: 3px; padding-left: 24px; border-left: 1px solid rgba(255, 255, 255, 0.1);">
				    ${SKILLS[ind].map(skill => renderSkill(mod, skill)).join("")}
                </span>
			</div>
            <div style="padding-top: 5px; border-top: 1px solid rgba(255, 255, 255, 0.2); text-align: center;">
                <small class="dnd-light" style="margin-right: 6px;">Saving Throw</small>
                <span><span style="margin-right: 3px;" class="dnd-light">${pre}</span> ${pos}${newMod}</span>
            </div>
            ${passive_cont}
		</div>
	`
}

const TEMPLATE = /*html*/`
<div class="dnd-container">
    <div class="dnd-skills">${input.stats.map((stat, ind) => renderStat(stat, ind)).join('')}</div>
    <div class="dnd-health">
        <div>
            <span class="dnd-card">
                <span>${input.ac}</span>
                <span class="dnd-light" style="margin-bottom: -10px; line-height: 5px;"><span style="display: block; padding-top: 10px;">Armour</span><span>Class</span></span>
            </span>
            <span class="dnd-card">
                <span>${input.initiative >= 0 ? "+" : ""}${input.initiative}</span>
                <span class="dnd-light">Initiative</span>
            </span>
            <span class="dnd-card">
                <span>${input.speed}</span>
                <span class="dnd-light">Speed</span>
            </span>
        </div>
        <div class="dnd-card">
            <span>${input.temp_hp < input.hp ? input.temp_hp + " / " : ""}${input.hp}</span>
            <span class="dnd-light">Hit Points</span>
        </div>
        <div class="dnd-card" style="margin-top: 0.5em; display: flex; flex-direction: column;">
            <div style="width: 100%;display: flex;justify-content: flex-end;"><span style="margin-right: 6px;" class="dnd-light">Successes</span>${genArray(input.death_saves_success).map(() => "⚫").join(" ")} ${genArray(3 - input.death_saves_success).map(() => "⚪").join(" ")}</div>
            <div style="width: 100%;display: flex;justify-content: flex-end;"><span style="margin-right: 6px;" class="dnd-light">Fails</span>${genArray(input.death_saves_fails).map(() => "⚫").join(" ")} ${genArray(3 - input.death_saves_fails).map(() => "⚪").join(" ")}</div>
            <div class="dnd-light">Death Saves</div>
        </div>
        <div class="dnd-card" style="margin-top: 0.5em; display: flex; flex-direction: column;">
            <div>${new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(input.money)}</div>
        </div>
    </div>
</div>
`

dv.el('div', TEMPLATE)