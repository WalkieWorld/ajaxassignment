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
        basicWindowFeature: "menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes",
        renderHtml: [],
        basicUrl: "https://api.datamarket.azure.com/Bing/Search/v1",
        openBingUrl: "http://www.bing.com/search?q=",
        option: {
            method: "GET",
            url: "",
            type: "application/json"
        },

        init: function () {
            this.addEvent(this.inputHandler, "keyup", function (e) {
                MyAJAXSearch.searchSentence = encodeURIComponent("'" + document.getElementById("searchArea").value + "'");
                MyAJAXSearch.option.url = MyAJAXSearch.basicUrl + MyAJAXSearch.servOption[0]
                + "?$format=json&$top=15&Query=" + MyAJAXSearch.searchSentence;
                MyAJAXSearch.ayncAJAX(MyAJAXSearch.option, MyAJAXSearch.ayncCallback);
                if (e.keyCode === 13) {
                    MyAJAXSearch.openInBing();
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
                MyAJAXSearch.resetResult();
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
                a.href = MyAJAXSearch.openBingUrl + curVal.Title.replace(/\s/, "+");
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
        },
        resetResult: function(){
            if (MyAJAXSearch.renderHtml.length !== 0) {
                MyAJAXSearch.renderHtml.forEach(function(curVal, index, arr){
                    document.getElementById("result").removeChild(curVal);
                });
                MyAJAXSearch.renderHtml = [];
                MyAJAXSearch.option.url = "";
                MyAJAXSearch.searchSentence = undefined;
            }
        },
        openInBing: function(){
            MyAJAXSearch.searchSentence = MyAJAXSearch.searchSentence.replace(/\s/, "+" );
            MyAJAXSearch.searchSentence = MyAJAXSearch.searchSentence.replace(/'+/g, "" );
            var fullOpenUrl = MyAJAXSearch.openBingUrl + MyAJAXSearch.searchSentence;
            window.open(fullOpenUrl, "_blank", MyAJAXSearch.basicWindowFeature);
        }
    };
    //MyAJAXSearch.init();

    var MyJqueryAJAXSearch = {
        basicUrl: "http://api.bing.net/qson.aspx?Query=",
        requiredPare: "&JsonType=callback&JsonCallback=?",
        fullUrl: undefined,
        init: function(){
            $('#btnSearch').on('click', function(){
                MyAJAXSearch.searchSentence = document.getElementById("searchArea").value;
                MyAJAXSearch.openInBing();
            });
            $('#searchArea').on('keyup', function(e){
                MyAJAXSearch.searchSentence = document.getElementById("searchArea").value;
                MyAJAXSearch.fullUrl
                    = MyJqueryAJAXSearch.basicUrl + document.getElementById("searchArea").value + MyJqueryAJAXSearch.requiredPare;
                MyJqueryAJAXSearch.getData();
                if (e.keyCode === 13) {
                    MyAJAXSearch.openInBing();
                }
            });
        },
        renderResult: function(jsonData){
            var section = document.createElement("section");
            var ul = document.createElement("ul");
            section.classList.add("background");
            $.each(jsonData.SearchSuggestion.Section, function(index, curVal){
                var li = document.createElement("li");
                var a = document.createElement("a");
                a.href = MyAJAXSearch.openBingUrl + curVal.Text.replace(/\s/, "+");
                a.textContent = curVal.Text;
                a.target = "_blank";
                li.appendChild(a);
                ul.appendChild(li);
            });
            MyAJAXSearch.renderHtml.push(section);
            MyAJAXSearch.renderHtml.push(ul);
            $.each(MyAJAXSearch.renderHtml, function(index, curVal){
                document.getElementById("result").appendChild(curVal);
            });
        },
        /**
         * This function is for getting Bing Search Suggestions.
         * */
        getData: function(){
            $.ajax({
                type: "GET",
                url: MyAJAXSearch.fullUrl,
                dataType: "json"
            })
                .done(function(data){
                    MyAJAXSearch.resetResult();
                    MyJqueryAJAXSearch.renderResult(data);
                });
        }
    };
    MyJqueryAJAXSearch.init();
});