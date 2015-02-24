/**
 * Created by micer on 2/22/15.
 */
var myAJAXSearch = {

    inputHandler: document.getElementById("searchArea"),
    acctKey: "AhLlAkkOGyJW6bPqjpbuyJzQaFODbaDxrKwKilID9yE",
    servOption: ["/Web", "/Image", "/News", "/Video"],
    searchSentence: undefined,
    option: {
        method: "GET",
        url: "https://api.datamarket.azure.com/Bing/Search/v1",
        type: "application/json"
    },

    init: function(){
        this.addEvent(this.inputHandler, "keyup", function(e){
            if(e.keyCode === 13){
                myAJAXSearch.searchSentence = encodeURIComponent("'" + document.getElementById("searchArea").value + "'");
                myAJAXSearch.option.url += myAJAXSearch.servOption[0]
                + "?$format=json&Query=" + myAJAXSearch.searchSentence;
                myAJAXSearch.ayncAJAX(myAJAXSearch.option, myAJAXSearch.ayncCallback);
            }
        });
    },

    addEvent: function(handler, event, func){
        handler.addEventListener(event, func);
    },

    ayncAJAX: function(option, callback){
        var request = new XMLHttpRequest();
        request.open(option.method, option.url);
        request.onreadystatechange = function(){
            if(request.readyState === 4 && callback){
                callback(request);
            }
        };
        request.setRequestHeader("Authorization", "Basic " + btoa("user:" + myAJAXSearch.acctKey));
        request.getResponseHeader("Content-Type");
        if(option.method !== "GET"){
            request.send(JSON.stringify(this.searchSentence));
        }else{
            request.send();
        }
    },

    ayncCallback: function(request){
        var result = document.getElementById("result");
        if(request.status === 200){
            result.textContent = request.responseText;
        }else{
            result.textContent = request.statusText;
        }
    }
};

myAJAXSearch.init();