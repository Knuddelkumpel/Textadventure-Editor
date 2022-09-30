import {Coord} from "./shared/dataClasses.js";
import * as Storage from "./shared/storage.js";
import * as Shared from "./shared/shared.js";

function getLineElementForOrigin(id, type){
    return document.querySelector("." + type +"[data-origin-id='" + id + "']");       
}
function getLineElementsForTarget(id, type){
    return document.querySelectorAll("." + type +"[data-target-id='" + id + "']");       
}
function getLineElement(originId, targetId, type){
    return document.querySelector("." + type +"[data-origin-id='" + originId + "'][data-target-id='" + targetId + "']");       
}

function drawLine(lineElement, originCoords, targetCoords, targetId){
    //From Option
    lineElement.setAttribute("x1", originCoords.x);
    lineElement.setAttribute("y1", originCoords.y);

    //To Node
    lineElement.setAttribute("x2", targetCoords.x);
    lineElement.setAttribute("y2", targetCoords.y);

    lineElement.setAttribute("data-target-id", targetId);
}

function drawNewLine(originCoords, targetCoords, originId, targetId, type) {
    var lineContainer = document.getElementById("lineContainer");
    let lineElement = document.createElementNS("http://www.w3.org/2000/svg", "line");
    lineElement.setAttribute("data-origin-id", originId);

    lineElement.setAttribute("class", type);
    if(type == "optionLine"){
        lineElement.setAttribute("marker-start","url(#optionStartMarker)");
        lineElement.setAttribute("marker-end","url(#optionEndMarker)");    
    }
    else if(type == "promptLine"){
        lineElement.setAttribute("marker-start","url(#promptStartMarker)");
        lineElement.setAttribute("marker-end","url(#promptEndMarker)");    
    }
    else if(type == "conditionLine"){
        lineElement.setAttribute("marker-start","url(#conditionStartMarker)");
        lineElement.setAttribute("marker-end","url(#conditionEndMarker)");    
    }

    drawLine(lineElement, originCoords, targetCoords, targetId);

    lineContainer.appendChild(lineElement);

}

function drawForOrigin(originId, targetId, originCoords, targetCoords, type){    
    var lineElement = getLineElement(originId, targetId, type);
    if(lineElement != null)
        drawLine(lineElement, originCoords, targetCoords, targetId);
    else
        drawNewLine(originCoords, targetCoords, originId, targetId, type);
}

function redrawLinesForTarget(targetId, targetCoords){
    var lineElements = getLineElementsForTarget(targetId);
    if(lineElements.length > 0){
        lineElements.forEach(lineElement => {
            lineElement.setAttribute("x2", targetCoords.x);
            lineElement.setAttribute("y2", targetCoords.y);
        });
    }    
}

function deleteLineForOrigin(originId, type){
    var lineElement = getLineElementForOrigin(originId, type);
    if(lineElement != null)
        lineElement.parentNode.removeChild(lineElement);
}


function deleteLineForOption(optionId){
    deleteLineForOrigin(optionId, "optionLine");
}
function deleteLineForPrompt(promptId){
    deleteLineForOrigin(promptId, "promptLine");
}


//FOR NODES

function calcCoordsAndDrawLine(originElement, originChildElement, targetElement, originId, targetId, type){
    var optionLeftSide = originElement.offsetLeft
    var optionRightSide = originElement.offsetLeft + originElement.offsetWidth
    var optionTop = originElement.offsetTop + originChildElement.offsetTop + (originChildElement.offsetHeight / 2);

    var targetLeftCorner = targetElement.offsetLeft;
    var targetRightCorner = targetElement.offsetLeft + targetElement.offsetWidth;       
    var targetTopCorner = targetElement.offsetTop;
    var targetBottomCorner = targetElement.offsetTop + targetElement.offsetHeight;

    var targetX;
    var targetY;
    var optionX;
    var optionY = optionTop;

    if(optionY > targetBottomCorner){
        targetY = targetBottomCorner;
    }
    else {
        targetY = targetTopCorner;
    }

    if(optionRightSide < targetLeftCorner){
        optionX = optionRightSide;
        targetX = targetLeftCorner;
    }
    else if(optionLeftSide > targetRightCorner){
        optionX = optionLeftSide;
        targetX = targetRightCorner;
    }
    else if(optionLeftSide > targetLeftCorner ){
        optionX = optionLeftSide;
        targetX = targetLeftCorner;
    }
    else{
        optionX = optionRightSide;
        targetX = targetRightCorner;
    }

    var optionCoords = new Coord(optionX, optionY);
    var targetCoords = new Coord(targetX, targetY);
    
    drawForOrigin(originId, targetId, optionCoords, targetCoords, type)
}

function drawLineForOption(option){
    var type = "optionLine";
    var targetNode = Storage.findNodeById(option.nodeId);
    if (targetNode != null) {        
        var targetElement = Shared.getNodeElement(targetNode.id);
        var optionElement = Shared.getOptionElement(option.id);
        var originElement = optionElement.closest('.node');

        calcCoordsAndDrawLine(originElement, optionElement, targetElement, option.id, option.nodeId, type)

    } else {
        deleteLineForOrigin(option.id, type);
    }
}
function drawLinesForPrompt(prompt){
    var type = "promptLine";
    prompt.textlinkNodeIds?.forEach(nodeId => {
        var targetNode = Storage.findNodeById(nodeId);
        if (targetNode != null) {        
            var targetElement = Shared.getNodeElement(targetNode.id);
            var promptElement = Shared.getPromptElement(prompt.id);
            var originElement = promptElement.closest('.node');
    
            calcCoordsAndDrawLine(originElement, promptElement, targetElement, prompt.id, targetNode.id, type)
    
        } else {
            deleteLineForOrigin(option.id, type);
        }
    });
}

function drawLineForCondition(condition){
    var type = "conditionLine";
    var targetNode = Storage.findNodeById(condition.nodeId);

    if (targetNode != null) {        
        var targetElement = Shared.getNodeElement(targetNode.id);
        var conditionElement = Shared.getConditionElement(condition.id);
        var originElement = conditionElement.closest('.node');

        calcCoordsAndDrawLine(originElement, conditionElement, targetElement, condition.id, condition.nodeId, type)

    } else {
        deleteLineForOrigin(condition.id, type);
    }
}

function drawLinesForNode(node){    
    node.options?.forEach(option => {
        drawLineForOption(option);
    });
    node.prompts?.forEach(prompt =>{
        drawLinesForPrompt(prompt);
    });    
    node.conditions?.forEach(condition =>{
        drawLineForCondition(condition);
    });
}

function drawLinesToNode(node){
    var options = Storage.findOptionByNodeId(node.id);
    options?.forEach(option => {        
        drawLineForOption(option);
    });
    var prompts = Storage.findPromptsByTextlinkNodeIds(node.id);
    prompts?.forEach(prompt =>{
        drawLinesForPrompt(prompt);
    });
    var conditions = Storage.findConditionByNodeId(node.id);
    conditions?.forEach(condition=>{
        drawLineForCondition(condition);
    });
}


export {drawLinesForNode, drawLinesToNode, deleteLineForOption, deleteLineForPrompt};














