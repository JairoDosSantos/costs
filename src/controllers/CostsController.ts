

import { NextFunction, Request, Response } from "express";
import { groupBy } from "../helpers";
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

    //Criar um service para fazer essa gestão

    async store(request: Request, response: Response, next: NextFunction) {

        try {

            //const { aquisition_date, costcenter, equipament, price, quantity, total_amount } = request.body

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

    async getEquipamentByGroupAndMonth(request: Request, response: Response, next: NextFunction) {

        const { costcenter_id, group_id, month } = request.params
        const groupId = Number(group_id)
        const costCenterId = Number(costcenter_id)

        try {

            const result = await this.costService.getCostRepository().findCostByAddressAndGroup(groupId, costCenterId, month);

            response.status(200).json(result)

        } catch (error) {
            next(error)
        }

    }


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

    async getCostByGroup(request: Request, response: Response, next: NextFunction) {

        const { id, monthNumber, year } = request.params
        const idCostCenter = Number(id)

        const monthToSearch = monthNumber + "/" + year

        try {

            const result = await this.costService.totalAmountOfOneAddressByGroup(idCostCenter, monthToSearch)

            response.status(200).json(result)

        } catch (error) {

            next(error)
        }
    }

    async getCostByMonthOfOneAddress(request: Request, response: Response, next: NextFunction) {

        const { centerCostId, dateToSearch } = request.params

        try {

            const costCenterId = Number(centerCostId)
            let firstDayOfYear: Date = new Date((new Date).getFullYear(), 0, 1)
            let lastDayOfYear: Date = new Date((new Date).getFullYear(), 11, 31)
            let monthToSearch = "0"
            if (dateToSearch != undefined) {

                const dateToSearchNew = new Date(dateToSearch)

                firstDayOfYear = new Date(dateToSearchNew.getFullYear() - 1, 12, 1)
                lastDayOfYear = new Date(dateToSearchNew.getFullYear(), 12, 1)
                monthToSearch = String(dateToSearchNew.getMonth() + 1)

            }


            const result = await this.costService
                .getCostRepository()
                .totalAmountInPerMonthByCostCenter(costCenterId, firstDayOfYear, lastDayOfYear, monthToSearch);

            response.status(200).json(result)

        } catch (error) {
            next(error)
        }
    }

    async cardIndexResumem(request: Request, response: Response, next: NextFunction) {

        const Cardresume = await this.costService.findAll()
        const results = groupBy(Cardresume)

        const keys = Object.keys(results)

        const fetchArray = keys.map((key) => (
            results[key].reduce((acc: number, object: any) => acc + Number(object.total_amount), 0)
        ))

        let arrayFinal: any = []
        const finalArray = fetchArray.map((total_amount, index) => {
            const indice = keys[index]
            return { total_amount, indice }
        })

        response.status(200).json(finalArray)

    }

}

export default CostController