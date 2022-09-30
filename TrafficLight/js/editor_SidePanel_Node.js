import {Prompt, Option, Place, NodePlace, PlaceImage} from "./shared/dataClasses.js";
import * as Shared from "./shared/shared.js";
import * as Storage from "./shared/storage.js";
import * as Draw from "./editor_draw.js";
import * as Nodes from "./editor_nodes.js";
import * as HtmlElements from "./shared/htmlElements.js";



function setup(){
    const editPanelAddPromptBtn  = document.getElementById('editPanelAddPromptBtn');
    editPanelAddPromptBtn.addEventListener('click', onAddEditPanelPrompt);
    const editPanelAddOptionBtn  = document.getElementById('editPanelAddOptionBtn');
    editPanelAddOptionBtn.addEventListener('click', onAddEditPanelOption);
    const editPanelAddPlaceBtn  = document.getElementById('editPanelAddPlaceBtn');
    editPanelAddPlaceBtn.addEventListener('click', onAddEditPanelPlace);
}

function onAddEditPanelPrompt(e){
    addEditPanelPromptElement(new Prompt());
}
function onAddEditPanelPromptTextLink(e){
    var index = e.target.value;
    var element = document.querySelector("#editPrompt"+ index +" .editPromptIntextLinks");
    var promptId = document.querySelector("#editPrompt"+ index +" input[name='prompts["+ index +"].id']").value;
    
    addPromptTextLinkInputRow(element, promptId, index, -1)
}

function onAddEditPanelOption(e){
    addEditPanelOptionElement(new Option());
}

function onAddEditPanelPlace(e){
    addEditPanelUnlockPlaceElement(new NodePlace());
}

function submit(formData){
    var node = Storage.findNodeById(formData.id);

    formData.options?.forEach(formOption => {
        if(formOption != null)
            formOption.id = Storage.getOrAddOption(node, formOption.id).id;
            formOption.nodeId = (formOption.nodeId > 0) ? formOption.nodeId : null
            formOption.isAutoOption = formOption.isAutoOption ? true : false;
            formOption.preventNodePrompts = formOption.preventNodePrompts ? true : false;
    });
    node.options = formData.options ? formData.options.flat() : [];

    formData.prompts?.forEach(formPrompt => {
        if(formPrompt != null)
            formPrompt.id = Storage.getOrAddPrompt(node, formPrompt.id).id;
            formPrompt.textlinkNodeIds = formPrompt.textlinkNodeIds ? formPrompt.textlinkNodeIds.flat() : []; //check for -1?
            formPrompt.isDirectQuote = formPrompt.isDirectQuote ? true : false;
            formPrompt.isTranslated = formPrompt.isTranslated ? true : false;
            formPrompt.isParaphrased = formPrompt.isParaphrased ? true : false;
    });
    node.prompts = formData.prompts ? formData.prompts.flat() : [];
    node.unlockPlaces = formData.unlockPlaces ? formData.unlockPlaces.flat() : [];

    node.name = formData.name;

    if(formData.nodePlace){
        formData.nodePlace.imageId = (formData.nodePlace.imageId != -1) ? formData.nodePlace.imageId : null
        formData.nodePlace.placeId = (formData.nodePlace.placeId != -1) ? formData.nodePlace.placeId : null
    }
    node.nodePlace = formData.nodePlace;

    Nodes.createOrUpdateNodeContent(node);
    Draw.drawLinesForNode(node);
}

function setForm(nodeid) {
    var node = Storage.findNodeById(nodeid);
    document.getElementById('editName').value = node.name;
    document.getElementById('editId').value = node.id;
    //document.getElementById('editX').value = node.coordinates.x;
    //document.getElementById('editY').value = node.coordinates.y;

    Shared.clearElementById("editPromptContainer");
    Shared.clearElementById("editOptionContainer");
    Shared.clearElementById("editPlaceContainer");
    Shared.clearElementById("editUnlockPlaceContainer");

    if (node.prompts?.length > 0) {
        node.prompts.forEach(prompt => {
            addEditPanelPromptElement(prompt);
        });
    } 
    
    if (node.options?.length > 0) {
        node.options.forEach(node => {
            addEditPanelOptionElement(node);
        });
    }
    
    addEditPanelPlaceElement(node.nodePlace);

    if (node.unlockPlaces?.length > 0) {
        node.unlockPlaces.forEach(unlockPlace => {
            addEditPanelUnlockPlaceElement(unlockPlace);
        });
    }
}

