import { Request, Response } from "express";
import { CarModel, ClientModel, DealerModel } from "../db/types.ts";

export const addClient = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, dni, bank, cars } = req.body;
        if (!name || !dni || !bank || !cars) {
            res.status(400).json({
                code: 'missing_client_values',
                message: 'There are missing values in the body. Do not forget to include name, dni, bank and cars.'
            });
            return;
        }

        if (typeof name !== "string" || typeof dni !== "string" || typeof bank !== "number" || !Array.isArray(cars)) {
            res.status(400).json({
                code: 'invalid_client_values',
                message: 'Either name, dni, bank or cars have not correct type.'
            });
            return;
        }

        const alreadyExists = await ClientModel.findOne({ dni }).exec();
        if (alreadyExists) {
            res.status(400).json({
                code: 'client_already_exists',
                message: 'Specified dni already exists in the database. Try again with a different dni.'
            });
            return;
        }

        const newPerson = new ClientModel({ name, dni, bank, cars });
        await newPerson.save();

        res.status(200).send({
            name: newPerson.name,
            dni: newPerson.dni,
            bank: newPerson.bank,
            cars: newPerson.cars,
        });
    } catch {
        res.status(500).json({
            code: 'internal_error',
            message: 'An internal error ocurred. Please try again later.'
        });
    }
};

export const addCar = async (req: Request, res: Response): Promise<void> => {
    try {
        const { model, seats, plate, price } = req.body;
        if (!model || !seats || !plate || !price) {
            res.status(400).json({
                code: 'missing_car_values',
                message: 'There are missing values in the body. Do not forget to include model, seats, plate and price.'
            });
            return;
        }

        if (typeof model !== "string" || typeof seats !== "number" || typeof plate !== "string" || typeof price !== "number") {
            res.status(400).json({
                code: 'invalid_car_values',
                message: 'Either model, seats, plate or price have not correct type.'
            });
            return;
        }

        const alreadyExists = await CarModel.findOne({ plate }).exec();
        if (alreadyExists) {
            res.status(400).json({
                code: 'car_already_exists',
                message: 'Specified car plate already exists in the database. Try again with a different plate.'
            });
            return;
        }

        const newCar = new CarModel({ model, seats, plate, price });
        await newCar.save();

        res.status(200).send({
            model: newCar.model,
            seats: newCar.seats,
            plate: newCar.plate,
            price: newCar.price,
        });
    } catch {
        res.status(500).json({
            code: 'internal_error',
            message: 'An internal error ocurred. Please try again later.'
        });
    }
};

export const addDealer = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, nif, location, zip, cars, bank, canSell = true } = req.body;
        if (!name || !nif || !location || !zip || !cars || !bank) {
            res.status(400).json({
                code: 'missing_dealer_values',
                message: 'There are missing values in the body. Do not forget to include name, nif, location, zip, cars and bank.'
            });
            return;
        }

        if (typeof name !== "string" || typeof nif !== "string" || typeof location !== "string" || typeof zip !== "number" || !Array.isArray(cars) || typeof bank !== "number") {
            res.status(400).json({
                code: 'invalid_dealer_values',
                message: 'Either name, nif, location, zip, cars, bank or canSell have not correct type.'
            });
            return;
        }

        const alreadyExists = await DealerModel.findOne({ nif }).exec();
        if (alreadyExists) {
            res.status(400).json({
                code: 'dealer_already_exists',
                message: 'Specified nif already exists in the database. Try again with a different nif.'
            });
            return;
        }

        const newDealer = new DealerModel({ name, nif, location, zip, cars, bank, canSell });
        await newDealer.save();

        res.status(200).send({
            name: newDealer.name,
            nif: newDealer.nif,
            location: newDealer.location,
            zip: newDealer.zip,
            cars: newDealer.cars,
            bank: newDealer.bank,
            canSell: newDealer.canSell,
        });
    } catch {
        res.status(500).json({
            code: 'internal_error',
            message: 'An internal error ocurred. Please try again later.'
        });
    }
};