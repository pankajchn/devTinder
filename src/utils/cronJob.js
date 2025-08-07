const cron = require("node-cron")



cron.schedule('5 12 4 8 * ', ()=> {
    console.log("Running a task every minute");
})

