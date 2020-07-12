require('dotenv').config()
const Twit = require("twit");
const imageToBase64 = require("image-to-base64");
const deepai = require("deepai");

console.log(process.env.TWITTER_CONSUMER_KEY);

deepai.setApiKey(process.env.DEEP_AI_API_KEY);

const T = new Twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  timeout_ms: 60 * 1000, 
  strictSSL: true 
});

const stream = T.stream("statuses/filter", { track: "DeepDreamMeBot" });

stream.on("tweet", async function (tweet) {
  const deepDreamLinks = [];
  const base64Arr = [];
  const inReplyToStatusId = tweet.id_str;
  const tweetAuthor = tweet.user.screen_name;
  const imageLinks = tweet.extended_entities.media
    .filter(media => media.type === "photo")
    .map(media => media.media_url);

  for(const link of imageLinks){
    const result = await deepai.callStandardApi("deepdream", {
      image: link
    });
    deepDreamLinks.push(result.output_url);
  }

  for(const link of deepDreamLinks){
    const image64 = await imageToBase64(link);
    base64Arr.push(image64);
  }

  if(!base64Arr.length){
    T.post('statuses/update', {
      'status': `@${tweetAuthor} Não consegui identificar nenhuma imagem em seu tweet.`,
      'in_reply_to_status_id': inReplyToStatusId 
    })
    return null;
  }

  for(const b64content of base64Arr){
    // first we must post the media to Twitter
    T.post('media/upload', { media_data: b64content }, function (err, data, response) {
      // now we can assign alt text to the media, for use by screen readers and
      // other text-based presentations and interpreters
      const mediaIdStr = data.media_id_string
      const altText = "Deep dream generated image."
      const meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }
      T.post('media/metadata/create', meta_params, function (err, data, response) {
        if (!err) {
          // now we can reference the media and post a tweet (media will attach to the tweet)
          const params = { status: `@${tweetAuthor}`, 'in_reply_to_status_id': inReplyToStatusId , media_ids: [mediaIdStr] }

          T.post('statuses/update', params, function (err, data, response) {
            console.log(data)
          })
        }else{
          console.log("error: ");
          console.log(err);
        }
      })
    })
  }
});
