//L'application requiert l'utilisation du module Express.
//La variable express nous permettra d'utiliser les fonctionnalités du module Express.
var express = require('express');
// Nous définissons ici les paramètres du serveur.
var hostname = '0.0.0.0';
var port = 3000;
// La variable mongoose nous permettra d'utiliser les fonctionnalités du module mongoose.
var mongoose = require('mongoose');
// options pour une connexion à la base
var options = { useNewUrlParser: true };
//URL de notre base
var urlmongo = "mongodb://mongo:27017/sunshare";
// Nous connectons l'API à notre base de données
mongoose.connect(urlmongo, options);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erreur lors de la connexion'));
db.once('open', function (){
    console.log("Connexion à la base OK");
});

// Nous créons un objet de type Express.
var app = express();
//L'application requiert l'utilisation du module bodyParser.
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// définition du schéma User de la base de données
var userSchema = mongoose.Schema({
    nom: String,
    adresse: String,
    tel: String,
    description: String
});
// instanciation d'un nouvel user
var User = mongoose.model('User', userSchema);
console.log(User);
// définition du schéma Data de la base de données
var dataSchema = mongoose.Schema({
    userid: String,
    date: String,
    time: String,
    inject: Number,
    soutir: Number,
    autoconso: Number,
    prod: Number,
    consocalc: Number
});
// instanciation d'un nouveau jeux de données
var Data = mongoose.model('Data', dataSchema);
console.log(Data);
// définition du schéma Team de la base de données
var teamSchema = mongoose.Schema({
    nom: String,
    rang: String,
    membres: Array
});
// instanciation d'une nouvelle équipe
var Team = mongoose.model('Team', teamSchema);

// définition du schéma Option de la base de données
var optionSchema = mongoose.Schema({
    key: String,
    value: String
});
// instanciation d'un nouvel user
var Option = mongoose.model('Option', optionSchema);
console.log(Option);
// définition du router
var myRouter = express.Router();
myRouter.route('/')
.all(function(req,res){
      res.json({message : "Bienvenue sur l'API Sunshare", methode : req.method});
});

// Routes des Users
myRouter.route('/users')
.get(function(req,res){
	User.find(function(err, users){
        if (err){
            res.send(err);
        }
        res.json(users);
    });
})
.post(function(req,res){
      var user = new User();
      user.nom = req.body.nom;
      user.adresse = req.body.adresse;
      user.tel = req.body.tel;
      user.description = req.body.description;
      user.save(function(err){
        if(err){
          res.send(err);
        }
        res.json({message : 'Bravo, la user est maintenant stockée en base de données'});
      });
});
myRouter.route('/users/:user_id')
.get(function(req,res){
    User.findById(req.params.user_id, function(err, user) {
        if (err)
            res.send(err);
        res.json(user);
    });
})
.put(function(req,res){
    User.findById(req.params.user_id, function(err, user) {
    if (err){
        res.send(err);
    }
      user.nom = req.body.nom;
      user.adresse = req.body.adresse;
      user.tel = req.body.tel;
      user.description = req.body.description;
        user.save(function(err){
          if(err){
            res.send(err);
          }
          res.json({message : 'Bravo, mise à jour des données OK'});
        });
    });
})
.delete(function(req,res){
    User.deleteOne({_id: req.params.user_id}, function(err, user){
        if (err){
            res.send(err);
        }
        res.json({message:"Bravo, utilisateur supprimée"});
    });
});

