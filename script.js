async function init() {
    let recipes = {};
    let promise1 = fetch("data/best recipes.txt").then(response => response.text()).then(text => {
        for (let line of text.split("\n")) {
            let [a, b, result] = line.split(",").map(x => parseInt(x));
            recipes[result] = [a, b];
        }
    });
    let item_names = await fetch("data/combined items.txt").then(response => response.text()).then(text => text.split("\n"));
    let item_ids = {};
    item_names.forEach((v, i) => item_ids[v] = i);
    await promise1;
    return [recipes, item_names, item_ids];
}
function calculate() {
    let test = [];
    let dropdown = document.getElementById("item-choice");
    test.push(dropdown.value);
    let toCraft = [];
    let crafted = new Set(["Earth", "Air", "Water", "Time", "Life", "Fire"].map(x => item_ids[x]));
    let path = [];
    toCraft = test.map(x => item_ids[x]);
    let item = toCraft.shift();
    while (item != undefined) {
        let [a, b] = recipes[item];
        path.push(`${item_names[a]} + ${item_names[b]} = ${item_names[item]}`);
        crafted.add(item);
        if (!crafted.has(a) && !toCraft.includes(a)) {
            toCraft.push(a);
        }
        if (!crafted.has(b) && !toCraft.includes(b)) {
            toCraft.push(b);
        }
        item = toCraft.shift();
    }
    document.getElementById("recipe-display").textContent = path.reverse().join("\n");
}
let recipes;
let item_names;
let item_ids;
init().then(args => {
    [recipes, item_names, item_ids] = args;
    let itemList = document.getElementById("items");
    for (let name of item_names.toSorted()) {
        let option = document.createElement("option");
        option.value = name;
        itemList.appendChild(option);
    }
});
