import { Request, Response } from "express";
import { CarModel, ClientModel, DealerModel } from "../db/types.ts";

export const addMoneyClient = async (req: Request, res: Response): Promise<void> => {
    try {
        const { dni } = req.params;
        if (!dni || typeof dni !== "string") {
            res.status(400).json({
                code: 'invalid_dni',
                message: 'Either dni is missing or it has not correct type.'
            });
            return;
        }

        const { money } = req.body;
        if (!money || money <= 0 || typeof money !== "number") {
            res.status(400).json({
                code: 'invalid_amount',
                message: 'Invalid amount of money. Please try again with a valid and positive amount.'
            });
            return;
        }

        const updatedPerson = await ClientModel.findOneAndUpdate(
            { dni },
            { $inc: { bank: money } },
            { new: true }
        ).exec();

        if (!updatedPerson) {
            res.status(404).json({
                code: 'client_not_found',
                message: 'Specified dni was not found in the database. Unable to add money.'
            });
            return;
        }

        res.status(200).send({
            name: updatedPerson.name,
            dni: updatedPerson.dni,
            bank: updatedPerson.bank,
            cars: updatedPerson.cars,
        });
    } catch {
        res.status(500).json({
            code: 'internal_error',
            message: 'An internal error ocurred. Please try again later.'
        });
    }
};

export const addCarDealer = async (req: Request, res: Response): Promise<void> => {
    try {
        const { nif } = req.params;
        if (!nif || typeof nif !== "string") {
            res.status(400).json({
                code: 'invalid_nif',
                message: 'Either nif is missing or it has not correct type.'
            });
            return;
        }

        const dealer = await DealerModel.findOne({ nif }).exec();
        if (!dealer) {
            res.status(404).json({
                code: 'dealer_not_found',
                message: 'Specified dealer was not found in the database.'
            });
            return;
        }

        const { model, seats, plate, price } = req.body;
        if (!model || !seats || !plate || !price) {
            res.status(400).json({
                code: 'missing_car_values',
                message: 'There are missing values in the body. Do not forget to include model, seats, plate and price.'
            });
            return;
        }

        const foundCar = await CarModel.findOne({ plate }).exec();
        if (foundCar) {
            res.status(400).json({
                code: 'car_already_exists',
                message: 'Specified car plate already exists in the database. Try again with a different plate.'
            });
            return;
        }

        const newCar = new CarModel({ model, seats, plate, price });
        await newCar.save();

        const alreadyExists = await DealerModel.findOne({ nif, cars: newCar._id }).exec();
        if (alreadyExists) {
            res.status(400).json({
                code: 'dealer_already_has_car',
                message: 'Dealer already has a car with the specified plate. Try again with a different plate.'
            });
            return;
        }

        if (dealer.cars.length >= 10) {
            res.status(400).json({
                code: 'dealer_has_max_cars',
                message: 'Dealership has reached the maximum amount of cars. Try again later.'
            });
            return;
        }

        const updatedDealer = await DealerModel.findOneAndUpdate(
            { nif },
            { $push: { cars: newCar._id } },
            { new: true }
        ).exec();

        if (!updatedDealer) {
            res.status(404).json({
                code: 'dealer_not_found',
                message: 'Specified dealer was not found in the database.'
            });
            return;
        }

        res.status(200).send({
            name: updatedDealer.name,
            nif: updatedDealer.nif,
            location: updatedDealer.location,
            zip: updatedDealer.zip,
            cars: updatedDealer.cars,
        });
    } catch {
        res.status(500).json({
            code: 'internal_error',
            message: 'An internal error ocurred. Please try again later.'
        });
    }
};

