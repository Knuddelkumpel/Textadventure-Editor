function loadFileFromServer(path) {
    var response = "";
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            response = this.responseText;
        }
    };
    xmlhttp.open("GET", path, false);
    xmlhttp.setRequestHeader("Cache-Control", "no-cache, no-store, max-age=0");
    xmlhttp.send();
    return response;
}

export {loadFileFromServer}
