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
    Centro: string
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

            data.map(async (dataObject) => {
                let findOrCreate: ICreateGroup
                if (!dataObject.Centro || !dataObject.Descricao || !dataObject.Grupo) {
                    error++
                    //throw new Error("Cost center or equipament classification does not exists")

                }

                else {
                    const equipamentAlreadyExists = await this.getEquipamentRepo().findOneEquipament(dataObject.Descricao)
                    if (equipamentAlreadyExists) {
                        const costCenterAlreadyExists = await this.getCostCenterRepo().findOneCenter({ description: dataObject.Centro })

                        if (costCenterAlreadyExists) {
                            await this.getCostRepository()

                                .create(
                                    {
                                        aquisition_date: dataObject.DataDoc,
                                        costcenter: costCenterAlreadyExists,
                                        equipament: equipamentAlreadyExists.id,
                                        price: dataObject.PrecUnit,
                                        quantity: dataObject.Quantidade,
                                        total_amount: dataObject.PrecoLiquido
                                    })

                        } else {
                            const newCostCenter = await this.getCostCenterRepo().create({ description: dataObject.Centro, responsible: "" })
                            if (newCostCenter)
                                await this.getCostRepository()

                                    .create(
                                        {
                                            aquisition_date: dataObject.DataDoc,
                                            costcenter: newCostCenter,
                                            equipament: equipamentAlreadyExists.id,
                                            price: dataObject.PrecUnit,
                                            quantity: dataObject.Quantidade,
                                            total_amount: dataObject.PrecoLiquido
                                        })
                        }
                    } else {

                        findOrCreate = await this.group.findOneGroup({ description: dataObject.Grupo }) ?? {} as ICreateGroup

                        if (!findOrCreate.description)
                            findOrCreate = await this.group.create({ description: dataObject.Grupo }) ?? {} as ICreateGroup

                        const newEquipament = await this.getEquipamentRepo()
                            .createEquipament({ description: dataObject.Descricao, group: findOrCreate, um: dataObject.Unidade })

                        if (newEquipament) {
                            const newCostCenterAlreadyExists = await this.getCostCenterRepo().findOneCenter({ description: dataObject.Centro })

                            if (newCostCenterAlreadyExists) {

                                await this.getCostRepository()

                                    .create(
                                        {
                                            aquisition_date: dataObject.DataDoc,
                                            costcenter: newCostCenterAlreadyExists,
                                            equipament: newEquipament.id,
                                            price: dataObject.PrecUnit,
                                            quantity: dataObject.Quantidade,
                                            total_amount: dataObject.PrecoLiquido
                                        })
                            }
                        }
                    }
                }
            })

            return error

        } catch (error: any) {
            console.log("Error", error.message);
            throw new Error(error.message)
        }
    }
}

export { CostService };

