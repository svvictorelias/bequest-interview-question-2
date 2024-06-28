import express, { Request, Response } from "express";
import cors from "cors";
import crypto from "crypto";

const PORT = 8080;
const app = express();
const secret = "B3qu6st@V1ct0R";

interface Database {
  data: string;
  hmac: string;
}

let database: Database = { data: "Hello World", hmac: "" };
let backup: Database = { ...database };

app.use(cors());
app.use(express.json());

const generateHMAC = (data: string): string => {
  return crypto.createHmac("sha256", secret).update(data).digest("hex");
};

const verifyHMAC = (data: string, hmac: string): boolean => {
  const computedHMAC = generateHMAC(data);
  return computedHMAC === hmac;
};

database.hmac = generateHMAC(database.data);

app.get("/", (req: Request, res: Response) => {
  res.json(database);
});

app.post("/", (req: Request, res: Response) => {
  const newData: string = req.body.data;
  const newHMAC: string = generateHMAC(newData);
  database = { data: newData, hmac: newHMAC };
  backup = { ...database };
  res.sendStatus(200);
});

app.post("/verify", (req: Request, res: Response) => {
  const { data, hmac } = req.body;
  if (verifyHMAC(data, hmac)) {
    res.json({ status: "success", message: "Data is valid and untampered" });
  } else {
    res.json({ status: "error", message: "Data has been tampered with" });
  }
});

app.post("/recover", (req: Request, res: Response) => {
  database = { ...backup };
  res.json({
    status: "success",
    message: "Data has been restored",
    data: database
  });
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