// Routes des Datas, les relevés d'énergies
myRouter.route('/datas')
.get(function(req,res){
	Data.find(function(err, datas){
        if (err){
            res.send(err);
        }
        res.json(datas);
    });
})
.post(function(req,res){
    var data = new Data();
    data.userid = req.body.userid;
    data.date = req.body.date;
    data.time = req.body.time;
    data.inject = req.body.inject;
    data.soutir = req.body.soutir;
    data.autoconso = req.body.autoconso;
    data.prod = req.body.prod;
    data.consocalc = req.body.consocalc;
    data.save(function(err){
      if(err){
        res.send(err);
      }
      res.json({message : 'Bravo, la donnée est maintenant stockée en base de données'});
    });
});
myRouter.route('/datas/:data_id')
.get(function(req,res){
    Data.findById(req.params.data_id, function(err, data) {
      if (err)
          res.send(err);
      res.json(data);
    });
})
.put(function(req,res){
    Data.findById(req.params.data_id, function(err, data) {
    if (err){
        res.send(err);
    }
      data.userid = req.body.userid;
      data.date = req.body.date;
      data.time = req.body.time;
      data.inject = req.body.inject;
      data.soutir = req.body.soutir;
      data.autoconso = req.body.autoconso;
      data.prod = req.body.prod;
      data.consocalc = req.body.consocalc;
      data.save(function(err){
        if(err){
          res.send(err);
        }
        res.json({message : 'Bravo, mise à jour des données OK'});
      });
    });
})
.delete(function(req,res){
    Data.deleteOne({_id: req.params.data_id}, function(err, data){
        if (err){
            res.send(err);
        }
        res.json({message:"Bravo, donnée supprimée"});
    });
});

// Routes des Teams
myRouter.route('/teams')
.get(function(req,res){
	Team.find(function(err, teams){
        if (err){
            res.send(err);
        }
        res.json(teams);
    });
})
.post(function(req,res){
      var team = new Team();
      team.nom = req.body.nom;
      team.rang = req.body.rang;
      team.membres = req.body.membres;
      team.save(function(err){
        if(err){
          res.send(err);
        }
        res.json({message : 'Bravo, la team est maintenant stockée en base de données'});
      });
});
myRouter.route('/teams/:team_id')
.get(function(req,res){
    Team.findById(req.params.team_id, function(err, team) {
        if (err)
            res.send(err);
        res.json(team);
    });
})
.put(function(req,res){
    Team.findById(req.params.team_id, function(err, team) {
    if (err){
        res.send(err);
    }
    team.nom = req.body.nom;
    team.rang = req.body.rang;
    team.membres = req.body.membres;
        team.save(function(err){
          if(err){
            res.send(err);
          }
          res.json({message : 'Bravo, mise à jour des données OK'});
        });
    });
})
.delete(function(req,res){
    Team.deleteOne({_id: req.params.team_id}, function(err, team){
        if (err){
            res.send(err);
        }
        res.json({message:"Bravo, team supprimée"});
    });
});


// Routes des Options
myRouter.route('/options')
.get(function(req,res){
	Option.find(function(err, options){
        if (err){
            res.send(err);
        }
        res.json(options);
    });
})
.post(function(req,res){
      var option = new Option();
      console.log(option);
      option.key = req.body.key;
      console.log(req.body);
      option.value = req.body.value;
      console.log(req.body.value);
      option.save(function(err){
        if(err){
          res.send(err);
        }
        res.json({message : 'Bravo, l\'option est maintenant stockée en base de données'});
      });
});
myRouter.route('/options/:option_id')
.get(function(req,res){
    Option.findById(req.params.option_id, function(err, option) {
        if (err)
            res.send(err);
        res.json(option);
    });
})
.put(function(req,res){
    Option.findById(req.params.option_id, function(err, option) {
    if (err){
        res.send(err);
    }
    option.key = req.body.key;
    option.value = req.body.value;
        option.save(function(err){
          if(err){
            res.send(err);
          }
          res.json({message : 'Bravo, mise à jour des données OK'});
        });
    });
})
.delete(function(req,res){
    Option.deleteOne({_id: req.params.option_id}, function(err, option){
        if (err){
            res.send(err);
        }
        res.json({message:"Bravo, option supprimée"});
    });
});


app.use(myRouter);
// lancement du serveur node
app.listen(port, hostname, function(){
	console.log("Mon serveur fonctionne sur http://"+ hostname +":"+port);
});
