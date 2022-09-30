import * as Storage from "./shared/storage.js";
import * as Shared from "./shared/shared.js";
import {Place, PlaceImage} from "./shared/dataClasses.js";
import { loadFileFromServer } from "./shared/ajax.js";

const relevantIdPrefix = "PLACE_"

function setup(){
    const editPanelAddImageUploadBtn  = document.getElementById('editPanelAddImageUploadBtn');
    editPanelAddImageUploadBtn.addEventListener('click', onAddEditPanelImageUpload);
}

function onAddEditPanelImageUpload(e){
    addEditPanelImageElement(new PlaceImage());
}



function submit(formData){
    var game = Storage.currentGame;

    if(formData.images != null){
        formData.images.forEach(image => {
            var response = loadFileFromServer(image.path);

            if(response.length > 0){
                var tempElement = document.createElement('div');
                tempElement.innerHTML = response;   
                var places = tempElement.querySelectorAll('[id^='+ relevantIdPrefix +']');
        
                image.places = Array.from(places).map(placeElement => {
                    var id = placeElement.id;
                    var name = id.replace(relevantIdPrefix, "");
                    return new Place(id, name)
                });  
            }else{
                image.places = null;
            }   
        })

        game.images = formData.images.filter(image => image.places != null).flat();
    }
}

function setForm() {
    var game = Storage.currentGame;
    
    Shared.clearElementById("editImageUploadContainer");
    if (game.images?.length > 0) {
        game.images.forEach(image => {
            addEditPanelImageElement(image);
        });
    }
}

function removeEditPanelImage(e){
    e.target.closest(".row").innerHTML = "";
}


function addEditPanelImageElement(image){
    var container = document.getElementById("editImageUploadContainer");
    var index = container.childElementCount;

    var row = document.createElement("div");
    row.setAttribute("class", "row");

    var col1 = document.createElement("div");
    col1.setAttribute("class", "col");
    row.appendChild(col1);
    var col2 = document.createElement("div");
    col2.setAttribute("class", "col col-1");
    row.appendChild(col2);  

    var pathElement = document.createElement("input");
    pathElement.setAttribute("type", "text");
    pathElement.setAttribute("class", "form-control");
    pathElement.setAttribute("name", 'images['+index+'].path');
    pathElement.setAttribute("value", image.path);
    col1.appendChild(pathElement);

    var deleteButton = document.createElement("button");
    deleteButton.setAttribute("type", "button");
    deleteButton.setAttribute("class", "btn-close");
    deleteButton.addEventListener("click",removeEditPanelImage)
    col2.appendChild(deleteButton);

    container.appendChild(row);
}
  
export {setup, submit, setForm};