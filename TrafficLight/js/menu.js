import * as Storage from "./shared/storage.js";
import * as Shared from "./shared/shared.js";
import { loadFileFromServer } from "./shared/ajax.js";

const version = 1.0;

setup();

function setup(){       

 const addGameButton  = document.getElementById('addGameButton');
 addGameButton.addEventListener('click', onAddGame);
 const loadHausarbeitButton  = document.getElementById('loadHausarbeitButton');
 loadHausarbeitButton.addEventListener('click', onLoadHausarbeit);

 setVersion();
 createOrUpdateListEntrys();

}

function setVersion(){
    var element = document.getElementById("version");
    element.textContent = version;
}

function onExportText(e){
    var id = e.target.value;
    var game = Storage.loadGame(id);


    var text = "";
    game.nodes.forEach(node => {
        node.prompts?.forEach(prompt => {
            text += prompt.actorId + " " + prompt.text + "\r";
        })        
    });

    var filename = "GameTextExport_" + game.name + ".text";
    Shared.download(filename, text);
}


function onLoadHausarbeit(e){
    var hausarbeit = loadFileFromServer("/Textadventure-Editor/TrafficLight/json/GameExport_Hausarbeit.json");
    hausarbeit = JSON.parse(hausarbeit); 
    Storage.saveGame(hausarbeit); 

    createOrUpdateListEntrys();
}

function onExportGame(e){
    var id = e.target.value;
    var game = Storage.loadGame(id);

    var filename = "GameExport_" + game.name + ".json";
    Shared.download(filename, game);
}

function onAddGame(e){
    Storage.addGame();    
    createOrUpdateListEntrys();
}

function onEditGame(e){
    var id = e.target.value;

    Storage.saveCurrentGameId(id);
    window.location.href = "editor.html";
}
function onPlayGame(e){
    var id = e.target.value;

    Storage.saveCurrentGameId(id);
    window.location.href = "game.html";
}

function onDeleteGameSave(e){
    var id = e.target.value;
    Storage.deleteSaveGame(id);
}

function createOrUpdateListEntrys() {
    var container = document.getElementById("gameContainer");
    Shared.clearElement(container);

    Storage.getBasicGameInfos().forEach(gameInfo => {

        var row = document.createElement("div");
        row.setAttribute("class", "row my-3");
        container.appendChild(row);

        var col1 = document.createElement("div");
        col1.setAttribute("class", "col col-3");
        row.appendChild(col1);
        var col2 = document.createElement("div");
        col2.setAttribute("class", "col col-auto");
        row.appendChild(col2);
        var col3 = document.createElement("div");
        col3.setAttribute("class", "col col-auto");
        row.appendChild(col3);
        var col4 = document.createElement("div");
        col4.setAttribute("class", "col col-auto");
        row.appendChild(col4);
       /* var col5 = document.createElement("div");
        col5.setAttribute("class", "col col-auto");
        row.appendChild(col5);*/
        var col6 = document.createElement("div");
        col6.setAttribute("class", "col col-5");
        row.appendChild(col6);
        var col7 = document.createElement("div");
        col7.setAttribute("class", "col col-5");
        row.appendChild(col7);

        var title = document.createElement("h4");
        title.textContent = gameInfo.name + " (version " + gameInfo.version + ")";

        var playButton = document.createElement("button");
        playButton.setAttribute("class", "btn btn-primary");
        playButton.setAttribute("value", gameInfo.id);
        playButton.textContent = "Play";
        playButton.addEventListener("click", onPlayGame);

        var editButton = document.createElement("button");
        editButton.setAttribute("class", "btn btn-secondary");
        editButton.setAttribute("value", gameInfo.id);
        editButton.textContent = "Edit";
        editButton.addEventListener("click", onEditGame);

        var exportButton = document.createElement("button");
        exportButton.setAttribute("class", "btn btn-secondary");
        exportButton.setAttribute("value", gameInfo.id);
        exportButton.textContent = "Export";
        exportButton.addEventListener("click", onExportGame);

     /*   var textExportButton = document.createElement("button");
        textExportButton.setAttribute("class", "btn btn-secondary");
        textExportButton.setAttribute("value", gameInfo.id);
        textExportButton.textContent = "Export Text";
        textExportButton.addEventListener("click", onExportText);*/

        var deleteSaveButton = document.createElement("button");
        deleteSaveButton.setAttribute("class", "btn btn-secondary");
        deleteSaveButton.setAttribute("value", gameInfo.id);
        deleteSaveButton.textContent = "Delete Save";
        deleteSaveButton.addEventListener("click", onDeleteGameSave);

        var description = document.createElement("span");
        description.textContent = gameInfo.description;

        col1.appendChild(title);
        col2.appendChild(playButton);
        col3.appendChild(editButton);
        col4.appendChild(exportButton);
       // col5.appendChild(textExportButton);
        col6.appendChild(deleteSaveButton);
        col7.appendChild(description);
    });

}
