EveOnline = Meteor.npmRequire('eveonlinejs'); 

var path = Meteor.npmRequire('path');
var sqlite3 = Meteor.npmRequire('sqlite3');
var currentDir = path.resolve('.');
var baseDir = currentDir.split('.meteor')[0];
console.log("Base directory of this project is " + baseDir);

EveDatabase = new sqlite3.Database(baseDir + 'private/world_data.sqlite');
