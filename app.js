//L'application requiert l'utilisation de node modules.
//La variable express nous permettra d'utiliser les fonctionnalités du module Express.
var express = require('express');
var cors = require('cors')
var mongoose = require('mongoose');
var bodyParser = require("body-parser");
var app = express();
// cors est utilisé dans les requêtes http
app.use(cors())
// bodyparser permet de manipuler les requêtes et réponses http
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// paramètres du serveur.
var hostname = '0.0.0.0';
var port = 3000;
// mongoose permet d'interragir avec la base de données
var options = { useNewUrlParser: true };
var urlmongo = "mongodb://mongo:27017/sunshare";
mongoose.connect(urlmongo, options);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erreur lors de la connexion'));
db.once('open', function (){
    console.log("Connexion à la base OK");
});


/****************** MODELS ***************************/
// définition du schéma User de la base de données
var userSchema = mongoose.Schema({
    nom: String,
    adresse: String,
    tel: String,
    description: String,
    userid: Number
});
// instanciation d'un nouvel user
var User = mongoose.model('User', userSchema);
// définition du schéma Data de la base de données
var dataSchema = mongoose.Schema({
    userid: Number,
    journee: String,
    time: String,
    inject: Number,
    soutir: Number,
    autoconso: Number,
    prod: Number,
    consocalc: Number,
    annee : Number,
    mois_1 : Number,
    jour : Number,
    heure : Number,
    min : Number,
    sec : Number
});
// instanciation d'un nouveau jeux de données
var Data = mongoose.model('Data', dataSchema);
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

/****************** ROUTES ***************************/
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
      user.userid = parseInt(req.body.userid);
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
    user.userid = parseInt(req.body.userid);
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
    data.userid = parsInt(req.body.userid);
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
    data.userid = parsInt(req.body.userid);
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
myRouter.route('/datas/user/:user_id')
.get(function(req,res){
    Data.find({ userid : req.params.user_id}, function(err, datas) {
      if (err)
          res.send(err);
      //datas = makeItPretty(datas);
      res.json(datas);
    });
})
myRouter.route('/datas/user/:user_id/:data_date')
.get(function(req,res){
    Data.find({ userid : req.params.user_id, journee: req.params.data_date}, function(err, datas) {
      if (err)
          res.send(err);
      datas = makeItPretty(datas);
      res.json(datas);
    });
})

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
      option.key = req.body.key;
      option.value = req.body.value;
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

/****************** ENEDIS ***************************/
// route de reception des données envoyées par ENEDIS
// ajouter l'id de la requête en cours comme variable
var current_userid = 2;
myRouter.route('/datas/receive')
.post(function(req, res){
  // récupération des données
  var item = req.body;
  var type = item.usage_point[0].reading_type.measurement_kind;
  var values = item.usage_point[0].interval_reading;
  // mise en forme
  var delay = getHours(values);
  var today = new Date();
  var year = today.getFullYear();
  var month = today.getMonth();
  var day = today.getDate();
  var hours = today.getHours();
  var minutes = today.getMinutes();
  var secondes = today.getSeconds();

  values.forEach(function(element){
    var data = new Data();
    data.userid = current_userid;
    data.date = year+"-"+month+"-"+day;
    data.time = hours+"-"+minutes+"-"+secondes;
    data.soutir = element.value;
    // les données en commentaire ne sont pas encore reçues depuis enedis, à mettre à jour quand l'api le permettra
    //data.inject = ;
    //data.autoconso = ;
    //data.prod = ;
    //data.consocalc = ;
    data.save(function(err){
      if(err){
        res.send(err);
      }
    });
  })
  res.json({message : "les données de l'utilisateur n° "+current_userid+" ont bien été enregistrées pour la période : "+delay})
})

// mise en forme horaire des indicateurs "rank" de enedis
function getHours(array){
  var target = []; var hour = ""; var minutes = "";
  array.forEach(function(element){
    hour = Math.floor(element.rank/2) + "H";
    if ((element.rank % 2) != 0){ minutes = 30;}
    target.push(" "+hour+minutes);
  })
  return target;
}

/****************** DASHBOARD ***************************/
// mise en forme des données pour le front serousgame
function makeItPretty(datas){
  var tableGraphConso = [];
  // le tableau de bord attend un tableau au format [heure, conso, injection, autoconso]
  datas.sort(SortTime);
  datas.forEach(function(element){
    tableGraphConso.push([element.heure+"H"+element.min, element.soutir , element.prod, Math.abs(element.autoconso)])
  })
  return tableGraphConso;
}
// trie horaire du tableau de données journalières
function SortTime(a,b){
  da=a.time;
  db=b.time;
  return (da>db)?1:-1;
}

/****************** LANCEMENT APPLICATION ***************************/
app.use(myRouter);
// lancement du serveur node
app.listen(port, hostname, function(){
	console.log("Mon serveur fonctionne sur http://"+ hostname +":"+port);
});
