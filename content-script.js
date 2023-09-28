const input = document.getElementById('box-input')
const form = document.getElementById('log')
const addBtn = document.getElementById('add')
const list = document.getElementById('list')
let getChrome = []

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

form.addEventListener('submit', (e) => {
    e.preventDefault();
    settingInfoFromInput(getChrome)
    setItem(input.value)
    input.value = ''
})

function settingInfoFromInput(items) {
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
}
function appendList(element) {
    list.innerHTML += `
    <li id="itemList" data-value="${element}">
        <p id="message">${element !== undefined ? element : void (0)}</p>
        <button type="button" id="removeBtn" class="material-symbols-outlined">close</button>
    </li>`
    const removeBtn = document.querySelectorAll('#removeBtn')
    const itemsList = document.querySelectorAll('#itemList')
    removeBtn.forEach((el, index) => el.addEventListener('click', () => {
        let spliced = sliceItems(index)
        removeLi(spliced, itemsList, getChrome)
        settingInfoFromInput(getChrome, input)
    }))
    itemsList.forEach((el, index) => el.addEventListener('click', changeTags(el, index)))
}

function changeTags(el, index) {
    return (e) => {
        if(e.target.tagName === 'P'){
            let newElement = document.createElement('input')
            newElement.setAttribute('type', 'text')
            newElement.value = el.firstElementChild.textContent
            newElement.className = 'inputList'
            el.replaceChild(newElement, el.firstElementChild)
            newElement.focus()
            newElement.addEventListener('keydown', inputToParag(newElement))
        }
    }

    function inputToParag(newElement) {
        return (e) => {
            if(e.keyCode === 13 || e.key === 'Enter'){
                let backToPTag = document.createElement('p')
                backToPTag.id = "message"
                backToPTag.innerHTML = e.target.value
                getChrome[index] = e.target.value
                settingInfoFromInput(getChrome)
                el.replaceChild(backToPTag, newElement)
            }
        }
    }
}

function sliceItems(el) {
    let spliced = getChrome.splice(el, 1)
    return spliced
}

function removeLi(value, itemsList, Array) {
    itemsList.forEach((e, index) => e.value === value ? Array.splice(index, 1) : void (0))
    list.innerHTML = ''
    setItem(Array)
}

