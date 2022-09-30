import * as Shared from "./shared/shared.js"
import * as Storage from "./shared/storage.js";
import * as ImageManager from "./game_image.js";
import * as HtmlElements from "./shared/htmlElements.js";
import * as Scaling from "./shared/scale.js";
import * as Nodes from "./game_nodes.js";

var lastNode = null;

setup();

function setup(){         
    const returnToMenuBtn = document.getElementById("returnToMenuBtn");
    returnToMenuBtn.addEventListener("click", onReturnToMenu);

    var overviewContainer = document.getElementById('canvasContainer')
    overviewContainer.addEventListener('shown.bs.collapse', openOverviewMode)

    Storage.loadCurrentGame();
    Storage.loadCurrentSaveGame();

    Scaling.setup();

    setTitle();
    setSources();
    ImageManager.loadImages();   

    loadSaveGame();

    closeOverviewMode();
    
}

function openOverviewMode(){
    Nodes.updateOverviewMode();

}

function closeOverviewMode(){
    var overviewContainer = document.getElementById("canvasContainer");
    var visualsContainer = document.getElementById("visualsContainer");

    overviewContainer.classList.remove("show");
    visualsContainer.classList.add("show");

}

function loadSaveGame(){
    var previousPlays = Storage.currentSaveGame.entries;
    if(previousPlays.length > 0){
        previousPlays.forEach(entry => {
           switch (entry.type) {
            case "Node": playNode(entry.id, false); break;
            case "Option": playOption(entry.id, false, false); break;
            case "TextJump": textJumpToNode(entry.id, false); break;
            case "LogJump": logJumpToNode(entry.id, false); break;
            case "OverviewJump": overviewJumpToNode(entry.id, false); break;
            default:break;
           }
        });

    }else{
        playNode(Storage.currentGame.firstNodeId);
    }
}

function setTitle(){
    var title = Storage.currentGame.name;
    document.title = title;
    document.getElementById("navTitle").textContent = title;
}

function setSources(){
    var container = document.getElementById("sourceContainer")
    var sources = Storage.currentGame.sources;
    sources.forEach(source => {
        addSource(container, source)
    });
}

function onReturnToMenu(e) {
    window.location.href = "menu.html";
}

function onClickOption(e){
    var optionId = e.target.value;
    playOption(optionId);
}

function onClickTextLink(e){
    var nodeId = e.target.getAttribute("value");
    textJumpToNode(nodeId);
}

function onClickJumpLog(e){
    var nodeId = e.target.value;
    logJumpToNode(nodeId);
}



function playOption(optionId, saveOption = true, playAttachedNode = true){
    var option = Storage.findOptionById(optionId);

    addSelectedOption(option);
    if(saveOption)
        Storage.addSaveGameEntryForOption(option);

    if(playAttachedNode)
        playNode(option.nodeId, true, !option.preventNodePrompts);        
}

function playNode(nodeId, saveNode = true, displayPrompts = true){    
    var node = Storage.findNodeById(nodeId);
    lastNode = node;

    if(node.isCondition){
        var targetId = getTargetForCondition(node);
        if(targetId != null){
            playNode(targetId)
        }
    }else{  
        if(displayPrompts)
            addPrompts(node.prompts, node.id);

        clearOptions();
        addOptions(node.options);

        ImageManager.unlockPlaces(node);
        ImageManager.showImage(node.nodePlace);  

        if(saveNode)
            Storage.addSaveGameEntryForNode(node);
        
        var autoOptionId = node.options?.find(option => option.isAutoOption == true)?.id;
        if(autoOptionId != null)
            playOption(autoOptionId, false);
    }
}

function textJumpToNode(nodeId, saveJump = true){
    if(saveJump)
        Storage.addSaveGameEntryForTextJump(nodeId);
    addToJumpLog(nodeId, "Text Jump");
    addJump();
    playNode(nodeId, saveJump);
}
function logJumpToNode(nodeId, saveJump = true){
    if(saveJump)
        Storage.addSaveGameEntryForLogJump(nodeId);
    addToJumpLog(nodeId, "Log Jump");
    addJump();
    playNode(nodeId, saveJump);
}
export function imageJumpToNode(nodeId, saveJump = true){
    if(saveJump)
        Storage.addSaveGameEntryForImageJump(nodeId);
    addToJumpLog(nodeId, "Image Jump");
    addJump();
    playNode(nodeId, saveJump);
}
export function overviewJumpToNode(nodeId, saveJump = true){
    closeOverviewMode();
    if(saveJump)
        Storage.addSaveGameEntryForOverviewJump(nodeId);
    addToJumpLog(nodeId, "Overview Jump");
    addJump();
    playNode(nodeId, saveJump);
}

