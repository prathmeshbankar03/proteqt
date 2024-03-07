const express = require("express");
const cors = require("cors");
const app = express();

const { encrypt, decrypt } = require("./encryptionHandler");

const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json())

const mysql = require("mysql")
const db = mysql.createPool({
    user: "root",
    host: "localhost",
    password: "",
    database: "passwordmanager"
});

//user authentication

// app.post("/register", (req, res) => {
//     const { username, pin } = req.body

//     db.query(`INSERT INTO registerdata (users, password) 
//         VALUES('${username}','${pin}')`,

//         (err) => {
//             if (err) {
//                 res.send("Username already registered 🥲 Please try a different one 🙏")
//             }
//             else {
//                 res.send("User Registered Successfully 🎊 Please Login to Continue")
//             }
//         })
// })


//password management backend

app.post("/addpswd", (req, res) => {

    const { title, password } = req.body

    console.log(req.body)

    const hashedPassword = encrypt(password);

    db.query(`INSERT INTO passwords (title, password, iv) 
        VALUES('${title}','${hashedPassword.password}','${hashedPassword.iv}')`,

        (err) => {
            if (err) {
                return console.log(err);
            }
            return console.log("Values Inserted Successfully")
        });
});

app.get("/getpswd", (req, res) => {

    db.query(`SELECT * , ROW_NUMBER() OVER(order by title) AS id FROM passwords`, (err, results) => {
        if (err) {
            return console.log(err);
        }
        else {
            res.send(results)
        }
    })
})

app.post("/decryptpassword", (req, res) => {
    res.send(decrypt(req.body));
});

app.post("/deletepassword", (req, res) => {
    db.query(`DELETE FROM passwords where password = "${req.body.password}"`, (err) => { if (err) { (console.log(err)) } else { console.log("Deleted Successfully") } })
})


app.listen(PORT, () => {
    console.log("Server running On : http://localhost:3001");
});
