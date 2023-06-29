

import { NextFunction, Request, Response } from "express";
import { CostService } from "../services/costService";
//import xlsx from 'node-xlsx';
const excelToJson = require('convert-excel-to-json');
class CostController {

    private costService: CostService

    constructor() {
        this.costService = new CostService()
    }

    async index(request: Request, response: Response, next: NextFunction) {

        try {

            const fetch = await this.costService.findAll()

            response.status(200).json(fetch)
        } catch (error: any) {
            next(error.message)
        }

    }

    async store(request: Request, response: Response, next: NextFunction) {
        try {

            const { aquisition_date, costcenter, equipament, price, quantity, total_amount } = request.body

            const file = request.file?.buffer;
            const fileConvertedToJSON = excelToJson({
                source: file,
                header: {
                    rows: 1
                },
                sheets: ['dados'],
                columnToKey: {
                    "*": "{{columnHeader}}"
                }

            });

            const { dados } = fileConvertedToJSON

            const result = this.costService.createService(dados);


            response.status(200).json(result)
            //response.status(200).json({ message: "Group was created with successfull! " })

        } catch (error) {

            next(error)

        }
    }

    show() {

        console.log("show");
    }
    /**
     *  where: {
          aquisition_date
        },
     */
    async getAddresWithTotalAmount(request: Request, response: Response, next: NextFunction) {

        //const { dateToSearch } = request.params
        const dateToSearch = new Date(2023, 5, 0, 0, 0, 0, 0)
        const initialDate = new Date(dateToSearch.getFullYear(), dateToSearch.getMonth(), 1)
        const finalDate = new Date(dateToSearch.getFullYear(), dateToSearch.getMonth() + 1, 0)

        try {

            const result = await this.costService.getCostRepository().totalAmountByAddresInOneMonth(initialDate, finalDate);

            response.status(200).json(result)

        } catch (error) {
            next(error)
        }
    }


}

export default CostController