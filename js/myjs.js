/**
 * Created by micer on 2/22/15.
 */
$(function() {
    var MyAJAXSearch = {

        inputHandler: document.getElementById("searchArea"),
        acctKey: "AhLlAkkOGyJW6bPqjpbuyJzQaFODbaDxrKwKilID9yE",
        servOption: ["/Web", "/Image", "/News", "/Video"],
        searchSentence: undefined,
        resultObj: undefined,
        renderHtml: [],
        basicUrl: "https://api.datamarket.azure.com/Bing/Search/v1",
        option: {
            method: "GET",
            url: "",
            type: "application/json"
        },

        init: function () {
            this.addEvent(this.inputHandler, "keyup", function (e) {
                if (e.keyCode === 13) {
                    if (MyAJAXSearch.renderHtml.length !== 0) {
                        MyAJAXSearch.renderHtml.forEach(function(curVal, index, arr){
                            document.getElementById("result").removeChild(curVal);
                        });
                        MyAJAXSearch.renderHtml = [];
                        MyAJAXSearch.option.url = "";
                    }
                    MyAJAXSearch.searchSentence = encodeURIComponent("'" + document.getElementById("searchArea").value + "'");
                    MyAJAXSearch.option.url = MyAJAXSearch.basicUrl + MyAJAXSearch.servOption[0]
                    + "?$format=json&$top=15&Query=" + MyAJAXSearch.searchSentence;
                    MyAJAXSearch.ayncAJAX(MyAJAXSearch.option, MyAJAXSearch.ayncCallback);
                }
            });
        },

        addEvent: function (handler, event, func) {
            handler.addEventListener(event, func);
        },

        ayncAJAX: function (option, callback) {
            var request = new XMLHttpRequest();
            request.open(option.method, option.url);
            request.onreadystatechange = function () {
                if (request.readyState === 4 && callback) {
                    callback(request);
                }
            };
            request.setRequestHeader("Authorization", "Basic " + btoa("user:" + MyAJAXSearch.acctKey));
            request.getResponseHeader("Content-Type");
            if (option.method !== "GET") {
                request.send(JSON.stringify(this.searchSentence));
            } else {
                request.send();
            }
        },
        // this is callback function for the ajax function
        ayncCallback: function (request) {
            var result = document.getElementById("result");
            if (request.status === 200) {
                MyAJAXSearch.resultObj = JSON.parse(request.responseText);
                MyAJAXSearch.renderResult(MyAJAXSearch.resultObj);
            } else {
                result.textContent = request.statusText;
            }
        },
        // render result by generating html dynamically
        renderResult: function (jsonData) {
            var section = document.createElement("section");
            var ul = document.createElement("ul");
            section.classList.add("background");
            jsonData.d.results.forEach(function (curVal, index, arr) {
                var li = document.createElement("li");
                var a = document.createElement("a");
                a.href = curVal.Url;
                a.textContent = curVal.Title;
                a.target = "_blank";
                var p = document.createElement("p");
                p.textContent = curVal.Description;
                li.appendChild(a);
                li.appendChild(p);
                ul.appendChild(li);
            });
            MyAJAXSearch.renderHtml.push(section);
            MyAJAXSearch.renderHtml.push(ul);
            MyAJAXSearch.renderHtml.forEach(function(curVal, index, arr){
                document.getElementById("result").appendChild(curVal);
            });
        }
    };
    MyAJAXSearch.init();

    var MyJqueryAJAXSearch = {
        init: function(){
            $('#btnSearch').on('click', this.getData);
        },
        getData: function(){
            if (MyAJAXSearch.renderHtml.length !== 0) {
                MyAJAXSearch.renderHtml.forEach(function(curVal, index, arr){
                    document.getElementById("result").removeChild(curVal);
                });
                MyAJAXSearch.renderHtml = [];
            }
            MyAJAXSearch.searchSentence = encodeURIComponent("'" + document.getElementById("searchArea").value + "'");
            var fullUrl = MyAJAXSearch.basicUrl + MyAJAXSearch.servOption[0]
                + "?$format=json&$top=15&Query=" + MyAJAXSearch.searchSentence;
            $.ajax({
                type: MyAJAXSearch.option.method,
                url: fullUrl,
                dataType: "json",
                headers: {
                    "Authorization": "Basic " + btoa("user:" + MyAJAXSearch.acctKey)
                }
            })
                .done(function(data){
                    MyAJAXSearch.renderResult(data);
                });
        }
    };
    MyJqueryAJAXSearch.init();
});