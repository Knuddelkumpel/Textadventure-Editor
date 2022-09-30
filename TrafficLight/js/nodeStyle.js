import * as Storage from "./shared/storage.js";




export function addNodePromptElement(parentElement, prompt) {
    var actor = Storage.findActorById(prompt.actorId);

    var liElement = document.createElement("li");
    liElement.setAttribute("id", "Prompt" + prompt.id);
    liElement.setAttribute("class", "p-2 prompt");
    parentElement.appendChild(liElement);

    var pElement = document.createElement("p");
    pElement.setAttribute("class", "mb-0" );
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
        for (const match of matches) {
            var fullMatch = match[0];
            var group1 = match[1];
            var group2 = match[2];
            var group3 = match[3];

            if (group1.length > 0)
                pElement.appendChild(getPromptTextElement(group1));
            if (group2.length > 0) {
                var text = group2.replace("[", "").replace("]", "");
                var textElement = getPromptTextElement(text);                    
                textElement.setAttribute("class", "textJumpLink  p-0 fw-bold btn");
                pElement.appendChild(textElement);
            }
            if (group3.length > 0)
                pElement.appendChild(getPromptTextElement(group3));

        }
    } else {
        pElement.appendChild(getPromptTextElement(prompt.text));
    }
    return liElement;
}


function getPromptTextElement(text){
    var textElement = document.createElement("span");
    textElement.textContent = text;
    return textElement;
}
