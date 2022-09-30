import { Coord, Node, ConditionNode } from "./shared/dataClasses.js";
import * as Storage from "./shared/storage.js";
import * as Shared from "./shared/shared.js";
import * as Drag from "./editor_drag.js";
import * as Draw from "./editor_draw.js";
import * as SidePanel from "./editor_SidePanel_Base.js";
import { addNodePromptElement } from "./nodeStyle.js";
import * as HtmlElements from "./shared/htmlElements.js";


const defaultPosition = 50;

function setup(){       
    const addNodeButton = document.getElementById("addNodeButton");
    addNodeButton.addEventListener("click", addNode);

    const addConditionNodeButton = document.getElementById("addConditionNodeButton");
    addConditionNodeButton.addEventListener("click", addConditionNode);

    createAllNodes();
    createAllLines();
}

//EVENTS
function onEditNode(e) {
    var id = e.target.value;
    var node = Storage.findNodeById(id);

    if(!node.isCondition){
        SidePanel.startEditNode(id);
    }
    else{
        SidePanel.startEditConditionNode(id);
    }

    
}

//FUCNCTIONS
export function createAllNodes() {
    Storage.currentGame.nodes.forEach(node => {
        createCardElement(node);
    });
}
export function createAllLines() {
    Storage.currentGame.nodes.forEach(node => {
        Draw.drawLinesForNode(node);
    });
}

export function addNode() {
    var node = Storage.addNode();    
    node.coordinates = new Coord(defaultPosition, defaultPosition);
    createCardElement(node);
}

export function addConditionNode() {
    var node = Storage.addConditionNode();    
    node.coordinates = new Coord(defaultPosition, defaultPosition);
    createCardElement(node);
}

function createCardElement(node) {

    var cardContainer = document.getElementById("cardContainer");

    var card = document.createElement("div");
    card.setAttribute("id", "Node"+ node.id);
    card.setAttribute("class", "card text-white bg-dark node");
    card.setAttribute("draggable", "true");
    card.setAttribute("style", "width: 18rem; position:absolute; left:" + node.coordinates.x + "px; top:" + node.coordinates.y + "px");
    card.addEventListener("dragstart", Drag.dragstart);
    cardContainer.appendChild(card);



    var cardHeader = document.createElement("div");
    cardHeader.setAttribute("class", "card-header");
    card.appendChild(cardHeader);

    var nameElement = document.createElement("span");
    nameElement.setAttribute("class", "card-value-name");
    nameElement.textContent = node.name;
    cardHeader.appendChild(nameElement);

    var editElement = document.createElement("button");
    editElement.setAttribute("value", node.id);
    editElement.setAttribute("class", "btn btn-secondary float-end editCardBtns");
    editElement.textContent = "EDIT";
    editElement.addEventListener("click", onEditNode);
    cardHeader.appendChild(editElement);



    var cardBody = document.createElement("div");
    cardBody.setAttribute("class", "card-body");
    card.appendChild(cardBody);

    if(node.isCondition){
        var conditionContainer = document.createElement("div");
        conditionContainer.setAttribute("class", "conditionContainer");
        cardBody.appendChild(conditionContainer);

        createOrUpdateConditionNodeContent(node);
    }
    else{  
        var promptContainer = document.createElement("ul");
        promptContainer.setAttribute("class", "promptContainer list-unstyled mb-0");
        cardBody.appendChild(promptContainer);

        HtmlElements.addHrElement(cardBody);
        
        var optionContainer = document.createElement("div");
        optionContainer.setAttribute("class", "optionContainer");
        cardBody.appendChild(optionContainer);

        createOrUpdateNodeContent(node);
    }
}

function createOrUpdateNodeContent(node) {
    var nodeElement = Shared.getNodeElement(node.id);
    nodeElement.querySelector('.card-value-name').textContent = node.name;

    var promptContainer = nodeElement.querySelector('.promptContainer');
    Shared.clearElement(promptContainer);
    if(node.prompts?.length > 0){        
        node.prompts.forEach(prompt => {
            addNodePromptElement(promptContainer, prompt);
        });
    }

    var optionContainer = nodeElement.querySelector('.optionContainer');
    Shared.clearElement(optionContainer);
    node.options.forEach(option => {
        addNodeOptionElement(optionContainer, option);
    });
}

function createOrUpdateConditionNodeContent(node) {
    var nodeElement = Shared.getNodeElement(node.id);
    nodeElement.querySelector('.card-value-name').textContent = node.name;

    var conditionContainer = nodeElement.querySelector('.conditionContainer');
    Shared.clearElement(conditionContainer);
    node.conditions.forEach(condition => {
        addNodeConditionElement(conditionContainer, condition);
    });
}


function addNodeOptionElement(parentElement, option) {    
    var active = option.nodeId ? "option-active" : "option-inactive";

    var card = document.createElement("div");
    card.setAttribute("id", "Option"+ option.id);
    card.setAttribute("class", "card text-uppercase fw-bold text-white option " + active);
    parentElement.appendChild(card);

    var cardBody = document.createElement("div");
    cardBody.setAttribute("class", "card-body");
    card.appendChild(cardBody);
    
    var p = document.createElement("p");
    p.textContent = option.text;
    cardBody.appendChild(p);

}

function addNodeConditionElement(parentElement, condition) {
    var active = condition.nodeId ? "condition-active" : "condition-inactive";

    var card = document.createElement("div");
    card.setAttribute("id", "Condition"+ condition.id);
    card.setAttribute("class", "card text-uppercase fw-bold text-white condition "+ active);
    parentElement.appendChild(card);

    var cardBody = document.createElement("div");
    cardBody.setAttribute("class", "card-body");
    card.appendChild(cardBody);
    
    var p = document.createElement("p");
    p.textContent = "CONDITION";
    cardBody.appendChild(p);
}

export {setup, createOrUpdateNodeContent, createOrUpdateConditionNodeContent}