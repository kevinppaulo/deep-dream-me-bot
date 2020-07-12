require('dotenv').config()
// required to  convert images from url into bas64 format
const imageToBase64 = require("image-to-base64");

// Deep ai's official library.
const deepai = require("deepai");
deepai.setApiKey(process.env.DEEP_AI_API_KEY);

// required wrapper for easy tweeting.
const T = require("./src/loadTwit.js");

console.log(T);

// tweeting functions
const {tweetNoPicturesFound, tweetImage} = require("./src/tweets.js");

const stream = T.stream("statuses/filter", { track: "DeepDreamMeBot" });
stream.on("tweet", async function (tweet) {
  console.log("Someone tweeted");
  const inReplyToStatusId = tweet.id_str;
  const tweetAuthor = tweet.user.screen_name;
  console.log("Starting the filters");
  const base64Arr = await tweet.extended_entities.media
    .filter(media => media.type === "photo")
    .map(media => media.url)
    .map(async (link) => deepai.callStandardApi("deepdream", {image: link}))
    .map(result => result.output_url)
    .map(async (url) => await imageToBase64(url));
  console.log("Finished transforming arrays...", {base64Arr});

  // If there are no images in the tweet, tweet back saying
  // no pictures found.
  if(!base64Arr.length)
    tweetNoPicturesFound(T);
  // if there are images in the tweet, upload and tweet them.
  else
    for(const b64content of base64Arr)
      tweetImage(b64content, T);
});
