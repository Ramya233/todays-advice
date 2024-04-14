import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import  ejs from "ejs";
import { fileURLToPath } from "url";
import path from "path";
import { dirname, join } from "path";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;
const ApiUrl_Advice = "https://api.adviceslip.com/advice";

app.use(cors());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// app.use(express.static('public'));
app.use(express.static(__dirname + "/public/"));
app.use(bodyParser.urlencoded({ extended: true }));

let todayAdv = "";

async function initialData() {
  try {
    const adviceResult = await axios(ApiUrl_Advice);
    todayAdv = adviceResult.data.slip.advice;
  } catch (error) {
    console.log("There was an error: " + error);
  }
}


app.get("/", async (req, res) => {
  if (!todayAdv) {
    await initialData();
  }
  res.render("index.ejs", {
    data: {
      firstAdv: todayAdv,
      responseAdv: "", 
    },
  });
});



app.post("/getRandomAdvice", async (req, res) => {
  try {
    const random = Math.floor(Math.random() * 220) + 1;
    const result = await axios(ApiUrl_Advice + `/${random}`);
    const responseAdv = result.data.slip.advice;

    console.log(responseAdv);

    res.render("index.ejs", {
      data: {
        firstAdv:"",
        responseAdv: responseAdv,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});





