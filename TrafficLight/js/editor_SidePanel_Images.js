import * as Storage from "./shared/storage.js";
import * as HtmlElements from "./shared/htmlElements.js";
import * as Shared from "./shared/shared.js";




function setup(){
}


function submit(formData){
    //Shared.clearElementById("editImageContainer");

//console.log(formData)

    var game = Storage.currentGame;
    formData.images.forEach(formImage => {

        if(formImage.places != null){
            formImage.places?.forEach(formPlace => {
                formPlace.locked = (formPlace.locked != null);  
                formPlace.nodeId = formPlace.nodeId != -1 ? formPlace.nodeId : null; 
            });
        }
        else{
            formImage.places = [];
        }
    });
    game.images = formData.images.flat();
}

function setForm() {
    var container = document.getElementById("editImageContainer");
    Shared.clearElement(container)

    var images = Storage.currentGame.images;
    images.forEach(image => {
        addEditPanelImageElement(image, container)
    });
}

function removeEditPanelImage(e){
    e.target.closest(".row").innerHTML = "";
}


function addEditPanelImageElement(image, container){
    var index = container.childElementCount;


    var row = HtmlElements.addRow(container);
    var col1 = HtmlElements.addCol(row);
    col1.textContent = image.path;
    HtmlElements.addHiddenInput(col1,"images["+index+"].path", image.path);


    for (let i = 0; i < image.places.length; i++) {
        var place = image.places[i];        

        var placeRow = HtmlElements.addRow(container);
        var placeCol1 = HtmlElements.addCol(placeRow);
        var placeCol2 = HtmlElements.addCol(placeRow, "");
        var placeCol3 = HtmlElements.addCol(placeRow);

        placeCol1.textContent = place.name;

        var idElement = document.createElement("input");
        idElement.setAttribute("type", "hidden");
        idElement.setAttribute("name", 'images['+index+'].places['+ i +'].id');
        idElement.setAttribute("value", place.id);
        placeRow.appendChild(idElement);

        var nameElement = document.createElement("input");
        nameElement.setAttribute("type", "hidden");
        nameElement.setAttribute("name", 'images['+index+'].places['+ i +'].name');
        nameElement.setAttribute("value", place.name);
        placeRow.appendChild(nameElement);

        var formswitch = document.createElement("div");
        formswitch.setAttribute("class", "form-switch");
        placeCol2.appendChild(formswitch);    

        var lockedElement = document.createElement("input");
        lockedElement.setAttribute("type", "checkbox");
        lockedElement.setAttribute("class", "form-check-input");
        lockedElement.setAttribute("name", 'images['+index+'].places['+ i +'].locked');
        if(place.locked) lockedElement.setAttribute("checked", true);
        formswitch.appendChild(lockedElement);    

        HtmlElements.addNodeIdSelectElement(placeCol3,'images['+index+'].places['+ i +'].nodeId', place.nodeId);
    }


}


export {setup, submit, setForm};