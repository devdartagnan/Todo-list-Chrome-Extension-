const input = document.getElementById('box-input')
const addBtn = document.getElementById('add')
const list = document.getElementById('list')
let getChrome = []

// 1 - receber data do chrome.storage
// 2 - receber informação de input 
// 3 - passar informação do input para HTML
// 4 - passar informação do input para o chrome.storage
// 5 - botão de remover, removendo item da lista chrome.storage e remover item da lista HTML

chrome.storage.local.get({ 'todo': [] }, data => {
    if (data.todo) {
        if (data.todo instanceof Array) {
            getChrome = data.todo
        } else {
            getChrome.push(data.todo)
        }
        setItem(data.todo);
    }
})

input.addEventListener('keypress', (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        settingInfoFromInput(getChrome, input)
        setItem(input.value)
        input.value = ''
    }
})
addBtn.addEventListener('click', (e) => {
    settingInfoFromInput(getChrome, input)
    setItem(input.value)
    input.value = ''
})

function settingInfoFromInput(items, input) {
    const inputValue = input.value
    inputValue === "" ? void (0) : items.push(inputValue)
    chrome.storage.local.set({ todo: items }, () => {
        console.log("Value is set")
    })
}


function setItem(element) {
    if (element instanceof Array) {
        element.forEach(item => {
            appendList(item)
        })
    } else if (typeof element == "string") {
        appendList(element)
    } else {
        console.error('Unable to load')
    }
    // const messageBtn = document.querySelectorAll('#message')


    // messageBtn.forEach(el =>
    //     console.log(el))
}
function appendList(element) {
    list.innerHTML += `
            <li id="itemList" data-value="${element}">
            <p id="message">${element !== undefined ? element : void (0)}</p>
            <button type="button" id="removeBtn" class="material-symbols-outlined">close</button>
            </li>
            `
    const removeBtn = document.querySelectorAll('#removeBtn')
    const itemsList = document.querySelectorAll('#itemList')
    removeBtn.forEach(el => el.addEventListener('click', () => {
        const valuedIndex = getChrome.indexOf(el.parentElement.dataset.value)
        let spliced = getChrome.splice(valuedIndex, 1);
        removeLi(spliced, itemsList, getChrome)
        settingInfoFromInput(getChrome, input)

    }))
}
function removeLi(value, itemsList, Array) {
    itemsList.forEach((e, index) => e.value === value ? Array.splice(index, 1) : void (0))
    list.innerHTML = ''
    setItem(Array)
}
// chrome.storage.local.clear()x'
