# #DeepDreamMeBot 🤖
![media/demo.png](media/demo.png)


## What is this project about?
Imagine picturing any image as a dream? Now you can, and right into a well known social network ─ Twitter. Have fun tweeting images with the hastag #DeepDreamMeBot
and receive a response with your picture Deep Dreamed. All you have to do is tweet one or more pictures with the hastag #DeepDreamMeBot.😁

## Technical details 
This project is a [twitter](https://twitter.com) bot that listens for the #DeepDreamMeBot hashtag and calls the DeepDream api for every picture tweeted and
tweets back the result. The api used is [the DeepAi deep dream api](https://deepai.org/machine-learning-model/deepdream). It's free to use and very fast. 

## To-do:
- [x] Listen and respond to pictures tweeted with the #DeepDreamMeBot hashtag.
- [ ] add a landing page to the [domain](https://deep-dream-me-bot.herokuapp.com) as of now, it displays an application error message.
- [ ] host it on a 24h server. The application goes down every 30 minutes on heroku.
