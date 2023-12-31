const express = require(`express`)
const app = express()
app.use(express.json())
let counselingResultController = require("../controller/conseling_result_controller")
const auth = require("../auth/auth")

app.post("/insertresult/:id", auth.authVerify, counselingResultController.addConselingResultTeacher)
// app.get('./getresult/:id',auth.authVerify, counselingResultController.getAllResult)
app.get("/getconsresultteacher", auth.authVerify, counselingResultController.conselingResult)

module.exports = app