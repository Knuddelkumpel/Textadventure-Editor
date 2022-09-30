import {Actor} from "./shared/dataClasses.js";
import * as Shared from "./shared/shared.js";
import * as Storage from "./shared/storage.js";


function setup(){
    const editPanelAddActorBtn  = document.getElementById('editPanelAddActorBtn');
    editPanelAddActorBtn.addEventListener('click', onAddEditPanelActor);
}

function onAddEditPanelActor(e){
    addEditPanelActorElement(new Actor());
}

function submit(formData){
    var game = Storage.currentGame;

    if(formData.actors != null){  
        formData.actors.forEach(formActor => {
            if(formActor != null)
                formActor.id = Storage.getOrAddActor(formActor.id).id;
        });
        game.actors = formData.actors.flat();
    }
}

function setForm() {
    Shared.clearElementById("editActorContainer");
    
    var game = Storage.currentGame;
    if (game.actors?.length > 0) {
        game.actors.forEach(actor => {
            addEditPanelActorElement(actor);
        });
    } 
}
function removeEditPanelActor(e){
    e.target.closest(".row").innerHTML = "";
}
  
function addEditPanelActorElement(actor){
    var container = document.getElementById("editActorContainer");
    var index = container.childElementCount;

    var row = document.createElement("div");
    row.setAttribute("class", "row");

    var col1 = document.createElement("div");
    col1.setAttribute("class", "col");
    var col2 = document.createElement("div");
    col2.setAttribute("class", "col");
    var col3 = document.createElement("div");
    col3.setAttribute("class", "col col-1");
    
    row.appendChild(col1);
    row.appendChild(col2);
    row.appendChild(col3);

    var idElement = document.createElement("input");
    idElement.setAttribute("type", "hidden");
    idElement.setAttribute("name", 'actors['+index+'].id');
    idElement.setAttribute("value", actor.id);
    row.appendChild(idElement);

    var nameElement = document.createElement("input");
    nameElement.setAttribute("type", "text");
    nameElement.setAttribute("class", "form-control");
    nameElement.setAttribute("name", 'actors['+index+'].name');
    nameElement.setAttribute("value", actor.name);
    col1.appendChild(nameElement);

    var colorElement = document.createElement("input");
    colorElement.setAttribute("type", "text");
    colorElement.setAttribute("class", "form-control");
    colorElement.setAttribute("name", 'actors['+index+'].color');
    colorElement.setAttribute("value", actor.color);
    col2.appendChild(colorElement);

    var deleteButton = document.createElement("button");
    deleteButton.setAttribute("type", "button");
    deleteButton.setAttribute("class", "btn-close");
    deleteButton.addEventListener("click",removeEditPanelActor)
    col3.appendChild(deleteButton);

    container.appendChild(row);
}

export {setup, submit, setForm};