function onRemoveEditPanelPrompt(e){
    e.target.closest(".row").parentNode.innerHTML = "";
}
function onRemoveEditPanelPromptIntextLink(e){
    var promptId = e.target.value;
    Draw.deleteLineForPrompt(promptId); //deletsFirst only
    e.target.closest(".row").innerHTML = "";
}
function onRemoveEditPanelOption(e){
    var optionId = e.target.value;
    Draw.deleteLineForOption(optionId);
    e.target.closest(".row").innerHTML = "";
}  
function onRemoveEditPanelPlace(e){
    e.target.closest(".row").innerHTML = "";
}

function onImageSelection(e){
    
    var imageId = e.target.value;
    var image = Storage.findImageByPath(imageId);
    
    var imageSelectElement = e.target;
    var placeSelectElement = imageSelectElement.parentNode.nextSibling.querySelector("select");

    Shared.clearElement(placeSelectElement);
    addPlaceSelectOptions(placeSelectElement, image);
}

function addEditPanelPromptElement(prompt){
    var container = document.getElementById("editPromptContainer");
    var index = container.childElementCount;

    var div = document.createElement("div");
    container.appendChild(div);
    div.setAttribute("id", "editPrompt"+ index +"")

    addHiddenInput(div, 'prompts['+index+'].id', prompt.id);
    addPromptContentInputs(div, prompt, index);
    addPromptTextLinkInputs(div, prompt, index);
    addPromptSourceInputs(div, prompt, index);
    addHrElement(div);
}

function addPromptContentInputs(parentElement, prompt, index){
    var row = addRow(parentElement);
    var col1 = addCol(row);
    var col2 = addCol(row);
    var col3 = addCol(row, "col-1");

    var actorIdSelectElement = addSelectElement(col1, 'prompts['+index+'].actorId');
    Storage.currentGame.actors.forEach(actor => {
        var actorIdOptionElement = document.createElement("option");
        actorIdOptionElement.setAttribute("value", actor.id);        
        actorIdOptionElement.textContent = actor.name;
        if(prompt.actorId == actor.id)
            actorIdOptionElement.setAttribute("selected","selected");
        actorIdSelectElement.appendChild(actorIdOptionElement);
    });

    addTextarea(col2, 'prompts['+index+'].text', prompt.text);

    var deleteButton = addDeleteButtonElement(col3)
    deleteButton.addEventListener("click", onRemoveEditPanelPrompt)
}

function addPromptTextLinkInputs(parentElement, prompt, promptIndex){

    var row = addRow(parentElement);
    var col1 = addCol(row);
    var col2 = addCol(row, "col-1");
    var col3 = addCol(row, "col-1");
    
    var label = document.createElement("span");
    label.textContent = "Intext links";
    col1.appendChild(label);

    var button = document.createElement("button");
    button.setAttribute("type", "button");
    button.setAttribute("class", "btn btn-secondary");
    button.setAttribute("value", promptIndex);
    button.textContent = "+";
    button.addEventListener("click", onAddEditPanelPromptTextLink);
    col2.appendChild(button);

    var div = document.createElement("div");
    div.setAttribute("class", "editPromptIntextLinks")
    parentElement.appendChild(div)

    prompt.textlinkNodeIds?.forEach(nodeId => {
        addPromptTextLinkInputRow(div, prompt.id, promptIndex, nodeId);
    });
}

