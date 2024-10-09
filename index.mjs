import app from "./src/app.mjs";


const port = process.env.PORT || 3000;

app.listen(port, function () {
    console.log(`CyberChef Server listening on port ${port}!`);
});
