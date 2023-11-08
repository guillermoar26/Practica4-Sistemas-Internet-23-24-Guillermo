import mongoose from "mongoose";

const Schema = mongoose.Schema;

// Coches
const CarSchema = new Schema({
    model: { type: String, require: true },
    seats: { type: Number, require: true },
    plate: { type: String, require: true, unique: true },
    price: { type: String, require: true },
    description: { type: String, require: false },
});

export type CarModelType = {
    model: string,
    seats: number,
    plate: string,
    price: number,
    description?: string,
};

export const CarModel = mongoose.model<CarModelType>("Cars", CarSchema);

// Concesionarios
const DealerSchema = new Schema({
    name: { type: String, require: true },
    nif: { type: Number, require: true, unique: true },
    location: { type: String, require: true },
    zip: { type: String, require: true },
    cars: { type: [String], require: true },
    bank: { type: Number, require: true },
    canSell: { type: Boolean, require: true },
});

export type DealerModelType = {
    name: string,
    nif: number
    location: string,
    zip: string,
    cars: string[],
    bank: number,
    canSell: boolean,
};

export const DealerModel = mongoose.model<DealerModelType>("Dealers", DealerSchema);

// Clientes
const ClientSchema = new Schema({
    name: { type: String, require: true },
    dni: { type: String, require: true, unique: true },
    bank: { type: Number, require: true },
    cars: { type: [String], require: true },
});

export type ClientModelType = {
    name: string,
    dni: string,
    bank: number,
    cars: string[],
};

export const ClientModel = mongoose.model<ClientModelType>("Clients", ClientSchema);