const app = require("./app");

port = process.env.PORT || 6000;
app.listen(port, () => {
    console.log('Server started on port ' + port)
});