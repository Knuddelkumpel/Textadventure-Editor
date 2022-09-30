function clearElementById(id){
    var element = document.getElementById(id);
    if(element != null){
       clearElement(element);
    }            
}
function clearElement(element){
    while (element.lastChild) {
        element.removeChild(element.lastChild);
    }
}

function getDefaultOptionElement(){
    var defaultOptionElement = document.createElement("option");
    defaultOptionElement.setAttribute("value", -1);
    defaultOptionElement.textContent = "-";
    return defaultOptionElement;
}

function displayHide(element) {
    element.classList.add("visually-hidden");
 }
 function displayShow(element) {
    element.classList.remove("visually-hidden");
 }

 function downloadJSON(filename, content) {
    var jsonString = JSON.stringify(content);

    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(jsonString));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
  }


export function getNodeElement(nodeId){
   return document.getElementById("Node"+nodeId)
}
export function getIdFromNodeElement(nodeElement){
    return nodeElement.id.replace("Node", "");
 }
export function getOptionElement(optionId){
   return document.getElementById("Option"+optionId)
}
export function getIdFromOptionElement(optionElement){
    return optionElement.id.replace("Option", "");
}
export function getPromptElement(promptId){
    return document.getElementById("Prompt"+promptId)
}
export function getIdFromPromptElement(promptElement){
    return promptElement.id.replace("Prompt", "");
}
export function getConditionElement(conditionId){
    return document.getElementById("Condition"+conditionId)
 }
export function getIdFromConditionElement(conditionElement){
    return conditionElement.id.replace("Condition", "");
}

export {clearElement, clearElementById, getDefaultOptionElement, displayHide, displayShow, downloadJSON as download}