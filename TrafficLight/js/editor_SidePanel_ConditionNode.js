import {Prompt, Option, Place, NodePlace, PlaceImage, ConditionNode} from "./shared/dataClasses.js";
import * as Shared from "./shared/shared.js";
import * as Storage from "./shared/storage.js";
import * as Draw from "./editor_draw.js";
import * as HtmlElements from "./shared/htmlElements.js";
import * as Nodes from "./editor_nodes.js";



function setup(){
    
}

function onAddEditPanelConditionRequieredNode(e){
    var index = e.target.value;
    var container = document.querySelector("#editCondition"+ index +" .reqNodesContainer");
    var conditionId = document.querySelector("#editCondition"+ index +" input[name='conditions["+ index +"].id']").value;
    
    addEditPanelConditionRequiredNodeInput(container,conditionId,index, -1);
}

function onAddEditPanelCondition(e){
    addEditPanelConditionElement(new ConditionNode());
}

function submit(formData){
    var node = Storage.findNodeById(formData.id);

    formData.conditions?.forEach(formCondition => {
        if(formCondition != null){
            formCondition.id = Storage.getOrAddCondition(node, formCondition.id).id;
            formCondition.requiredNodeIds = formCondition.requiredNodeIds ? formCondition.requiredNodeIds.flat() : []; //check for -1?
            formCondition.nodeId = (formCondition.nodeId > 0) ? formCondition.nodeId : null
        }
    });
    node.conditions = formData.conditions ? formData.conditions.flat() : [];
    node.name = formData.name;
// TODO
    Nodes.createOrUpdateConditionNodeContent(node);
    Draw.drawLinesForNode(node);
}

function setForm(form, nodeid) {

    Shared.clearElement(form);
    var node = Storage.findNodeById(nodeid);

    var container = document.createElement("div");
    container.setAttribute("class", "container");
    form.appendChild(container);


    HtmlElements.addHiddenInput(container,"id",node.id);

    var row = HtmlElements.addRow(container);
    var col = HtmlElements.addCol(row);

    //label
    HtmlElements.addInput(col, "name", node.name);
    HtmlElements.addHrElement(col);

    var conditionContainer = addEditPanelConditionContainer(col);
    node.conditions?.forEach(condition => { 
        addEditPanelConditionElement(condition);
    });
}

function onRemoveEditPanelCondition(e){
  //  var promptId = e.target.value;
   // Draw.deleteLineForPrompt(promptId); //deletsFirst only
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


function addEditPanelConditionContainer(parentElement){
    var headerRow = HtmlElements.addRow(parentElement);
    var col1 = HtmlElements.addCol(headerRow);
    var col2 = HtmlElements.addCol(headerRow, "col-1");
    var col3 = HtmlElements.addCol(headerRow, "col-1");
    var col4 = HtmlElements.addCol(headerRow, "col-1");
    
    var conditionContainer = document.createElement("div");
    conditionContainer.setAttribute("id", "editConditionContainer");
    parentElement.appendChild(conditionContainer);

    var label = document.createElement("span");
    label.textContent = "Conditions";
    col1.appendChild(label);

    var button = document.createElement("button");
    button.setAttribute("type", "button");
    button.setAttribute("class", "btn btn-secondary");
    button.textContent = "+";
    button.addEventListener("click", onAddEditPanelCondition);
    col3.appendChild(button);

    var row = HtmlElements.addRow(conditionContainer);
    var col1 = HtmlElements.addCol(row);
    var col2 = HtmlElements.addCol(row);
    var col3 = HtmlElements.addCol(row, "col-1");

    col1.textContent = "Target Node"
    col2.textContent = "Required Nodes"
}

function addEditPanelConditionElement(condition){
    var container = document.getElementById("editConditionContainer");
    var index = container.childElementCount;

    var div = document.createElement("div");
    div.setAttribute("id", "editCondition"+ index)
    container.appendChild(div);

    var row = HtmlElements.addRow(div);
    var col1 = HtmlElements.addCol(row);
    var col2 = HtmlElements.addCol(row);
    var col3 = HtmlElements.addCol(row, "col-1");
    var col4 = HtmlElements.addCol(row, "col-1");

    HtmlElements.addHiddenInput(div, 'conditions['+index+'].id', condition.id);

    HtmlElements.addNodeIdSelectElement(col1,"conditions["+ index +"].nodeId", condition.nodeId);

   var reqNodesContainer = addEditPanelConditionRequiredNodesContainer(col2, condition, index);    

    var button = document.createElement("button");
    button.setAttribute("type", "button");
    button.setAttribute("class", "btn btn-secondary");
    button.setAttribute("value", index);
    button.textContent = "+";
    button.addEventListener("click", onAddEditPanelConditionRequieredNode);
    col3.appendChild(button);



    var deleteButton = HtmlElements.addDeleteButtonElement(col4)
    deleteButton.addEventListener("click", onRemoveEditPanelCondition)

    //addConditionInputs(div, prompt, index);
    //addPromptTextLinkInputs(div, prompt, index);
    HtmlElements.addHrElement(div);
}

function addEditPanelConditionRequiredNodesContainer(parentElement, condition, conditionIndex){
    var reqNodesContainer = document.createElement("div");
    reqNodesContainer.setAttribute("class", "reqNodesContainer");
    parentElement.appendChild(reqNodesContainer);

    condition.requiredNodeIds?.forEach(nodeId => {

        addEditPanelConditionRequiredNodeInput(reqNodesContainer,condition.id, conditionIndex, nodeId);
    });

    return reqNodesContainer;
}

function addEditPanelConditionRequiredNodeInput(parentElement, conditionId, conditionIndex, selectedId){
    
    var index = parentElement.childElementCount;
    HtmlElements.addNodeIdSelectElement(parentElement,"conditions["+ conditionIndex +"].requiredNodeIds["+index+"]", selectedId);
    //deleteButton
}

export {setup, submit, setForm};