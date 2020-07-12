module.exports = {

  tweetNoPicturesFound: (T) => T.post("statuses/update", {
      status: `@${tweetAuthor} Não consegui identificar nenhuma imagem em seu tweet.`,
      in_reply_to_status_id: inReplyToStatusId
    }),

  tweetImage: (b64content, T) => {
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
};
