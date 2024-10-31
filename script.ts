type Recipes = { [key: number]: [number, number] }
type ItemIDs = { [key: string]: number }

async function init(): Promise<[Recipes, string[], ItemIDs]> {
    let recipes: { [key: number]: [number, number] } = {}
    let promise1 = fetch("data/best recipes.txt").then(
        response => response.text()
    ).then(
        text => {
            for (let line of text.split("\n")) {
                let [a, b, result] = line.split(",").map(x => parseInt(x))
                recipes[result] = [a, b]
            }
        }
    )

    let item_names: string[] = await fetch("data/combined items.txt").then(
        response => response.text()
    ).then(
        text => text.split("\n")
    )

    let item_ids: { [key: string]: number } = {}
    item_names.forEach(
        (v, i) => item_ids[v] = i
    )

    await promise1
    return [recipes, item_names, item_ids]
}

function calculate() {
    let test: string[] = []
    let dropdown: HTMLInputElement = (<HTMLInputElement>document.getElementById("item-choice"))
    test.push(dropdown.value)

    let toCraft: number[] = []
    let crafted: Set<number> = new Set(["Earth", "Air", "Water", "Time", "Life", "Fire"].map(x => item_ids[x]))
    let path: string[] = []

    toCraft = test.map(x => item_ids[x])

    let item: number | undefined = toCraft.shift()
    while (item != undefined) {
        let [a, b] = recipes[item]
        path.push(`${item_names[a]} + ${item_names[b]} = ${item_names[item]}`)
        crafted.add(item)

        if (!crafted.has(a) && !toCraft.includes(a)) {
            toCraft.push(a)
        }
        if (!crafted.has(b) && !toCraft.includes(b)) {
            toCraft.push(b)
        }
        item = toCraft.shift()
    }

    document.getElementById("recipe-display").textContent = path.reverse().join("\n")
}

let recipes: Recipes
let item_names: string[]
let item_ids: ItemIDs

init().then(
    args => {
        [recipes, item_names, item_ids] = args
        
        let itemList = document.getElementById("items")
        for (let name of item_names.toSorted()) {
            let option = document.createElement("option")
            option.value = name
            itemList.appendChild(option)
        }
    }
)