function addPromptSourceInputs(parentElement, prompt, index){
    var name = 'prompts['+index+']';

    var row = addRow(parentElement);
    var col1 = addCol(row);
    var col2 = addCol(row);
    var col3 = addCol(row);
    var col4 = addCol(row);
    var col5 = addCol(row);

    col1.textContent = "Source";
    col2.textContent = "Details";
    col3.textContent = "Quote";
    col4.textContent = "Translated";
    col5.textContent = "Paraphrase";

    var row = addRow(parentElement);
    var col1 = addCol(row);
    var col2 = addCol(row);
    var col3 = addCol(row);
    var col4 = addCol(row);
    var col5 = addCol(row);

    HtmlElements.addSourceIdSelectElement(col1, name + ".sourceId", prompt.sourceId);
    HtmlElements.addInput(col2, name + ".sourceDetails", prompt.sourceDetails);
    HtmlElements.addCheckbox(col3, name + ".isDirectQuote", prompt.isDirectQuote)
    HtmlElements.addCheckbox(col4, name + ".isTranslated", prompt.isTranslated)
    HtmlElements.addCheckbox(col5, name + ".isParaphrased", prompt.isParaphrased)

}

function addPromptTextLinkInputRow(parentElement, promptId, promptIndex, selectedId){
    var index = parentElement.childElementCount;

    var row = addRow(parentElement);
    var col1 = addCol(row);
    var col2 = addCol(row);
    var col3 = addCol(row, "col-1");

    var name = 'prompts['+promptIndex+'].textlinkNodeIds[' + index + ']';

    addNodeIdSelectElement(col1, name, selectedId)

    var deleteButton = addDeleteButtonElement(col3, promptId);
    deleteButton.addEventListener("click", onRemoveEditPanelPromptIntextLink);

    return row;
}

function addEditPanelOptionElement(option){
    var container = document.getElementById("editOptionContainer");
    var index = container.childElementCount;

    var row = addRow(container);
    var col1 = addCol(row);
    var col2 = addCol(row);
    var col3 = addCol(row, "col-1");

    addHiddenInput(col1, 'options['+index+'].id', option.id);
    addNodeIdSelectElement(col1, 'options['+index+'].nodeId', option.nodeId);    
    addTextarea(col2, 'options['+index+'].text', option.text);

    var deleteButton = addDeleteButtonElement(col3, option.id);
    deleteButton.addEventListener("click",onRemoveEditPanelOption);

    addOptionTransitionInputs(container,option,index)
}

function addOptionTransitionInputs(parentElement, option, index){
    var name = 'options['+index+']';

    var row = addRow(parentElement);
    var col1 = addCol(row);
    var col2 = addCol(row);

    col1.textContent = "Auto";
    col2.textContent = "Prevent Node Prompts";

    HtmlElements.addCheckbox(col1, name + ".isAutoOption", option.isAutoOption);
    HtmlElements.addCheckbox(col2, name + ".preventNodePrompts", option.preventNodePrompts);
}

function addEditPanelPlaceElement(nodePlace){
    var container = document.getElementById("editPlaceContainer");
    var name = "nodePlace";
    nodePlace = nodePlace ? nodePlace : new NodePlace();
    addEditPanelPlaceRow(container, nodePlace, name);
}

function addEditPanelUnlockPlaceElement(nodePlace){
    var container = document.getElementById("editUnlockPlaceContainer");
    var index = container.childElementCount;
    var name = 'unlockPlaces['+index+']';
    addEditPanelPlaceRow(container, nodePlace, name);
}

function addEditPanelPlaceRow(parentElement, nodePlace, name){
    var row = addRow(parentElement);
    var col1 = addCol(row);
    var col2 = addCol(row);
    var col3 = addCol(row, "col-1");

    
    var imageIdSelectElement = addSelectElement(col1, name + '.imageId');
    imageIdSelectElement.addEventListener("change", onImageSelection);   
    Storage.currentGame.images.forEach(image => {
        var imageOptionElement = document.createElement("option");
        imageOptionElement.setAttribute("value", image.path);        
        imageOptionElement.textContent = image.path;        
        if(nodePlace.imageId == image.path)
            imageOptionElement.setAttribute("selected","selected");
        imageIdSelectElement.appendChild(imageOptionElement);
    });
    
    var placeIdSelectElement = addSelectElement(col2, name + '.placeId');
    var image = Storage.findImageByPath(nodePlace.imageId);
    addPlaceSelectOptions(placeIdSelectElement,image,nodePlace.placeId)
   
   

    var deleteButton =  addDeleteButtonElement(col3);
    deleteButton.addEventListener("click",onRemoveEditPanelPlace);

    return row;
}

