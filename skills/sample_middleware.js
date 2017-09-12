module.exports = function(controller) {

var wit = require('botkit-middleware-witai')({
    token: process.env.token
});

controller.middleware.receive.use(wit.receive);

controller.hears(['hello'],'message_received',wit.hears,function(bot, message) {
console.log("Wit.ai detected entities", message.entities);
  
    // ...
});

}
