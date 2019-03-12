//index.js
const line = require('@line/bot-sdk');
const express = require('express');

// create LINE SDK config from env variables
const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

// create LINE SDK client
const client = new line.Client(config);

// create Express app
// about Express itself: https://expressjs.com/
const app = express();

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post('/bot/webhook', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

//// event handler
//function handleEvent(event) {
//  if (event.type !== 'message' || event.message.type !== 'text') {
//    // ignore non-text-message event
//    return Promise.resolve(null);
//  }
//
//  // create a echoing text message
//  const echo = { type: 'text', text: event.message.text };
//
//  // use reply API
//  return client.replyMessage(event.replyToken, echo);
//}

// event handler
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null);
  }
  
  // この処理の対象をイベントタイプがメッセージで、かつ、テキストタイプだった場合に限定。
  if (event.type == "message" && event.message.type == "text"){
      // ユーザーからのテキストメッセージが「こんにちは」だった場合のみ反応。
      if (event.message.text == "こんにちは"){
          // replyMessage()で返信
          client.replyMessage(event.replyToken, {
              "type": "text",
              "text": "こりゃどうも。こんにちは。"
          });
      } else {
          // replyMessage()で返信
          client.replyMessage(event.replyToken, {
              "type": "text",
              "text": "はい？耳が遠いもんで。なんですか？"
          });
      }
  }

}


// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});

