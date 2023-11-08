import { Request, Response } from "express";
import { ClientModel, DealerModel } from "../db/types.ts";

export const deleteClientCar = async (req: Request, res: Response): Promise<void> => {
    try {
        const { dni } = req.params;
        if (!dni || typeof dni !== "string") {
            res.status(400).json({
                code: 'invalid_dni',
                message: 'Either dni is missing or it has not correct type.'
            });
            return;
        }

        const client = await ClientModel.findOne({ dni: dni }).exec();
        if (!client) {
            res.status(404).json({
                code: 'client_not_found',
                message: 'Specified client not found in database.'
            });
            return;
        }

        const { plate } = req.body;
        if (!plate) {
            res.status(400).json({
                code: 'missing_car_plate',
                message: 'Please specify the plate of the car you want to delete.'
            })
            return;
        }
        const foundCar: string | undefined = await client.cars.find((car: string): boolean => car === plate);
        if (!foundCar) {
            res.status(400).json({
                code: 'client_doesnt_own_car',
                message: 'Specified client does not own the car.'
            });
            return;
        }

        const updatedCars: string[] = client.cars.filter((car: string): boolean => car !== plate);
        client.cars = updatedCars;
        await client.save();

        res.status(200).send(`Car with plate ${plate} deleted successfully from client`);
    } catch {
        res.status(500).json({
            code: 'internal_error',
            message: 'An internal error ocurred. Please try again later.'
        });
        return;
    }
};

export const deleteDealerCar = async (req: Request, res: Response): Promise<void> => {
    try {
        const { nif } = req.params;
        if (!nif || typeof nif !== "string") {
            res.status(400).json({
                code: 'invalid_nif',
                message: 'Either nif is missing or it has not correct type.'
            });
            return;
        }

        const dealer = await DealerModel.findOne({ nif: nif }).exec();
        if (!dealer) {
            res.status(404).json({
                code: 'dealer_not_found',
                message: 'Specified dealer not found in database.'
            });
            return;
        }

        const { plate } = req.body;
        if (!plate) {
            res.status(400).json({
                code: 'missing_car_plate',
                message: 'Please specify the plate of the car you want to delete.'
            });
            return;
        }

        const foundCar: string | undefined = await dealer.cars.find((car: string): boolean => car === plate);
        if (!foundCar) {
            res.status(400).json({
                code: 'dealer_doesnt_own_car',
                message: 'Specifief dealer does not own the car.'
            });
            return;
        }

        const updatedCars: string[] = dealer.cars.filter((car: string): boolean => car !== plate);
        dealer.cars = updatedCars;
        await dealer.save();

        res.status(200).send(`Car with plate ${plate} deleted successfully from dealer`);
    } catch {
        res.status(500).json({
            code: 'internal_error',
            message: 'An internal error ocurred. Please try again later.'
        });
    }
};