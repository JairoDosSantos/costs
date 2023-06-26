

import { NextFunction, Request, Response } from "express";
import { GroupsService } from "../services/groupServices";

class GroupsController {

    private groupService: GroupsService

    constructor() {
        this.groupService = new GroupsService()
    }

    async index(request: Request, response: Response, next: NextFunction) {

        try {

            const createGroup = await this.groupService.findAll()

            response.status(200).json(createGroup)
        } catch (error: any) {
            next(error.message)
        }

    }

    async store(request: Request, response: Response, next: NextFunction) {
        try {

            const { description } = request.body


            const createGroup = await this.groupService.create({ description });


            response.status(200).json({ message: "Group was created with successfull! " })

        } catch (error) {

            next(error)

        }
    }

    show() {

        console.log("show");
    }
}

export default GroupsController