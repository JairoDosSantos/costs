

import { NextFunction, Request, Response } from "express";
import { ExpectedCostRepository } from "../repositories/ExpectedCosts";

class ExpectedCostController {

    private expectedCosts: ExpectedCostRepository

    constructor() {
        this.expectedCosts = new ExpectedCostRepository()
    }

    //Criar um service para fazer essa gestão

    async store(request: Request, response: Response, next: NextFunction) {

        try {

            const { month, costcenter, expected_cost } = request.body

            const result = this.expectedCosts.create({ costcenter, expected_cost, month });

            response.status(200).json(result)
            //response.status(200).json({ message: "Group was created with successfull! " })

        } catch (error) {

            next(error)

        }

    }

    async fetchOne(request: Request, response: Response, next: NextFunction) {

        try {

            const { month, costcenter } = request.params;

            const newMonth = month.replace("-", "/");
            const centroDeCusto = Number(costcenter);

            const result = await this.expectedCosts.findOneExpectedCostByMonth(centroDeCusto, newMonth);

            response.status(200).json(result);

        } catch (error) {

            next(error);

        }

    }






}

export default ExpectedCostController