function addPlaceSelectOptions(selectElement, image, selectedPlaceId = -1){
    selectElement.appendChild(Shared.getDefaultOptionElement());
    if(image != null){
        image.places.forEach(place => {
            var placeOptionElement = document.createElement("option");
            placeOptionElement.setAttribute("value", place.id);        
            placeOptionElement.textContent = place.name;
            if(selectedPlaceId == place.id)
                placeOptionElement.setAttribute("selected","selected");
                selectElement.appendChild(placeOptionElement);
        });
    }
}

function addNodeIdSelectElement(parentElement, name, selectedNodeId){
    var nodeIdSelectElement = addSelectElement(parentElement, name);
    
    //TODO move somewhere else?
    Storage.currentGame.nodes.sort((a, b) => {
        let fa = a.name.toLowerCase(),
            fb = b.name.toLowerCase();
        if (fa < fb) return -1;
        if (fa > fb) return 1;
        return 0;
    });
    Storage.currentGame.nodes.forEach(node => {
        var nodeIdOptionElement = document.createElement("option");
        nodeIdOptionElement.setAttribute("value", node.id);        
        nodeIdOptionElement.textContent = node.name;
        if(selectedNodeId == node.id)
            nodeIdOptionElement.setAttribute("selected","selected");
        nodeIdSelectElement.appendChild(nodeIdOptionElement);
    });

    return nodeIdSelectElement;
}

function addSelectElement(parentElment, name){
    var selectElement = document.createElement("select");
    selectElement.setAttribute("type", "text");
    selectElement.setAttribute("class", "form-control");
    selectElement.setAttribute("name", name);
    selectElement.appendChild(Shared.getDefaultOptionElement());

    parentElment.appendChild(selectElement);
    return selectElement;
}

//would need to set event (func) as param
function addDeleteColElement(parentElement, value = null){
    var col = document.createElement("div");
    col.setAttribute("class", "col col-1");
    addDeleteButtonElement(col, value);
    parentElement.appendChild(col);
}

function addDeleteButtonElement(parentElement, value = null){
    var deleteButton = document.createElement("button");
    deleteButton.setAttribute("type", "button");
    deleteButton.setAttribute("class", "btn-close");
    deleteButton.setAttribute("value", value);

    parentElement.appendChild(deleteButton);

    return deleteButton;
}

function addTextarea(parentElement, name, value){
    var textElement = document.createElement("textarea");
    textElement.setAttribute("type", "text");
    textElement.setAttribute("class", "form-control");
    textElement.setAttribute("name", name);
    textElement.setAttribute("rows", 3);
    textElement.textContent = value;

    parentElement.appendChild(textElement);
    return textElement;
}

function addHiddenInput(parentElement, name, value){
    var hiddenElement = document.createElement("input");
    hiddenElement.setAttribute("type", "hidden");
    hiddenElement.setAttribute("name", name);
    hiddenElement.setAttribute("value", value);
   
    parentElement.appendChild(hiddenElement);

    return hiddenElement;
}

function addRow(parentElement){
    var row = document.createElement("div");
    row.setAttribute("class", "row");
    
    parentElement.appendChild(row);
    return row;
}

function addCol(parentElement, bootstrapClass = ""){
    var col = document.createElement("div");
    col.setAttribute("class", "col " +bootstrapClass);
    
    parentElement.appendChild(col);
    return col;
}
function addHrElement(parentElement){
    var hr = document.createElement("hr");
    hr.setAttribute("class", "hr");
    
    parentElement.appendChild(hr);
    return hr;
}

export {setup, submit, setForm};