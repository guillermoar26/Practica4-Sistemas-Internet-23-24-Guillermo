import { Request, Response } from "express";
import { CarModel, ClientModel, DealerModel } from "../db/types.ts";

export const getClientCars = async (req: Request, res: Response): Promise<void> => {
    try {
        const { dni } = req.params;
        if (!dni || typeof dni !== "string") {
            res.status(400).json({
                code: 'invalid_dni',
                message: 'Either dni is missing or it has not correct type.'
            });
            return;
        }

        const client = await ClientModel.findOne({ dni }).exec();
        if (!client) {
            res.status(404).json({
                code: 'client_not_found',
                message: 'The specified client was not found in the database.'
            });
            return;
        }

        if (client.cars.length == 0) {
            res.status(400).json({
                code: 'client_doesnt_own_any_car',
                message: 'The specified client does not own any car.'
            });
            return;
        }

        const mappedCars = await Promise.all(client.cars.map(async (id: string) => {
            const car = await CarModel.findOne({ _id: id }).exec();
            return {
                model: car?.model,
                seats: car?.seats,
                plate: car?.plate,
                price: car?.price,
            };
        }));

        res.status(200).send(mappedCars);
    } catch {
        res.status(500).json({
            code: 'internal_error',
            message: 'An internal error ocurred. Please try again later.'
        });
    }
};

export const getDealerCars = async (req: Request, res: Response): Promise<void> => {
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
                message: 'The specified dealer was not found in the database.'
            });
            return;
        }

        if (dealer.cars.length == 0) {
            res.status(400).json({
                code: 'dealer_doesnt_own_any_car',
                message: 'The specified dealer does not own any car.'
            });
            return;
        }

        const mappedCars = await Promise.all(dealer.cars.map(async (id: string) => {
            const car = await CarModel.findOne({ _id: id }).exec();
            return {
                model: car?.model,
                seats: car?.seats,
                plate: car?.plate,
                price: car?.price,
            };
        }));

        res.status(200).send(mappedCars);
    } catch {
        res.status(500).json({
            code: 'internal_error',
            message: 'An internal error ocurred. Please try again later.'
        });
    }
};