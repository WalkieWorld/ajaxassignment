/**
 * Created by micer on 2/22/15.
 */
var myAJAXSearch = {

    inputHandler: document.getElementById("searchArea"),
    acctKey: "AhLlAkkOGyJW6bPqjpbuyJzQaFODbaDxrKwKilID9yE",
    servOption: ["/Web", "/Image", "/News", "/Video"],
    searchSentence: undefined,
    resultObj: undefined,
    renderHtml: undefined,
    option: {
        method: "GET",
        url: "https://api.datamarket.azure.com/Bing/Search/v1",
        type: "application/json"
    },

    init: function(){
        this.addEvent(this.inputHandler, "keyup", function(e){
            if(e.keyCode === 13){
                if(myAJAXSearch.renderHtml !== undefined){
                    document.getElementById("result").removeChild(myAJAXSearch.renderHtml);
                }
                myAJAXSearch.searchSentence = encodeURIComponent("'" + document.getElementById("searchArea").value + "'");
                myAJAXSearch.option.url += myAJAXSearch.servOption[0]
                + "?$format=json&$top=15&Query=" + myAJAXSearch.searchSentence;
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
            myAJAXSearch.resultObj = JSON.parse(request.responseText);
            myAJAXSearch.renderResult(myAJAXSearch.resultObj);
        }else{
            result.textContent = request.statusText;
        }
    },

    renderResult: function(jsonData){
        var section = document.createElement("section");
        var ul = document.createElement("ul");
        jsonData.d.results.forEach(function(curVal, index, arr){
            var li = document.createElement("li");
            var a = document.createElement("a");
            a.href = curVal.Url;
            a.textContent = curVal.Title;
            a.target="_blank";
            var p = document.createElement("p");
            p.textContent = curVal.Description;
            li.appendChild(a);
            li.appendChild(p);
            ul.appendChild(li);
        });
        section.appendChild(ul);
        myAJAXSearch.renderHtml = section;
        document.getElementById("result").appendChild(myAJAXSearch.renderHtml);
    }
};

myAJAXSearch.init();