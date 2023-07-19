

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

            response.status(200).json(fetch[0])

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

    async show(request: Request, response: Response, next: NextFunction) {
        const { id } = request.params
        const idAddress = Number(id)
        try {

            const address = {
                id: 0,
                description: "",
                estimatedBudget: 0,
                responsible: "",
                total_amount: 0
            }

            const fetch = await this.costCenterService.findOne(idAddress)

            fetch?.cost.map((cost) => (
                address.total_amount += Number(cost.total_amount)
            ))

            if (fetch) {

                address.description = fetch?.description;
                address.estimatedBudget = Number(fetch?.estimatedBudget);
                address.responsible = fetch?.responsible;
                address.id = fetch?.id
            }

            response.status(200).json(address)

        } catch (error: any) {
            next(error.message)
        }
    }


}

export default CostCenterController