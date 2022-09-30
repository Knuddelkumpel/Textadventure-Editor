import {Source} from "./shared/dataClasses.js";
import * as Shared from "./shared/shared.js";
import * as Storage from "./shared/storage.js";
import * as HtmlElements from "./shared/htmlElements.js";

function setup(){
}

function onAddEditPanelSource(e){
    addEditPanelSourceElement(new Source());
}

function submit(formData){
    formData.sources?.forEach(formSource => {
        if(formSource != null)
            formSource.id = Storage.getOrAddSource(formSource.id).id;
    });
    var sources = formData.sources?.flat();
    Storage.currentGame.sources = sources ? sources : [];
}

function setForm(form) {
    Shared.clearElement(form);
    
    var conditionContainer = addEditPanelSourceContainer(form);
    Storage.currentGame.sources?.forEach(source => {
        addEditPanelSourceElement(source);
    });
}
function onRemoveEditPanelSource(e){
    e.target.closest(".row").innerHTML = "";
}

function addEditPanelSourceContainer(parentElement){
    var headerRow = HtmlElements.addRow(parentElement);
    var col1 = HtmlElements.addCol(headerRow);
    var col2 = HtmlElements.addCol(headerRow, "col-1");
    
    var conditionContainer = document.createElement("div");
    conditionContainer.setAttribute("id", "editSourceContainer");
    parentElement.appendChild(conditionContainer);

    var label = document.createElement("h2");
    label.textContent = "Sources";
    col1.appendChild(label);

    var button = document.createElement("button");
    button.setAttribute("type", "button");
    button.setAttribute("class", "btn btn-secondary");
    button.textContent = "+";
    button.addEventListener("click", onAddEditPanelSource);
    col2.appendChild(button);

    
}
  
function addEditPanelSourceElement(source){
    var container = document.getElementById("editSourceContainer");
    var index = container.childElementCount;
    var name = 'sources['+index+']';

    var row = HtmlElements.addRow(container);
    var col1 = HtmlElements.addCol(row);
    var col2 = HtmlElements.addCol(row);
    var col3 = HtmlElements.addCol(row);
    var col4 = HtmlElements.addCol(row, "col-1");

    HtmlElements.addHiddenInput(col1, name +  ".id", source.id);

    var deleteButton = HtmlElements.addDeleteButtonElement(col4);
    deleteButton.addEventListener("click", onRemoveEditPanelSource);

    var row = HtmlElements.addRow(container);
    var col1 = HtmlElements.addCol(row);
    var col2 = HtmlElements.addCol(row);
    col1.textContent = "Internal name";
    HtmlElements.addInput(col2, name +".name", source.name);

    row = HtmlElements.addRow(container);
    col1 = HtmlElements.addCol(row);
    col2 = HtmlElements.addCol(row);
    col1.textContent = "Type";
    HtmlElements.addInput(col2, name +".type", source.type);

    row = HtmlElements.addRow(container);
    col1 = HtmlElements.addCol(row);
    col2 = HtmlElements.addCol(row);
    col1.textContent = "Author";
    HtmlElements.addInput(col2, name +".author", source.author);

    row = HtmlElements.addRow(container);
    col1 = HtmlElements.addCol(row);
    col2 = HtmlElements.addCol(row);
    col1.textContent = "Title";
    HtmlElements.addInput(col2, name +".title", source.title);

    row = HtmlElements.addRow(container);
    col1 = HtmlElements.addCol(row);
    col2 = HtmlElements.addCol(row);
    col1.textContent = "Publisher";
    HtmlElements.addInput(col2, name +".publisher", source.publisher);

    row = HtmlElements.addRow(container);
    col1 = HtmlElements.addCol(row);
    col2 = HtmlElements.addCol(row);
    col1.textContent = "Published in";
    HtmlElements.addInput(col2, name +".in", source.in);

    row = HtmlElements.addRow(container);
    col1 = HtmlElements.addCol(row);
    col2 = HtmlElements.addCol(row);
    col1.textContent = "Publication date";
    HtmlElements.addInput(col2, name +".publicationDate", source.publicationDate);

    row = HtmlElements.addRow(container);
    col1 = HtmlElements.addCol(row);
    col2 = HtmlElements.addCol(row);
    col1.textContent = "Access date";
    HtmlElements.addInput(col2, name +".accessDate", source.accessDate);

    row = HtmlElements.addRow(container);
    col1 = HtmlElements.addCol(row);
    col2 = HtmlElements.addCol(row);
    col1.textContent = "Link";
    HtmlElements.addInput(col2, name +".link", source.link);

    row = HtmlElements.addRow(container);
    col1 = HtmlElements.addCol(row);
    col2 = HtmlElements.addCol(row);
    col1.textContent = "DOI";
    HtmlElements.addInput(col2, name +".doi", source.doi);

    row = HtmlElements.addRow(container);
    col1 = HtmlElements.addCol(row);
    col2 = HtmlElements.addCol(row);
    col1.textContent = "ISBN";
    HtmlElements.addInput(col2, name +".isbn", source.isbn);
    
    row = HtmlElements.addRow(container);
    col1 = HtmlElements.addCol(row);
    col2 = HtmlElements.addCol(row);
    col1.textContent = "Citation number";
    HtmlElements.addInput(col2, name +".number", source.number);
    
    HtmlElements.addHrElement(row);  
}

export {setup, submit, setForm};