var express = require("express");
var cors = require('cors')
var app = express();
var Razorpay = require("razorpay");
var bodyParser = require('body-parser')
app.use(cors())
app.use(express.json())
app.use(express.urlencoded())

let instance = new Razorpay({
    key_id: 'rzp_test_LwbzGwkSx0IhlS', // your `KEY_ID`
    key_secret: 'eLqC0YBKhC9zln4PMKURLXc9' // your `KEY_SECRET`
})


app.use('/web', express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.post("/api/payment/order", (req, res) => {
    params = req.body;
    console.log(params)
    instance.orders.create(params).then((data) => {
        res.send({ "sub": data, "status": "success" });
    }).catch((error) => {
        res.send({ "sub": error, "status": "failed" });
    })
});




app.post("/api/payment/verify", (req, res) => {
    body = req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;
    var crypto = require("crypto");
    var expectedSignature = crypto.createHmac('sha256', 'eLqC0YBKhC9zln4PMKURLXc9')
        .update(body.toString())
        .digest('hex');
    console.log("sig" + req.body.razorpay_signature);
    console.log("sig" + expectedSignature);
    var response = { "status": "failure" }
    if (expectedSignature === req.body.razorpay_signature)
        response = { "status": "success" }
    res.send(response);
});


app.listen("3000", () => {
    console.log("server running at port 3000");
})