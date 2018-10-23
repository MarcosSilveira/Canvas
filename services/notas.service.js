var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('notas');

var service = {};

service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;

module.exports = service;


function getById(_id) {
    var deferred = Q.defer();

    db.notas.findById(_id, function (err, nota) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (nota) {
            
            deferred.resolve(nota);
        } else {
            //not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}
//function create(userParam, notaParam) {
function create() {
    var deferred = Q.defer();

 //   if(db.notas.find({}).sort({_id:-1}).limit(1)) {
//
//   } else {
        
//    }
//    notaParam.id = nota.id+1;
//    notaParam.dono = userParam.id;
//    notaParam.canvas = 1;
    console.log('Criando nota');
    var nota ={id:0,text:'',canvas:0,cor:'',posicao:4};
    nota.id = 1;
    nota.text = 'Texto do post it';
    nota.canvas = 1;
    nota.cor = 'ABCBAV';
    nota.posicao=4; 
    db.notas.insert(
        nota,
        function (err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });


    return deferred.promise;
}

function update(_id, userParam) {
    var deferred = Q.defer();

    // validation
    db.users.findById(_id, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user.username !== userParam.username) {
            // username has changed so check if the new username is already taken
            db.users.findOne(
                { username: userParam.username },
                function (err, user) {
                    if (err) deferred.reject(err.name + ': ' + err.message);

                    if (user) {
                        // username already exists
                        deferred.reject('Username "' + req.body.username + '" is already taken')
                    } else {
                        updateUser();
                    }
                });
        } else {
            updateUser();
        }
    });

    function updateUser() {
        // fields to update
        var set = {
            firstName: userParam.firstName,
            lastName: userParam.lastName,
            username: userParam.username,
        };

        // update password if it was entered
        if (userParam.password) {
            set.hash = bcrypt.hashSync(userParam.password, 10);
        }

        db.users.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: set },
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();

    db.users.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}