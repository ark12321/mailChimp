const express  = require("express");
const bodyParser = require("body-parser");
const request = require("request")
const https =require("https")

const app = express();

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));

app.get("/",function(req,res){
    res.sendFile(__dirname+"/signup.html");
    console.log("server up");
})

app.post("/",function(req,res){
   const e= req.body.Email;
   const f=req.body.FirstName;
   const s=req.body.SecondName;

   const data = {
     members: [
        {
            email_address: e,
            status: "subscribed",
            merge_fields: {
                FNAME: f,
                LNAME: s
            }
        }
     ]
   };

   const jsonData =JSON.stringify(data); 
   //The JSON.stringify(data) function is used to convert this object into a JSON-formatted string

   //https  only get req,here we want to post.
   const url ="mailchimp_url";
  
   const options = 
   {
    method: "POST",
    auth: "your_api_key"
   }

 
    const request=https.request(url,options,function(response)
    { //returns a request object with endpoint-url , option-authnicate, callback func-to handle response

        let responseData = '';

        response.on("data", function (chunk) 
        { //1.whenever data is received from server "data" event is triggered and data is appended
            responseData += chunk;
        });
    
        response.on("end", function () 
        {
          //  console.log(responseData); //3.stringified response from mailchim converted to JSON object
          //  console.log("next--")
            const result = JSON.parse(responseData);
          //  console.log(result);
            if (response.statusCode === 200) {
                res.sendFile(__dirname + "/success.html");
            } else {
                console.error("Mailchimp API error:", result);
                res.sendFile(__dirname + "/failure.html");
            }
        });

    })
// console.log("--next--")
// console.log(jsonData)
    request.write(jsonData);  //2.strinified JSON/serialized JSON object written from node.js server to the mailcimpi.e subscribed
    request.end();

})



app.post("/failure",function(req,res){
    res.redirect("/");
})



app.listen(process.env.PORT || 3000,console.log("running...."))
