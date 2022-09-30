import * as Storage from "./shared/storage.js";


function setup(){

}


function submit(formData){
    var game = Storage.currentGame;

    game.name = formData.name;
    game.description = formData.description;
    game.firstNodeId = formData.firstNodeId;
    game.version = formData.version;
}

function setForm() {
    var game = Storage.currentGame;
    document.getElementById('editGameName').value = game.name;
    document.getElementById('editGameDescription').value = game.description;
    document.getElementById('editGameVersion').value = game.version;
    setFirstNodeSelect();
}

function setFirstNodeSelect(){

    var firstNodeId = Storage.currentGame.firstNodeId;

    var container = document.getElementById("editGameFirstNodeId");

    var htmlString = "";
    Storage.currentGame.nodes.forEach(node => {
        var selected = firstNodeId == node.id ? "selected" : "";
        htmlString += '<option '+ selected +' value="'+ node.id +'">'+ node.name +'</option>';
    });
        
    container.innerHTML = htmlString;
}
  
export {setup, submit, setForm};