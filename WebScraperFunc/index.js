const JSDOM = require('jsdom').JSDOM;
const readability = require("readability-nodejs");
const axios = require('axios');


module.exports = async function (context, req) {

  if (req.query.url || (req.body && req.body.url)) {
      var url = req.body.url || req.query.url;

      try {
        // get html
          await axios.get(url)
          .then((response) => {
              if(response.status === 200) {
              var html = response.data;
                
              var dom = new JSDOM(html,{url:url});

              // firefox readabiliy
              let reader = new readability.Readability(dom.window.document);
              let article = reader.parse();
                // response
              var body = JSON.stringify({
                "url": url,
                "title":article.title,
               "text":article.textContent
              });
              context.res = {

                body : body

              };
              }
          }, (error) => context.log(error) );
      
         
        } catch (error) {
          context.log(error);
          }

  } else{

    context.res = {
      status: 400,
      body: "Please pass an url on the query string or in the request body"
    };

  }

context.done();
          
};