import { Decimal } from "@prisma/client/runtime";
import { CostCenterRepository } from "../repositories/CostCenterRepository";


export interface ICreateCenter {
    id?: number;
    description: string;
    estimatedBudget?: Decimal;
    responsible?: string
}

class CostCenterService extends CostCenterRepository {

    private costCenter: CostCenterRepository;

    constructor() {
        super()
        this.costCenter = new CostCenterRepository()
    }


    public getCostCenterRepository() {
        return this.costCenter;
    }

    async create({ description, estimatedBudget, responsible }: ICreateCenter) {

        try {

            const centerAlreadyExists = await this.getCostCenterRepository().findOneCenter({ description })

            if (centerAlreadyExists) {
                throw new Error("Cost center already exists")
            }

            const createdCenter = await this.getCostCenterRepository().create({ description, estimatedBudget, responsible })

            return createdCenter

        } catch (error: any) {

            throw new Error(error.message)

        }
    }
}

export { CostCenterService };

