'use strict';
const BootBot = require('./lib/BootBot.js');
const echoModule = require('./modules/echo');
const config = require('./config/default.json');
const fetch = require('node-fetch');
const employeeList = 'http://201.163.211.52:7005/BotTemplates/rsBot/EmployeeList';
var myHeaders = ({"accept": "application/json",	'Content-Type': 'application/json'});
var hears=[];

const bot = new BootBot({
  accessToken: config.access_token,
  verifyToken: config.verify_token,
  appSecret: config.app_secret
});
bot.setGreetingText("Bienvenido, estás a punto de entrar en contacto con el Bot de nuestra página.");

bot.setGetStartedButton("empezar");
//Configurando respuesta automática.
bot.module(echoModule);

function setHears(hears){
  this.hears = hears;
}

function getHears(){
  return hears;
}


fetch(employeeList+'?'+'EmployeeId='+0, {
          method: 'GET'
          ,headers: myHeaders
        })
        .then(rest => rest.json())
        .then(json => {
			var employeesTemplate =json.message[0].attachment.payload;
			var i=0;
			for(i;i<employeesTemplate.elements.length;i++)
					hears.push(employeesTemplate.elements[i].title);

      setHears(hears);
		});

    bot.hear(getHears(), (payload, chat) => {
      chat.conversation((convo) => {
        convo.sendTypingIndicator(10)
        .then(() => chat.say("Bienvenido en que puedo ayudarte."));
      });
    });

bot.start();
