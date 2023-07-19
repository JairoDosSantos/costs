-- CreateTable
CREATE TABLE "expectedCost" (
    "id" SERIAL NOT NULL,
    "month" TEXT NOT NULL,
    "expected_cost" DECIMAL(65,30),
    "costcenter_id" INTEGER NOT NULL,

    CONSTRAINT "expectedCost_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "expectedCost" ADD CONSTRAINT "expectedCost_costcenter_id_fkey" FOREIGN KEY ("costcenter_id") REFERENCES "costcenters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
