import "core-js";
import { accentsTidy, groupBy } from "../helpers";
import { CostCenterRepository } from "../repositories/CostCenterRepository";
import { CostRepository } from "../repositories/CostRepository";
import { EquipamentRepository } from "../repositories/EquipamentRepository";
import { GroupRepository } from "../repositories/GroupsRepository";
import { ICreateGroup } from "./groupServices";

interface ICostServiceResultType {
    DataDoc: string,
    Descricao: string,
    Unidade: string,
    Quantidade: number,
    PrecUnit: number,
    PrecoLiquido: number,
    Grupo: string,
    Centro: string,
    Mes: string
}

class CostService extends CostRepository {

    private cost: CostRepository;
    private equipament: EquipamentRepository;
    private costCenter: CostCenterRepository;
    private group: GroupRepository;

    constructor() {
        super()
        this.cost = new CostRepository()
        this.equipament = new EquipamentRepository();
        this.costCenter = new CostCenterRepository();
        this.group = new GroupRepository();
    }


    public getCostRepository() {
        return this.cost;
    }


    public getEquipamentRepo() {
        return this.equipament
    }


    public getCostCenterRepo() {
        return this.costCenter
    }

    createService(data: ICostServiceResultType[]) {
        //{ aquisition_date, costcenter, equipament, price, quantity, total_amount }: ICreateCost
        let error = 0
        try {

            data.map(async (dataObject, index) => {
                let findOrCreate: ICreateGroup
                let costCenterr = accentsTidy(dataObject.Centro)
                let month = dataObject.Mes + "/" + (new Date(dataObject.DataDoc)).getFullYear()
                if (!dataObject.Centro || !dataObject.Descricao || !dataObject.Grupo || !dataObject.Mes) {
                    error++
                    //throw new Error("Cost center or equipament classification does not exists")
                }

                else {

                    const equipamentAlreadyExists = await this.getEquipamentRepo().findOneEquipament(dataObject.Descricao)
                    if (equipamentAlreadyExists) {
                        const costCenterAlreadyExists = await this.getCostCenterRepo().findOneCenter({ description: costCenterr })

                        if (costCenterAlreadyExists) {
                            await this.getCostRepository()

                                .create(
                                    {
                                        aquisition_date: dataObject.DataDoc,
                                        costcenter: costCenterAlreadyExists,
                                        equipament: equipamentAlreadyExists.id,
                                        price: dataObject.PrecUnit,
                                        quantity: dataObject.Quantidade,
                                        total_amount: dataObject.PrecoLiquido,
                                        month
                                    })

                        } else {

                            const newCostCenter = await this.getCostCenterRepo().create({ description: costCenterr, responsible: "" })
                            if (newCostCenter)

                                await this.getCostRepository()

                                    .create(
                                        {
                                            aquisition_date: dataObject.DataDoc,
                                            costcenter: newCostCenter,
                                            equipament: equipamentAlreadyExists.id,
                                            price: dataObject.PrecUnit,
                                            quantity: dataObject.Quantidade,
                                            total_amount: dataObject.PrecoLiquido,
                                            month
                                        })
                        }
                    } else {

                        findOrCreate = await this.group.findOneGroup({ description: dataObject.Grupo }) ?? {} as ICreateGroup

                        if (!findOrCreate.description)
                            findOrCreate = await this.group.create({ description: dataObject.Grupo }) ?? {} as ICreateGroup

                        const newEquipament = await this.getEquipamentRepo()
                            .createEquipament({ description: dataObject.Descricao, group: findOrCreate, um: dataObject.Unidade })

                        if (newEquipament) {
                            const newCostCenterAlreadyExists = await this.getCostCenterRepo().findOneCenter({ description: costCenterr })

                            if (newCostCenterAlreadyExists) {

                                await this.getCostRepository()

                                    .create(
                                        {
                                            aquisition_date: dataObject.DataDoc,
                                            costcenter: newCostCenterAlreadyExists,
                                            equipament: newEquipament.id,
                                            price: dataObject.PrecUnit,
                                            quantity: dataObject.Quantidade,
                                            total_amount: dataObject.PrecoLiquido,
                                            month
                                        })
                            }
                        }
                    }
                }
            })

            return error

        } catch (error: any) {

            throw new Error(error.message)
        }
    }

    async totalAmountOfOneAddressByGroup(idCostCenter: number, monthNumber = "0") {
        const arrayMonths = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]

        const results = await this.cost.totalAmountFromCostCenterByGroup(idCostCenter, monthNumber)
        const newDateAquisition = results.length ? results[0]?.aquisition_date : ""

        const newDate = new Date(newDateAquisition)
        const getYearForThisDate = newDate.getFullYear()

        const grouped = groupBy(results)


        const getObjectKeys = Object.keys(grouped);

        const monthDes = Number(monthNumber.slice(0, 1).replace("/", ""))

        const yearDes = monthNumber.slice(1, monthNumber.length).replace("/", "")
        const monthMounted = arrayMonths[monthDes - 1] + "/" + yearDes

        let result = { group_id: 0, group: "", total_amount: 0, month: monthMounted }
        let totalAmountByGroup: [{ total_amount: number; group: string; month: string }] = [{ total_amount: 0, group: "", month: monthMounted }]

        getObjectKeys.map((key) => {

            grouped[key].map((group: any) => {
                result.total_amount += Number(group.total_amount)
                result.group = key
                result.group_id = group?.equipament.group_id
            })

            if (result) {
                totalAmountByGroup.push({ ...result })
            }

            result.total_amount = 0;

        })

        const finalResult = totalAmountByGroup.filter((response) => response.group != "")

        return finalResult



    }


    async allCustsGroupedByGroup() {
        const results = await this.cost.findAll()

        const custsAgrouped = groupBy(results)

        return custsAgrouped
    }
}

export { CostService };

