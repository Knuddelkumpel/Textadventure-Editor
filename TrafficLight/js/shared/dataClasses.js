class Node {
    constructor(id) {
        this.id = id;
        this.name = "Node "+ id;
        this.coordinates = new Coord(0,0);

        this.prompts = [];
        this.options = [];
        this.unlockPlaces = [];
        this.nodePlace = null;

        this.isCondition = false;
    }
}

class ConditionNode {
    constructor(id) {
        this.id = id;       
        this.name = "Node "+ id;
        this.coordinates = new Coord(0,0);

        this.isCondition = true;
        this.conditions = [];
        this.conditionElseNodeId = null;
    }
}

class Condition{
    constructor(){
        this.requiredNodeIds = [];
        //this.conditionOptionIds = [];
        this.nodeId = null;
    }
}

class NodePlace{
    constructor(){
        this.imageId = -1;
        this.placeId = -1;
    }
}
class Prompt {
    constructor(id = null) {
        this.id = id ? id : -1;
        this.text = "";
        this.actorId = null;
        this.textlinkNodeIds = [];

        //source
        this.sourceId = null;
        this.isDirectQuote = false;
        this.isTranslated = false;
        this.isParaphrased = false;
        this.sourceDetails = "";
    }
}

class Option {
    constructor(id = null) {
        this.id = id ? id : -1;
        this.text = "";
        this.nodeId = null;
        this.isAutoOption = false;
        this.preventNodePrompts = false;
    }
}
class Coord {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
class Game {
    constructor(id = null) {
        this.id = id;
        this.name = "New Game";
        this.description = "";
        this.nodes = [];
        this.actors = [];
        this.images = [];
        this.sources = [];
        this.firstNodeId = null;
        this.version = "";
    }
}

class Actor{
    constructor(id) {
        this.id = id;
        this.name = "";
        this.color = "red"
    }
}

class PlaceImage{
    constructor(path = ""){
        this.path = path ? path : "";
        this.places = [];
    }
}

class Place{
    constructor(id = null, name = null){
        this.id = id ? id : -1;
        this.name = name ? name : "EMPTY PLACE";
        this.locked = true;
        this.nodeId = -1;
    }
}

class SaveGame{
    constructor(){
        this.entries = [];
    }
}

class SaveGameEntry{
    constructor(type, id){
        this.type = type;
        this.id = id;
    }
}

class Source{
    constructor(id = null){
        this.id = id ? id : -1;
        this.number = "";
        this.name = "";
        this.value = "";
        this.author = "";
        this.title = "";
        this.publisher = "";
        this.publicationDate = "";
        this.type = "";
        this.accessDate = "";
        this.in = "";
        this.link = "";
        this.doi = "";
        this.isbn = "";
    }
}

export {
    Node,
    Prompt, 
    Option, 
    ConditionNode, 
    Condition, 
    Coord, 
    Game, 
    Actor, 
    PlaceImage, 
    Place, 
    NodePlace, 
    SaveGame, 
    SaveGameEntry, 
    Source
};
