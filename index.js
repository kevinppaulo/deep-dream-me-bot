require("dotenv").config();
// required to  convert images from url into bas64 format
const imageToBase64 = require("image-to-base64");

// Deep ai's official library.
const deepai = require("deepai");
deepai.setApiKey(process.env.DEEP_AI_API_KEY);

// required wrapper for easy tweeting.
const T = require("./src/loadTwit.js");

// tweeting functions
const { tweetNoPicturesFound, tweetImage } = require("./src/tweets.js");

const stream = T.stream("statuses/filter", { track: "DeepDreamMeBot" });
stream.on("tweet", async function (tweet) {
  const inReplyToStatusId = tweet.id_str;
  const tweetAuthor = tweet.user.screen_name;
  const mediaLinks = tweet.extended_entities.media
    .filter(media => media.type === "photo")
    .map(media => media.media_url);

  const deepDreamedImages = await Promise.all(mediaLinks.map(async link => 
    await deepai.callStandardApi("deepdream", { image: link })))
  .then(results => results.map(result => result.output_url));

  const base64Arr = await Promise.all(deepDreamedImages.map(async link =>
    await imageToBase64(link)))

  if(!base64Arr.length)
    tweetNoPicturesFound(T);
  // if there are images in the tweet, upload and tweet them.
  else
    for(const b64content of base64Arr)
      tweetImage(b64content, T, tweetAuthor, inReplyToStatusId);
});