function addToJumpLog(nodeId, jumpTypeText){
    var node = Storage.findNodeById(nodeId);
    var container = document.getElementById("jumplogContainer");
    
    var li = document.createElement("li");
    li.setAttribute("class","row my-2");
    container.appendChild(li);

    var col1 = HtmlElements.addCol(li, "col-5 pe-0");
    var col2 = HtmlElements.addCol(li, "col-2 text-center px-0 jumplogArrow");
    var col3 = HtmlElements.addCol(li, "col-5 ps-0");


    var fromButton = document.createElement("button");
    fromButton.setAttribute("class","btn btn-outline-dark btn-block");
    fromButton.setAttribute("value", lastNode.id);
    fromButton.addEventListener("click", onClickJumpLog)
    fromButton.textContent = lastNode.name;
    col1.appendChild(fromButton);

    var arrow = document.createElement("span");
    arrow.setAttribute("class","fw-bold ");
    arrow.textContent =  jumpTypeText;
    col2.appendChild(arrow);

    var toButton = document.createElement("button");
    toButton.setAttribute("class","btn btn-outline-dark btn-block");
    toButton.setAttribute("value", node.id);
    toButton.addEventListener("click", onClickJumpLog)
    toButton.textContent = node.name;
    col3.appendChild(toButton);
}

function addSource(parentElement, source){
    
    
    var row = HtmlElements.addRow(parentElement);
    var col1 = HtmlElements.addCol(row);
    col1.textContent = "[" + source.number + "]";

    addSourceRow(parentElement,"Type", source.type);
    addSourceRow(parentElement,"Author", source.author);
    addSourceRow(parentElement,"Title", source.title);
    addSourceRow(parentElement,"Published by", source.publisher);
    addSourceRow(parentElement,"Published in", source.in);
    addSourceRow(parentElement,"Publication date", source.publicationDate);
    addSourceRow(parentElement,"Last access date", source.accessDate);
    addSourceRow(parentElement,"Link", source.link);
    addSourceRow(parentElement,"ISBN", source.isbn);
    addSourceRow(parentElement,"DOI", source.doi);
    
    var row = HtmlElements.addRow(parentElement);
    HtmlElements.addHrElement(row);
}

function addSourceRow(parentElement, name, value){

    if(value?.length > 0){
        var row = HtmlElements.addRow(parentElement);
        var col1 = HtmlElements.addCol(row, "col-3 pe-0");
        var col2 = HtmlElements.addCol(row);

        col1.textContent = name
        col2.textContent = value;
    }
}

function getTargetForCondition(conditionNode){       
    return conditionNode.conditions.find(condition =>{
        if(checkCondition(condition)) return condition;
    })?.nodeId;
}
function checkCondition(condition){   
    if(condition.requiredNodeIds.length > 0)
        return !checkAnyRequiredNodeIdsUnplayed(condition.requiredNodeIds);
    else return true;
}
function checkAnyRequiredNodeIdsUnplayed(requiredNodeIds){
   return requiredNodeIds.some(requiredNodeId => {
        return !Storage.saveGameIncludesNode(requiredNodeId);
    });
}

function addSelectedOption(option){
    var container = document.getElementById("nodesContainer");

    var htmlString = getSelectedOptionHtml(option);
    container.insertAdjacentHTML('beforeend', htmlString);
}

function addJump(){
    var container = document.getElementById("nodesContainer");

    var htmlString = '' +
    '<li class="p-2">' +
        '<p class="fw-bold mb-0 text-success">' +
            '<span>Jumped</span>' +
        '</p>' +
    '</li>';
    container.insertAdjacentHTML('beforeend', htmlString);
}

function addPrompts(prompts, turnNumber){
    var container = document.getElementById("nodesContainer");

    var row = HtmlElements.addRow(container);
    var col1 = HtmlElements.addCol(row, "col-auto p-0 fw-bold");
    var col2 = HtmlElements.addCol(row, "px-0");
    var col3 = HtmlElements.addCol(row, "col-auto ps-4 pe-1 fw-bold");

    
    var p = document.createElement("p");
    p.textContent = turnNumber;
    col1.appendChild(p)

    prompts.forEach(prompt => {
        var promptElement = getNodePromptContentElement(prompt);
        col2.appendChild(promptElement);
    });
    container.scrollTop = container.scrollHeight;
}
function clearOptions(){
    Shared.clearElementById("optionsContainer");
}
function addOptions(options){
    
    options.forEach(option => {
        getNodeOptionContentHtml(option);
    });
}

