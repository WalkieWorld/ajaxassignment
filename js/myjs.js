/**
 * Created by micer on 2/22/15.
 */
var myAJAXSearch = {

    inputHandler: document.getElementById("searchArea"),

    init: function(){
        this.addEvent(this.inputHandler, "keyup", function(e){
            if(e.keyCode === 13){
                //
            }
        });
    },

    addEvent: function(handler, event, func){
        handler.addEventListener(event, func);
    }
};

myAJAXSearch.init();