import { Actor, Game, Node, ConditionNode, Option, Prompt, SaveGame , SaveGameEntry, Condition, Source} from "./dataClasses.js";

var currentGame;
var currentGameId;
var currentSaveGame;

const keyPrefixGame = "Game_";
const keyPrefixSaveGame = "SaveGame_";


function getNewId(elements, min = 0){
    var newId = min;
    elements.forEach(element => {
        newId = Math.max(newId, parseInt(element.id));
    });
    return newId + 1;
}

function getNewActorId() {
    var max = 0;
    currentGame.actors.forEach(actor => {
        max = Math.max(max, parseInt(actor.id));
    });
    return max + 1;
}
function getNewSourceId() {
    return getNewId(currentGame.sources);
}
function getNewNodeId() {
    var max = 0;
    currentGame.nodes.forEach(node => {
        max = Math.max(max, parseInt(node.id));
    });
    return max + 1;
}
function getNewOptionId() {
    var max = 0;
    currentGame.nodes.forEach(node => {
        node.options?.forEach(option => {
            max = Math.max(max, parseInt(option.id));
        });
    });
    return max + 1;
}
function getNewPromptId() {
    var max = 0;
    currentGame.nodes.forEach(node => {
        node.prompts?.forEach(prompt => {
            if(prompt.id != null)
                max = Math.max(max, parseInt(prompt.id));
        });
    });
    return max + 1;
}
function getNewConditionId() {
    var max = 0;
    currentGame.nodes.forEach(node => {
        node.conditions?.forEach(condition => {
            if(condition.id != null)
                max = Math.max(max, parseInt(condition.id));
        });
    });
    return max + 1;
}
function getNewGameId() {
    var max = 1;
    getBasicGameInfos().forEach(game => {
        max = Math.max(max, parseInt(game.id));
    });
    return max + 1;
}

function addGame(){
    var newId = getNewGameId();
    var game = new Game(newId);
    saveGame(game);

    return game;
}

function addNode(){
    var newId = getNewNodeId();
    var node = new Node(newId);
    currentGame.nodes.push(node);
    if(currentGame.firstNodeId == null)
        currentGame.firstNodeId = node.id;
    return node;
}

function addConditionNode(){
    var newId = getNewNodeId();
    var node = new ConditionNode(newId);
    currentGame.nodes.push(node);
    return node;
}

function getOrAddActor(actorId){

    var newActor = findActorById(actorId);

    if(newActor != null){
        return newActor;
    }
    else{
        var newId = getNewActorId();
        var newActor = new Actor(newId);
        currentGame.actors.push(newActor);
        return newActor;
    }
}

function getOrAddSource(sourceId){

    var source = findSourceById(sourceId);

    if(source != null){
        return source;
    }
    else{
        var newId = getNewSourceId();
        var source = new Source(newId);
        currentGame.sources.push(source);
        return source;
    }
}

function getOrAddOption(node, optionId){

    var option = node.options.find(option => option.id == optionId);

    if(option != null){
        return option;
    }
    else{
        var newId = getNewOptionId();
        var newOption = new Option(newId);
        node.options.push(newOption)
        return newOption;
    }
}

function getOrAddPrompt(node, promptId){

    var prompt = node.prompts.find(prompt => prompt.id == promptId);

    if(prompt != null){
        return prompt;
    }
    else{
        var newId = getNewPromptId();
        var newPrompt = new Prompt(newId);
        node.prompts.push(newPrompt)
        return newPrompt;
    }
}

function getOrAddCondition(node, conditionId){

    var condition = node.conditions.find(condition => condition.id == conditionId);

    if(condition != null){
        return condition;
    }
    else{
        var newId = getNewConditionId();
        var newCondition = new ConditionNode(newId);
        node.conditions.push(newCondition)
        return newCondition;
    }
}




function addSaveGameEntryForOption(option){
    var entry = new SaveGameEntry("Option", option.id);
    addSaveGameEntry(entry);
}
function addSaveGameEntryForNode(node){
    var entry = new SaveGameEntry("Node", node.id);
    addSaveGameEntry(entry);
}

function addSaveGameEntryForTextJump(nodeId){
    var entry = new SaveGameEntry("TextJump", nodeId);
    addSaveGameEntry(entry);
}
function addSaveGameEntryForImageJump(nodeId){
    var entry = new SaveGameEntry("ImageJump", nodeId);
    addSaveGameEntry(entry);
}
function addSaveGameEntryForOverviewJump(nodeId){
    var entry = new SaveGameEntry("OverviewJump", nodeId);
    addSaveGameEntry(entry);
}
function addSaveGameEntryForLogJump(nodeId){
    var entry = new SaveGameEntry("LogJump", nodeId);
    addSaveGameEntry(entry);
}

function getSaveGameEntriesForType(type){
    return currentSaveGame.entries.filter(entry =>
        entry.type == type
    );
}

