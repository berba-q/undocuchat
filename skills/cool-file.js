/*

Botkit Studio Skill module to enhance the "catch all" script

*/
var distance = require('google-distance');
var firebase = require('firebase');
var condition = false;
var location = false;

module.exports = function(controller) {
    // define a before hook
    // you may define multiple before hooks. they will run in the order they are defined.
    // See: https://github.com/howdyai/botkit/blob/master/docs/readme-studio.md#controllerstudiobefore
  var app = firebase.initializeApp({ 
    apiKey: "AIzaSyCK_e6l_QL9iJOFU7d6DYV1cvzfTh1p46I",
    authDomain: "atlasbin-a35e8.firebaseapp.com",
    databaseURL: "https://atlasbin-a35e8.firebaseio.com",
    projectId: "atlasbin-a35e8",
    storageBucket: "",
    messagingSenderId: "312297953191"
  
  });
 /* 
  firebase.database().ref('clinics/').push({
    name: "Everett C. Wilcox Health Center",
    location: "226 Buttonwoods Ave Warwick, Rhode Island",
    conditions: "Behavioral Health, Cancer, Community Health, Dental Services, Diabetes, Pregnant, Family Health, Family Planning, Heart Disease, Housing Services, Pharmacy, Pregnancy, Primary Health Care, "
  });
  
    firebase.database().ref('clinics/').push({
    name: "Valley Homeless Clinic",
    location: "2101 Alexian Dr San Jose, California 95116-1901",
    conditions: "Dental Services, Emergency Services, Mental Health, Primary Health Care, Social Services, STDs, and Substance Abuse"
  });*/
   controller.hears(['.*'], 'message_received', function(bot, message) {

       
         
          
            for (var key in message) {
  //console.log(key);
              
            }
          console.log("text: " + message.user);
          var input = message.intents[0]._text;
     
     
          if(input.indexOf("clear") > -1 || input.indexOf("Clear") > -1 || input.indexOf("exit") > -1 || input.indexOf("quit") > -1 || input.indexOf("Quit") > -1 || input.indexOf("Exit") > -1) {
bot.reply(message,"Clearing your history.");
                var ref = firebase.database().ref('users/' + message.user)
ref.remove();   
            
          }else
          if(input.indexOf("Help") > -1 || input.indexOf("help") > -1 || input.indexOf("hello") > -1 || input.indexOf("hi") > -1 || input.indexOf("Hi") > -1 || input.indexOf("Hello") > -1 || input.indexOf("Hola") > -1 || input.indexOf("hola") > -1) {
bot.reply(message,"Hello! Please tell me where you are, and what your medical concern is. ¡Hola! Por favor, dime dónde estás, y cuál es tu preocupación médica.");
                    
}else{
          
          
          for (var key in message.intents[0].entities) {
  //console.log(key);
            if(key == "Conditions" && message.intents[0].entities.Conditions[0].confidence > .7){
                      condition= true;         
                              console.log("ent:" + message.intents[0].entities.Conditions[0].value);
              firebase.database().ref('users/' + message.user).update({
    condition: message.intents[0].entities.Conditions[0].value
    });
              
              

            }
            
           
}
     
        for (var key in message.intents[0].entities ) {
  //console.log(key);
                
                
                
                
            if(key == "location" && message.intents[0].entities.location[0].confidence > .9 ){
                            firebase.database().ref('users/' + message.user).update({
    location: message.intents[0].entities.location[0].value 
    });
               
               
               }
               
               
  }
     
     
        var userRef = firebase.database().ref('users/' + message.user);
userRef.once('value', function(snapshotGrand) {
    if (snapshotGrand.hasChild("condition")){
  if (snapshotGrand.hasChild("location")){

    console.log('Both');
          
            bot.reply(message, "I'm sorry to hear that. It looks like you have a medical condition: " + snapshotGrand.child('condition').val() + ". If this is an emergency, please proceed to the nearest ER. They are required to stabalize you regardless of immigration status by federal law.");
              
            bot.reply(message, 'You are located at: ' + snapshotGrand.child('location').val() + '. Please wait while I search for the nearest clinic');
            condition= true;  
            var userCondition = snapshotGrand.child('condition').val() ;
            var starCountRef = firebase.database().ref('clinics/');
            starCountRef.once('value', function(snapshot) {

                     snapshot.forEach(function (snapshot2) {

                                 console.log(snapshot2.child('conditions').val());
                                  var conditions = snapshot2.child('conditions').val();
                                  var partsOfStr = conditions.split(',');
                                  for (var i = 0; i < partsOfStr.length; i++) {
                                    console.log(partsOfStr[i].replace(/\s/g,''));
                                    console.log(userCondition);
                                    if(partsOfStr[i].toUpperCase().replace(/\s/g,'') === userCondition.toUpperCase()){
                                        distance.get(
                                  {
                                    origin: snapshotGrand.child('location').val() ,
                                    destination: snapshot2.child('location').val()
                                  },
                                  function(err, data) {
                                    if (err) return console.log(err);
                                           bot.reply(message, 'I have found a match! The closest clinic which supports your condition is ' + snapshot2.child('name').val() + ' located at ' + snapshot2.child('location').val() + '. It is ' + data.duration +  ' away. You can call them at: ' + snapshot2.child('phone').val() + ' . To clear your history, type clear, quit, or exit.');

                                    console.log(data);
                                });

                                      console.log('FOUND MATCH' + partsOfStr[i]);
                                    }
                                    //Do something
                                }

                                });

            });
            
              console.log(location)
        }else{
            bot.reply(message, "I'm sorry to hear that. It looks like you have a serious medical condition: " + snapshotGrand.child('condition').val() + ". If this is an emergency, please proceed to the nearest ER. They are required to stabalize you regardless of immigration status by federal law. The ER is only required to Stabalize you, but we can direct you to a nearby low cost health clinic which will take care of you. Please respond with your location. ");
    console.log('no condition');

        }

        }else{
            bot.reply(message, 'You are located at: ' + snapshotGrand.child('location').val() + '. Please provide your condition, so I can match you with a nearby low cost clinic which treats it.');
    console.log('no location');

        }
  
  
});
     
     
     
     
          
         /*     for (var key in message.intents[0].entities ) {
  console.log(key);
                
                
                
                
            if(key == "location" && message.intents[0].entities.location[0].confidence > .9 &&  typeof message.intents[0].entities.Conditions !== 'undefined' && message.intents[0].entities.Conditions){
                     
              bot.reply(message, "I'm sorry to hear that. It looks like you have a medical condition: " + message.intents[0].entities.Conditions[0].value + ". If this is an emergency, please proceed to the nearest ER. They are required to stabalize you regardless of immigration status by federal law.");
              
              bot.reply(message, 'You are located at: ' + message.intents[0].entities.location[0].value + '. Please wait while I search for the nearest clinic');
                      condition= true;  
                      var userCondition = message.intents[0].entities.Conditions[0].value;
              var starCountRef = firebase.database().ref('clinics/');
starCountRef.once('value', function(snapshot) {
  
         snapshot.forEach(function (snapshot2) {

 console.log(snapshot2.child('conditions').val());
  var conditions = snapshot2.child('conditions').val();
  var partsOfStr = conditions.split(',');
  for (var i = 0; i < partsOfStr.length; i++) {
    console.log(partsOfStr[i].replace(/\s/g,''));
    console.log(userCondition);
    if(partsOfStr[i].toUpperCase().replace(/\s/g,'') === userCondition.toUpperCase()){
        distance.get(
  {
    origin: message.intents[0].entities.location[0].value,
    destination: snapshot2.child('location').val()
  },
  function(err, data) {
    if (err) return console.log(err);
           bot.reply(message, 'I have found a match! The closest clinic which supports your condition is ' + snapshot2.child('name').val() + ' located at ' + snapshot2.child('location').val() + '. It is ' + data.duration +  ' away.');
          
    console.log(data);
});
      
      console.log('FOUND MATCH' + partsOfStr[i]);
    }
    //Do something
}

});
  
});
            
              console.log(location)
            }else{
            if(key == "location" && message.intents[0].entities.location[0].confidence > .9 ){
                       firebase.database().ref('users/' + message.user).set({
    location: message.intents[0].entities.location[0].value 
    });
            bot.reply(message, 'You are located at: ' + message.intents[0].entities.location[0].value + '. Please provide me with your medical condition, so I can find a compatible clinic. ');

              
            }  
              
            
            }
            
           
}
          */
}
   

    });

  
   

    controller.studio.before('catch all', function(convo, next) {

        // do some preparation before the conversation starts...
        // for example, set variables to be used in the message templates
        // convo.setVar('foo','bar');
        
        console.log('BEFORE: catch all');
        // don't forget to call next, or your conversation will never continue.
        next();

    });

    /* Validators */
    // Fire a function whenever a variable is set because of user input
    // See: https://github.com/howdyai/botkit/blob/master/docs/readme-studio.md#controllerstudiovalidate
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

    // Validate user input: question_1
    controller.studio.validate('catch all','question_1', function(convo, next) {

        var value = convo.extractResponse('question_1');

        // test or validate value somehow
        // can call convo.gotoThread() to change direction of conversation

        console.log('VALIDATE: catch all VARIABLE: question_1');

        // always call next!
        next();

    });

    // Validate user input: question_2
    controller.studio.validate('catch all','question_2', function(convo, next) {

        var value = convo.extractResponse('question_2');

        // test or validate value somehow
        // can call convo.gotoThread() to change direction of conversation

        console.log('VALIDATE: catch all VARIABLE: question_2');

        // always call next!
        next();

    });

    // Validate user input: question_3
    controller.studio.validate('catch all','question_3', function(convo, next) {

        var value = convo.extractResponse('question_3');

        // test or validate value somehow
        // can call convo.gotoThread() to change direction of conversation

        console.log('VALIDATE: catch all VARIABLE: question_3');

        // always call next!
        next();

    });

    /* Thread Hooks */
    // Hook functions in-between threads with beforeThread
    // See: https://github.com/howdyai/botkit/blob/master/docs/readme-studio.md#controllerstudiobeforethread
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

    // Before the default thread starts, run this:
    controller.studio.beforeThread('catch all','default', function(convo, next) {

        /// do something fun and useful
        // convo.setVar('name','value');

        console.log('In the script *catch all*, about to start the thread *default*');

        // always call next!
        next();
    });

    // Before the on_timeout thread starts, run this:
    controller.studio.beforeThread('catch all','on_timeout', function(convo, next) {

        /// do something fun and useful
        // convo.setVar('name','value');

        console.log('In the script *catch all*, about to start the thread *on_timeout*');

        // always call next!
        next();
    });


    // define an after hook
    // you may define multiple after hooks. they will run in the order they are defined.
    // See: https://github.com/howdyai/botkit/blob/master/docs/readme-studio.md#controllerstudioafter
    controller.studio.after('catch all', function(convo, next) {

        console.log('AFTER: catch all');

        // handle the outcome of the convo
        if (convo.successful()) {

            var responses = convo.extractResponses();
            // do something with the responses

        }

        // don't forget to call next, or your conversation will never properly complete.
        next();
    });
}
