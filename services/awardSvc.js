function addMsgCounter(){
    var counter = 0;            //Initialize counter 
    counter += 1;
    return counter;
}

//var MongoClient = require('').MongoClient;
//var url = "";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let DailyUserPostCounterSchema = new Schema({
    gmeUserId: {type: Number, required: true},
    gmeGroupId: {type: Number, required: true},
    messageCount: {type: Number, required: true},
    date: {type: Date, required: true},
});

var User =   mongoose.model('DailyUserPostCounter', DailyUserPostCounterSchema);
// Export the model
module.exports = User;

/* look up mongo syntax,

groupmeuserid: , date: ,

*/

// get user
function getUser(){
    return this.User;
}

//sort and rank
var array = []
function swap(array, i, j){
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
}
function sSort(array){
    for(var i = 0; i < array.length; i++){
        var min = i;
        for(var j = i + 1; j < array.length; j++){
            if(array[j] < array[min]){
                min = j;
            }
        }
    }
    if(i !== min){
        swap(array, i, min);
    }
}
return array;

function rankUser(){
    var 
}