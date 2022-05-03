const process = require("process")
const express = require("express")


const main = async () => {
const app = express();
    const port = process.env.PORT || 8080
    app.listen(port, () => {
        console.log("STARTING META PROCESS")
    })
    const frontend = require("./web/__sapper__/dev/server/server")
    process.chdir("./web")
    frontend.start(app)


    process.chdir("../server")   
    const backend = require("./server/dist/index")
    await backend.start(app)
    process.chdir("../web")

    app.get("/", (_,res) => {
        res.redirect("2022")
    })

};


main().catch((err) => {
  console.error(err);
});