function saveGameIncludesNode(nodeId){
    var nodeEntries = getSaveGameEntriesForType("Node"); 
    return nodeEntries.find(entry => entry.id.toString() == nodeId) != null
}

function findLastSaveGameNodeId(){
    var nodeEntries = getSaveGameEntriesForType("Node"); 
    return nodeEntries[nodeEntries.length -1]?.id;
}


function addSaveGameEntry(entry){
    currentSaveGame.entries.push(entry);
    saveCurrentSaveGame();
}

function saveCurrentSaveGame(){
    var key = getCurrentSaveGameKey(currentGameId);
    localStorage.setItem(key, JSON.stringify(currentSaveGame));
}
function loadCurrentSaveGame(){
    var key = getCurrentSaveGameKey(currentGameId);
    var jsonString = localStorage.getItem(key);
    currentSaveGame = (jsonString != null)
    ? JSON.parse(jsonString)
    : new SaveGame();
}
function deleteSaveGame(gameId){
    var key = getCurrentSaveGameKey(gameId);
    localStorage.removeItem(key)
}

function getCurrentSaveGameKey(gameId){
    return keyPrefixSaveGame + gameId;
}
function getCurrentGameKey(gameId){
    return keyPrefixGame + gameId;
}


function saveGame(game) {
    var key = getCurrentGameKey(game.id);
    localStorage.setItem(key, JSON.stringify(game));
}
function saveCurrentGame(){
    saveGame(currentGame);
}

function loadGame(gameId){
    var key = getCurrentGameKey(gameId);
    var jsonString = localStorage.getItem(key);

    return (jsonString != null)
    ? JSON.parse(jsonString)     
    : new Game();
}

function loadCurrentGame() {
    currentGameId = localStorage.getItem("currentGameId");
    currentGame = loadGame(currentGameId);
}


function getBasicGameInfos(){
    var basicGameInfos = [];

    var keys = Object.keys(localStorage);
    var gameKeys = keys.filter(key => key.startsWith(keyPrefixGame));

    gameKeys.forEach(key => {
        var jsonString = localStorage.getItem(key);
        var game = JSON.parse(jsonString);
        basicGameInfos.push({
            "id": game.id,
            "name" : game.name,
            "description" : game.description,
            "version" : game.version,
        });
    });
    basicGameInfos.sort((a, b) => a.id - b.id);
    
    return basicGameInfos;
}


function saveCurrentGameId(id){
    localStorage.setItem("currentGameId", id);
}

function findById(elements, id){
    return elements?.find(element => element.id == id);
}

function findNodeById(id) {
    return findById(currentGame.nodes, id);
}
function findActorById(id) {
    return findById(currentGame.actors, id);
}
function findSourceById(id) {
    return findById(currentGame.sources, id);
}

function findOptionById(id) {
    var option;
    currentGame.nodes.every(node => {
        option = findById(node.options, id);
        return (option == null);        
    });
    return option;
}

function findOptionByNodeId(nodeId) {
    var options = [];
    currentGame.nodes.forEach(node => {
        node.options?.forEach(option => {   
            if(option.nodeId == nodeId)
                options.push(option);
        });
    });
    return options;
}

function findConditionByNodeId(nodeId) {
    var conditions = [];
    currentGame.nodes.forEach(node => {
        node.conditions?.forEach(condition => {   
            if(condition.nodeId == nodeId)
                conditions.push(condition);
        });
    });
    return conditions;
}

function findPromptsByTextlinkNodeIds(nodeId) {
    var prompts = [];
    currentGame.nodes.forEach(node => {
        node.prompts?.forEach(prompt => {   
            if(prompt.textlinkNodeIds.find(id => id == nodeId))
                prompts.push(prompt);
        });
    });
    return prompts;
}

function findNodeForOptionId(optionId){
    return currentGame.nodes.find(node => {
        var option = node.options.find(option => option.id == optionId);
        if(option != null) return node;        
    });
}

function findImageByPath(path) {
    return currentGame.images.find(image => image.path == path);
}



export{
    currentGame, 
    currentSaveGame,
    loadGame,
    loadCurrentGame, 
    loadCurrentSaveGame,
    findNodeById,
    findOptionById,
    findActorById,
    findSourceById,
    findOptionByNodeId,
    findConditionByNodeId,
    findNodeForOptionId,
    findPromptsByTextlinkNodeIds,
    findImageByPath,
    findLastSaveGameNodeId,
    addGame,
    addNode,
    addConditionNode,
    addSaveGameEntryForNode,
    addSaveGameEntryForOption,
    addSaveGameEntryForTextJump,
    addSaveGameEntryForImageJump,
    addSaveGameEntryForOverviewJump,
    addSaveGameEntryForLogJump,
    getOrAddActor,
    getOrAddOption,
    getOrAddPrompt,
    getOrAddCondition,
    getOrAddSource,
    saveCurrentGame,
    saveCurrentGameId,
    saveGame,
    getBasicGameInfos,
    deleteSaveGame,
    saveGameIncludesNode    
};