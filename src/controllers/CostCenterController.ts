

import { NextFunction, Request, Response } from "express";
import { CostCenterService } from "../services/costCenterService";

class CostCenterController {

    private costCenterService: CostCenterService

    constructor() {
        this.costCenterService = new CostCenterService()
    }

    async index(request: Request, response: Response, next: NextFunction) {

        try {

            const fetch = await this.costCenterService.findAll()

            response.status(200).json(fetch)
        } catch (error: any) {
            next(error.message)
        }

    }

    async store(request: Request, response: Response, next: NextFunction) {
        try {

            const { description, estimatedBudget, responsible } = request.body


            const result = await this.costCenterService.create({ description, estimatedBudget, responsible });


            response.status(200).json(result)
            //response.status(200).json({ message: "Group was created with successfull! " })

        } catch (error) {

            next(error)

        }
    }

    show() {

        console.log("show");
    }
}

export default CostCenterController