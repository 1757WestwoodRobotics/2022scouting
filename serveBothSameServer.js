const process = require("process")
const express = require("express")


const main = async () => {
const app = express();
    const port = process.env.PORT || 8080
    app.listen(port, () => {
        console.log("STARTING META PROCESS")
    })
    const frontend = require("./web/__sapper__/build/server/server")
    // process.chdir("./web")
    frontend.start(app)


    const backend = require("./server/dist/index")
    process.chdir("../server")   
    await backend.start(app)
    process.chdir("../web")

    app.get("/", (_,res) => {
        res.redirect("2023")
    })

};


main().catch((err) => {
  console.error(err);
});