//mostly duplicate with editor
function getNodePromptContentElement(prompt ) {
    var actor = Storage.findActorById(prompt.actorId);
    var source = Storage.findSourceById(prompt.sourceId);

    var liElement = document.createElement("div");
    //liElement.setAttribute("id", "prompt" + prompt.id);
    liElement.setAttribute("class", "px-2 row");

    var pElement = document.createElement("p");
    pElement.setAttribute("class", "fw-bold mb-0");
    liElement.appendChild(pElement);

    var actorElement = document.createElement("span");
    actorElement.setAttribute("class", "text-uppercase");
    if (actor) {
        actorElement.setAttribute("style", "color:" + actor.color);
        actorElement.textContent = actor.name;
    } else {
        actorElement.setAttribute("style", "color:red");
        actorElement.textContent = "No Actor";
    }
    pElement.appendChild(actorElement);

    var spacerElement = document.createElement("span");
    spacerElement.textContent = " - ";
    pElement.appendChild(spacerElement);


    const regexBrackets = /([^\[]*)(\[.*?\])([^\[]*)/g;
    var matches = [...prompt.text.matchAll(regexBrackets)];



    if (matches.length) {
        for (let i = 0; i < matches.length; i++) {
            const match = matches[i];
            var fullMatch = match[0];
            var group1 = match[1];
            var group2 = match[2];
            var group3 = match[3];

            if (group1.length > 0)
                pElement.appendChild(getPromptTextElement(group1));
            if (group2.length > 0) {
                var textlinkElement;
                if(prompt.textlinkNodeIds[i]){

                    var text = group2.replace("[", "").replace("]", "");
                    textlinkElement = getPromptTextElement(text);
                    textlinkElement.setAttribute("class", "textJumpLink p-0 fw-bold btn");
                    textlinkElement.setAttribute("value", prompt.textlinkNodeIds[i])
                    textlinkElement.addEventListener("click", onClickTextLink);
                    pElement.appendChild(textlinkElement);
                }else{
                    pElement.appendChild(getPromptTextElement(group2));
                }               
            }
            if (group3.length > 0)
                pElement.appendChild(getPromptTextElement(group3));

        }
    } else {
        pElement.appendChild(getPromptTextElement(prompt.text));
    }

    var bubbleContainer = document.createElement("p");
    bubbleContainer.setAttribute("class", "mb-0")

    if(source != null){
        var sourceElement = document.createElement("kbd");
        sourceElement.textContent = "["+ source.number + "] " + prompt.sourceDetails;
        bubbleContainer.appendChild(sourceElement);
    }

    if(prompt.isDirectQuote){
        addTextBubble(bubbleContainer,"Quote");
    }
    if(prompt.isTranslated){
        addTextBubble(bubbleContainer,"Translated");
    }
    if(prompt.isParaphrased){
        addTextBubble(bubbleContainer,"Paraphrased");
    }

    if(bubbleContainer.childElementCount > 0){
        liElement.appendChild(bubbleContainer);
    }
    
    return liElement;
}

function addTextBubble(parentElement, text){
    var bubble = document.createElement("kbd");
    bubble.textContent = text;
    parentElement.appendChild(bubble);
}

function getPromptTextElement(text){
    var textElement = document.createElement("span");
    textElement.textContent = text;
    return textElement;
}

function getNodePromptHtml(prompt) {
    var actor = Storage.findActorById(prompt.actorId);
    if(actor){
    return '' +
        '<li class="p-2">' +
            '<div class="d-flex flex-row">' +
                '<p class="fw-bold mb-0">' +
                    '<span class="text-uppercase" style="color:'+ actor.color +'">' + actor.name + '</span>' +
                    '<span> - </span>' +
                    '<span>' + prompt.text + '</span>' +
                '</p>' +
            '</div>' +
        '</li>';
    }
    else return "";
}

function getSelectedOptionHtml(option) {
    return '' +
        '<li class="p-2">' +
            '<p class="fw-bold mb-0 text-success">' +
                '<span>' + option.text + '</span>' +
            '</p>' +
        '</li>';
}

function getNodeOptionContentHtml(option) {

    /*var card = document.createElement("div");
    card.setAttribute("class", "card");

    var cardBody = document.createElement("div");
    cardBody.setAttribute("class", "card-body");
    card.appendChild(cardBody);*/

    var li = document.createElement("div");
    li.setAttribute("class", "p-2 fw-bold");

    var buttonElement = document.createElement("button");
    buttonElement.setAttribute("class", "btn btn-lg w-100 option-select");
    buttonElement.textContent = option.text;
    if(option.nodeId != null){
        buttonElement.setAttribute("value", option.id);
        buttonElement.addEventListener("click", onClickOption)       
    }else{
        buttonElement.setAttribute("disabled", "true");
    }
    li.appendChild(buttonElement);

    var container = document.getElementById("optionsContainer");
    container.appendChild(li);
}


