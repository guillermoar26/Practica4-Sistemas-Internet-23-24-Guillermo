import express from "express";
import mongoose from "mongoose";

import { addCar, addClient, addDealer } from "./resolvers/post.ts";
import { getClientCars, getDealerCars } from "./resolvers/get.ts";
import { deleteClientCar, deleteDealerCar } from "./resolvers/delete.ts";
import { addCarDealer, addMoneyClient, changeSellStatus, sellCar, tradeCar } from "./resolvers/put.ts";

import { load } from "load";
const env: Record<string, string> = await load();

const mongo_usr: string | undefined = env.MONGO_USR || Deno.env.get("MONGO_USR");
const mongo_pwd: string | undefined = env.MONGO_PWD || Deno.env.get("MONGO_PWD");
const mongo_uri: string | undefined = env.MONGO_URI || Deno.env.get("MONGO_URI");
const db_name: string | undefined = env.DB_NAME || Deno.env.get("DB_NAME");

if (!mongo_usr || !mongo_pwd || !mongo_uri || !db_name) {
  console.log("Missing env values");
  Deno.exit(1);
}

await mongoose.connect(`mongodb+srv://${mongo_usr}:${mongo_pwd}@${mongo_uri}/${db_name}?retryWrites=true&w=majority`);
const miapp = express();
miapp.use(express.json());

miapp
  .post("/api/addCar", addCar)
  .post("/api/addDealer", addDealer)
  .post("/api/addClient", addClient)
  .put("/api/addCarDealer/:nif", addCarDealer)
  .get("/api/getDealerCars/:nif", getDealerCars)
  .put("/api/sellCar/:nif", sellCar)
  .get("/api/getClientCars/:dni", getClientCars)
  .delete("/api/deleteDealerCar/:nif", deleteDealerCar)
  .delete("/api/deleteClientCar/:dni", deleteClientCar)
  .put("/api/tradeCar/:dni", tradeCar)
  .put("/api/addMoneyClient/:dni", addMoneyClient)
  .put("/api/changeSellStatus/:nif", changeSellStatus);

miapp.listen(8080, (): void => {
  console.log("Sever ready on: http://localhost:8080/");
});