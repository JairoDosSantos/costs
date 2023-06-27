

import { NextFunction, Request, Response } from "express";
import { EquipamentService } from "../services/equipamentService";

class EquipamentController {

    private equipamentService: EquipamentService

    constructor() {
        this.equipamentService = new EquipamentService()
    }

    async index(request: Request, response: Response, next: NextFunction) {

        try {

            const fetch = await this.equipamentService.findAllEquipament()

            response.status(200).json(fetch)
        } catch (error: any) {
            next(error.message)
        }

    }

    async store(request: Request, response: Response, next: NextFunction) {
        try {

            const { description, group, um } = request.body


            const result = await this.equipamentService.create({ description, group, um });


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

export default EquipamentController