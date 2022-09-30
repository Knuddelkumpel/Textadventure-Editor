import * as Draw from "./editor_draw.js";
import {scale} from "./shared/scale.js";
import {Coord} from "./shared/dataClasses.js";
import * as Storage from "./shared/storage.js";
import * as Shared from "./shared/shared.js";

function setup(){

    var canvas = document.getElementById("canvas");
    canvas.addEventListener("drop",drop);
    canvas.addEventListener("dragover",dragover);
}

function dragstart(e) {
  var id = Shared.getIdFromNodeElement(e.target);
  var node = Storage.findNodeById(id);

  e.dataTransfer.setData("node", JSON.stringify(node));

  var cursorPosition = new Coord(e.clientX, e.clientY);
  e.dataTransfer.setData("cursorPosition", JSON.stringify(cursorPosition));

  var img = new Image(); //sets ghost image invisible
  img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  e.dataTransfer.setDragImage(img, 0, 0);
}

function dragover(e) { //MAybe onDrag -> could use this.clostest(".node") for nodeElement
    e.preventDefault();
    
    moveNode(e);
   //when leaving canvas breakes cause drop never hapens and it keeps last lines    0
}

function moveNode(e) { 
    var node = JSON.parse(e.dataTransfer.getData("node"));
    var originalCursorPosition = JSON.parse(e.dataTransfer.getData("cursorPosition"));

    node.coordinates = new Coord(
      node.coordinates.x + (e.clientX / scale) - (originalCursorPosition.x / scale),
      node.coordinates.y + (e.clientY / scale) - (originalCursorPosition.y / scale)
    );


    var nodeElement = Shared.getNodeElement(node.id);
    nodeElement.style.left = node.coordinates.x + 'px';
    nodeElement.style.top = node.coordinates.y + 'px';

    Draw.drawLinesForNode(node);
    Draw.drawLinesToNode(node);
    e.dataTransfer.setDragImage(nodeElement, node.coordinates.x, node.coordinates.y);

    return node;
}

function drop(e) {
  e.preventDefault();
  var node = moveNode(e);
  Storage.findNodeById(node.id).coordinates = node.coordinates;
}

export {setup, dragstart};