export const tradeCar = async (req: Request, res: Response): Promise<void> => {
    try {
        const { dniSeller } = req.params;
        if (!dniSeller || typeof dniSeller !== "string") {
            res.status(400).json({
                code: 'invalid_dni',
                message: 'Either dni is missing or it has not correct type.'
            });
            return;
        }

        const { dniBuyer, plate } = req.body;
        if (!dniBuyer || !plate) {
            res.status(400).json({
                code: 'missing_args',
                message: 'There are missing values in the body. Do not forget to include arguments.'
            });
            return;
        }

        const seller = await ClientModel.findOne({ dniSeller }).exec();
        if (!seller) {
            res.status(404).json({
                code: 'seller_not_found',
                message: 'Specified seller was not found in the database.'
            });
            return;
        }

        const buyer = await ClientModel.findOne({ dniBuyer }).exec();
        if (!buyer) {
            res.status(404).json({
                code: 'buyer_not_found',
                message: 'Specified buyer was not found in the database.'
            });
            return;
        }

        const sellerHasCar = await ClientModel.findOne({ dni: dniSeller, cars: plate }).exec();
        if (!sellerHasCar) {
            res.status(404).json({
                code: 'seller_doesnt_own_car',
                message: 'Seller does not own the specified car. Try again with a different car.'
            });
            return;
        }

        const car = await CarModel.findOne({ plate }).exec();
        if (!car) {
            res.status(404).json({
                code: 'car_not_found',
                message: 'Specified car was not found in the database.'
            });
            return;
        }

        if (buyer.bank >= car.price) {
            buyer.bank -= car.price;
            seller.bank += car.price;

            buyer.cars.push(car._id.toString());
            seller.cars = seller.cars.filter((car: string): boolean => car !== plate);

            await buyer.save();
            await seller.save();

            res.status(200).send('Car traded successfully');
        } else {
            res.status(403).json({
                code: 'buyer_not_enough_funds',
                message: 'Buyer does not have enough funds to buy car. Try again.'
            });
            return;
        }
    } catch {
        res.status(500).json({
            code: 'internal_error',
            message: 'An internal error ocurred. Please try again later.'
        });
    }
};

export const changeSellStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const { nif } = req.params;
        if (!nif) {
            res.status(400).json({
                code: 'missing_nif',
                message: 'There are missing values in the body. Do not forget to include nif.'
            });
            return;
        }

        if (typeof nif !== "string") {
            res.status(400).json({
                code: 'invalid_nif_type',
                message: 'The specified nif is not invalid. Please try again.'
            });
            return;
        }

        const found = await DealerModel.findOne({ nif: nif }).exec();
        if (!found) {
            res.status(404).json({
                code: 'dealer_not_found',
                message: 'Specified dealer was not found in the database.'
            });
            return;
        }

        found.canSell = !found.canSell;
        await found.save();
        res.status(200).send(found);
    } catch {
        res.status(500).json({
            code: 'internal_error',
            message: 'An internal error ocurred. Please try again later.'
        });
    }
};

export const sellCar = async (req: Request, res: Response): Promise<void> => {
    try {
        const { nif } = req.params;
        if (!nif || typeof nif !== "string") {
            res.status(400).json({
                code: 'invalid_nif',
                message: 'Either nif is missing or it has not correct type.'
            });
            return;
        }

        const { dniClient, plate } = req.body;
        if (!dniClient || !plate || !nif) {
            res.status(400).json({
                code: 'missing_args',
                message: 'There are missing values in the body.'
            });
            return;
        }

        const dealer = await DealerModel.findOne({ nif: nif }).exec();
        if (!dealer) {
            res.status(404).json({
                code: 'dealer_not_found',
                message: 'Specified dealer was not found in the database.'
            });
            return;
        }

        const client = await ClientModel.findOne({ dni: dniClient }).exec();
        if (!client) {
            res.status(404).json({
                code: 'client_not_found',
                message: 'Specified client was not found in the database.'
            });
            return;
        }

        if (dealer.canSell === false) {
            res.status(403).json({
                code: 'dealer_cant_sell',
                message: 'Specified dealership cannot sell cars. Try again later.'
            });
            return;
        }

        const plateClient = await CarModel.findOne({ dniClient }, { plate: plate }).exec();
        if (plateClient) {
            res.status(403).json({
                code: 'client_already_has_car',
                message: 'Specified client already has a car with that plate. Try again.'
            });
            return;
        }

        const car = await CarModel.findOne({ plate: plate }).exec();
        if (!car) {
            res.status(404).json({
                code: 'car_not_found',
                message: 'Specified car was not found in the database.'
            });
            return;
        }

        if (client.bank < car.price) {
            res.status(403).json({
                code: 'client_not_enough_funds',
                message: 'Client does not have enough funds to buy the car.'
            });
            return;
        }

        client.bank -= car.price;
        dealer.bank += car.price;

        client.cars.push(car._id.toString());
        dealer.cars = dealer.cars.filter((car: string): boolean => car !== plate);

        await client.save();
        await dealer.save();

        res.status(200).send('Car sold successfully');
    } catch {
        res.status(500).json({
            code: 'internal_error',
            message: 'An internal error ocurred. Please try again later.'
        });
    }
};


