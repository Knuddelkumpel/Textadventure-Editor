import * as Shared from "./shared.js";
import * as Storage from "./storage.js";

export function addSelectElement(parentElment, name){
    var selectElement = document.createElement("select");
    selectElement.setAttribute("type", "text");
    selectElement.setAttribute("class", "form-control");
    selectElement.setAttribute("name", name);
    selectElement.appendChild(Shared.getDefaultOptionElement());

    parentElment.appendChild(selectElement);
    return selectElement;
}

//would need to set event (func) as param
export function addDeleteColElement(parentElement, value = null){
    var col = document.createElement("div");
    col.setAttribute("class", "col col-1");
    addDeleteButtonElement(col, value);
    parentElement.appendChild(col);
}

export function addDeleteButtonElement(parentElement, value = null){
    var deleteButton = document.createElement("button");
    deleteButton.setAttribute("type", "button");
    deleteButton.setAttribute("class", "btn-close");
    deleteButton.setAttribute("value", value);

    parentElement.appendChild(deleteButton);

    return deleteButton;
}

export function addTextarea(parentElement, name, value){
    var textElement = document.createElement("textarea");
    textElement.setAttribute("type", "text");
    textElement.setAttribute("class", "form-control");
    textElement.setAttribute("name", name);
    textElement.setAttribute("rows", 3);
    textElement.textContent = value;

    parentElement.appendChild(textElement);
    return textElement;
}

export function addInput(parentElement, name, value){
    var input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("class", "form-control");
    input.setAttribute("name", name);
    input.setAttribute("value", value);
   
    parentElement.appendChild(input);

    return input;
}

export function addCheckbox(parentElement, name, checked){
    var input = document.createElement("input");
    input.setAttribute("type", "checkbox");
    input.setAttribute("class", "form-check-input");
    input.setAttribute("name", name);
    if(checked)
        input.setAttribute("checked", "checked");
   
    parentElement.appendChild(input);

    return input;
}

export function addHiddenInput(parentElement, name, value){
    var hiddenElement = document.createElement("input");
    hiddenElement.setAttribute("type", "hidden");
    hiddenElement.setAttribute("name", name);
    hiddenElement.setAttribute("value", value);
   
    parentElement.appendChild(hiddenElement);

    return hiddenElement;
}

export function addRow(parentElement, extraClasses = ""){
    var row = document.createElement("div");
    row.setAttribute("class", "row " + extraClasses);
    
    parentElement.appendChild(row);
    return row;
}

export function addCol(parentElement, extraClasses = ""){
    var col = document.createElement("div");
    col.setAttribute("class", "col " +extraClasses);
    
    parentElement.appendChild(col);
    return col;
}
export function addHrElement(parentElement){
    var hr = document.createElement("hr");
    hr.setAttribute("class", "hr");
    
    parentElement.appendChild(hr);
    return hr;
}

export function addNodeIdSelectElement(parentElement, name, selectedId){
    
    Storage.currentGame.nodes.sort((a, b) => {
        let fa = a.name.toLowerCase(),
            fb = b.name.toLowerCase();
        if (fa < fb) return -1;
        if (fa > fb) return 1;
        return 0;
    });

    return addIdSelectElement(parentElement,name,selectedId, Storage.currentGame.nodes);
}

export function addSourceIdSelectElement(parentElement, name, selectedId){
    return addIdSelectElement(parentElement,name,selectedId, Storage.currentGame.sources);
}

export function addActorIdSelectElement(parentElement, name, selectedId){
    return addIdSelectElement(parentElement,name,selectedId, Storage.currentGame.actors);
}

function addIdSelectElement(parentElement, name, selectedId, options){
    var selectElement = addSelectElement(parentElement, name);
    
    options.forEach(option => {
        var optionElement = document.createElement("option");
        optionElement.setAttribute("value", option.id);        
        optionElement.textContent = option.name;
        if(selectedId == option.id)
            optionElement.setAttribute("selected","selected");
        selectElement.appendChild(optionElement);
    });

    return selectElement;
}