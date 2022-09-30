import * as Shared from "./shared/shared.js";
import * as Storage from "./shared/storage.js";
import { loadFileFromServer } from "./shared/ajax.js";
import { imageJumpToNode } from "./game.js";
import * as HtmlElements from "./shared/htmlElements.js";


function onClickPlace(e){
    var placeElement = this;
    var nodeId  = placeElement.getAttribute("data-nodeId");
    imageJumpToNode(nodeId);
}

export function loadImages(){
    var container = document.getElementById("visualsContainer");

    var images = Storage.currentGame.images;
    images.forEach(image => {
        var response = loadFileFromServer(image.path);

        var wrapperElement = document.createElement('div');
        wrapperElement.setAttribute("class","imageWrapper d-flex justify-content-center h-100");
        wrapperElement.setAttribute("id","wrapper" + image.path);
        container.appendChild(wrapperElement);

        var row = HtmlElements.addRow(wrapperElement);
        //var col1 = HtmlElements.addCol(row, "col-1 px-0");
        var col2 = HtmlElements.addCol(row, "px-0 d-flex flex-column justify-content-center");
        //var col3 = HtmlElements.addCol(row, "col-1 px-0");

        col2.innerHTML = response;   

        image.places?.forEach(place => {
            var placeElement = wrapperElement.querySelector("#" + place.id);
            console.log(place)
            placeElement.setAttribute("class", "place");
            
            if(place.nodeId != null){
                placeElement.setAttribute("class", "place place-clickable");
                placeElement.setAttribute("data-nodeId", place.nodeId)
                placeElement.addEventListener("click", onClickPlace);
            }

            if(place.locked){
                console.log("Hide");
                Shared.displayHide(placeElement)
            }
        });

    });
}

export function showImage(nodePlace) {
    hideAllImages();
    if (nodePlace != null) {
        var wrapperElement = document.getElementById("wrapper" + nodePlace.imageId);
        if (wrapperElement != null){
            Shared.displayShow(wrapperElement);

            var svg = wrapperElement.querySelector("svg");

            [... document.getElementsByClassName("selectedPlace")]?.forEach(element => {
                element.classList.remove("selectedPlace");
            })

            if(nodePlace.placeId != null){
                var placeElement = wrapperElement.querySelector("#"+nodePlace.placeId);
                placeElement.classList.add("selectedPlace");
            }
             /*   var bbox = placeElement.getBBox();
                
                //offset by 10%
                var x = bbox.x - (bbox.x / 10);
                var y = bbox.y - (bbox.y / 10);
                var w = bbox.width + (bbox.width / 10);
                var h = bbox.height + (bbox.height / 10);               

                svg.setAttribute('viewBox', `${x} ${y} ${w} ${h}`);
            }else{
                svg.setAttribute('viewBox', `0 0 ${svg.clientWidth} ${svg.clientHeight}`);
            }*/
        }
    }
}
function hideAllImages() {
    var wrapperElements = document.querySelectorAll(".imageWrapper");
    wrapperElements.forEach(Shared.displayHide);
}

export function unlockPlaces(node){
    if(node.unlockPlaces.length > 0){
        node.unlockPlaces.forEach(place => {
            var placeElement = document.querySelector(".imageWrapper #" + place.placeId);
            Shared.displayShow(placeElement);
        });
    }
}