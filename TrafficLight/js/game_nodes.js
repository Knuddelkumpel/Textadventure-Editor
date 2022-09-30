import * as Storage from "./shared/storage.js";
import * as Shared from "./shared/shared.js";
import * as Draw from "./editor_draw.js";
import { addNodePromptElement } from "./nodeStyle.js";
import * as HtmlElements from "./shared/htmlElements.js";
import {overviewJumpToNode} from "./game.js";

var nodescreated = false;

function setup(){       
    
}


export function updateOverviewMode(){
    if(!nodescreated){
        createAllNodes();
        createAllLines();
        nodescreated = true;
    }
    colorPlayedNodes();

}

function colorPlayedNodes(){
    var previousPlays = Storage.currentSaveGame.entries;
    if(previousPlays.length > 0){
        previousPlays.forEach(entry => {
           switch (entry.type) {
            case "Node":             
            case "TextJump": 
            case "LogJump": 
            case "OverviewJump": colorPlayedNode(entry.id); break;
            case "Option": colorPlayedOptions(entry.id); break;
            default:break;
           }
        });

    }
}

function colorPlayedNode(nodeId){
    var nodeElement = Shared.getNodeElement(nodeId);
    var headerElement = nodeElement.querySelector(".card-header");
    headerElement.classList.add("bg-playedNode");
}

function colorPlayedOptions(optionId){
//TODO ?
}



function onJumpToNode(e) {
    var id = e.target.value;

    overviewJumpToNode(id);    
}

function getAllRelevantNodes(){
    return Storage.currentGame.nodes?.filter(node => {
        return !node.name.includes("[HIDDEN]")
    })

}
function createAllNodes() {


    getAllRelevantNodes().forEach(node => {
        createCardElement(node);
    });
}
function createAllLines() {
    getAllRelevantNodes().forEach(node => {
        Draw.drawLinesForNode(node);
    });
}


function createCardElement(node) {

    var cardContainer = document.getElementById("cardContainer");

    var card = document.createElement("div");
    card.setAttribute("id", "Node"+ node.id);
    card.setAttribute("class", "card text-white bg-dark node");
    card.setAttribute("style", "width: 18rem; position:absolute; left:" + node.coordinates.x + "px; top:" + node.coordinates.y + "px");
    cardContainer.appendChild(card);


    var cardHeader = document.createElement("div");
    cardHeader.setAttribute("class", "card-header");
    card.appendChild(cardHeader);

    var nameElement = document.createElement("span");
    nameElement.setAttribute("class", "card-value-name");
    nameElement.textContent = node.name;
    cardHeader.appendChild(nameElement);

    var jumpElement = document.createElement("button");
    jumpElement.setAttribute("value", node.id);
    jumpElement.setAttribute("class", "btn btn-secondary float-end editCardBtns");
    jumpElement.textContent = "JUMP";
    jumpElement.addEventListener("click", onJumpToNode);
    cardHeader.appendChild(jumpElement);



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
    card.setAttribute("class", "card text-uppercase fw-bold text-dark condition "+ active);
    parentElement.appendChild(card);

    var cardBody = document.createElement("div");
    cardBody.setAttribute("class", "card-body");
    card.appendChild(cardBody);
    
    var p = document.createElement("p");
    p.textContent = "CONDITION";
    cardBody.appendChild(p);
}

export {setup}