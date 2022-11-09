import express from "express";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

async function openDB() {
  return open({
    filename: "message.db",
    driver: sqlite3.Database,
  });
}

const db = await openDB();
const app = express();
const port = 3002;

app.get("/", async (req, res) => {
  const result = await db.all("SELECT * FROM message");
  res.send(result);
});

app.get("/addItem", async (req, res) => {
  const result = await db.run(
    "INSERT INTO message (date, message) VALUES (:now, :message)",
    {
      ":message": req.query.message,
      ":now": new Date()
    }
  );
  res.send(result);
});

app.get("/deleteItem", async (req, res) => {
  const result = await db.run(
    "DELETE FROM message WHERE id=:id",
    {
      ":id": req.query.id,
    }
  );
  res.send(result);
});

app.get("/getList", async (req, res) => {
  let order = "ASC";
  if(req.query.go && req.query.go.toLowerCase() === "desc"){
    order = "DESC";
  }

  let limit = req.query.limit
  if (!limit) {
    limit = 100
  }
  let offset = req.query.offset
  if (!offset) {
    offset = 0
  }

  const result = await db.all(
    "SELECT * FROM message ORDER BY date " + order + " LIMIT :offset, :limit",
    {
      ":offset": offset,
      ":limit": limit
    }
  );
  res.send(result);
});

app.listen(port);