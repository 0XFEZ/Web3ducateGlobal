const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const client = require("@mailchimp/mailchimp_marketing")
const app = express();
const https = require("https");

client.setConfig({
  api_key:"7daf4997a759b9fbcaa810b1c9c0f455-us18",
  server: "us18"
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req,res){
  res.sendFile(__dirname+ "/signup.html");
});
app.post("/", function(req,res){
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var email = req.body.Email;

  var data = {
    members: [
    {
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName,
      }
    }
    ]
  }
  var jsonData = JSON.stringify(data);
  const url = "https://us18.api.mailchimp.com/3.0/lists/f5d75df4c0"
  const options = {
    method: "POST",
    auth: "oxfez:7daf4997a759b9fbcaa810b1c9c0f455-us18"
  }

  const request = https.request(url, options, function(response){
    if (response.statusCode === 200) {
      res.sendFile(__dirname+"/success.html")
    } else {
      res.sendFile(__dirname+"/failure.html")
    }
    response.on("data", function(data){
      console.log(JSON.parse(data));
    });
  });
  request.write(jsonData);
  request.end()
});
app.listen(3000, function(){
  console.log("server is running on port3000");
})


//API-KEY = 7daf4997a759b9fbcaa810b1c9c0f455-us18
//Audience ID = f5d75df4c0
