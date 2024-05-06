'use strict';

const { WorkloadModuleBase } = require('@hyperledger/caliper-core');
const fs = require('fs');
const { createHash } = require('crypto');

class CreateProduct extends WorkloadModuleBase {
    constructor() {
        super();
        this.txIndex = -1;
        this.productIds = [];
        this.csvFilePath = './productIds.csv';
        // Check if the CSV file exists, if not, create a new one with headers
        if (!fs.existsSync(this.csvFilePath)) {
            fs.writeFileSync(this.csvFilePath, 'productId\n');
        }
    }

    async initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext) {
        await super.initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext);
    }

    async submitTransaction() {
        this.txIndex++;
        const productId = createHash('sha256').update(`${Date.now()}_${this.txIndex}`).digest('hex');
        this.productIds.push(productId); // Save the product ID
        // Write the product ID to the CSV file
        fs.appendFileSync(this.csvFilePath, `${productId}\n`);
        
        // Generate component product IDs (for now, it's an empty array)
        const componentProductIds = [];

        const productJson = {
            id: productId,
            name: "Apples",
            barcode: "1234567890",
            batchQuantity: 1000,
            category: "Fruits",
            componentProductIds: componentProductIds,
            expirationDate: "2024-04-24T18:25:43.511Z",
            locationData: {
                current: {
                    arrivalDate: "2024-04-01T00:00:00.000Z",
                    location: "Local Market, Mumbai, Maharashtra, India"
                },
                previous: []
            },
            misc: {},
            placeOfOrigin: "Markham, ON, Canada",
            productionDate: "2024-03-24T18:25:43.511Z",
            unitPrice: "₹300.00",
            unitQuantity: 300,
            unitQuantityType: "mg",
            variety: "22"
        };

        const request = {
            contractId: this.roundArguments.contractId,
            contractFunction: 'createProduct',
            invokerIdentity: 'User1',
            contractArguments: [JSON.stringify(productJson)],
            readOnly: false
        };

        await this.sutAdapter.sendRequests(request);
    }

    async cleanupWorkloadModule() {}

    // Get the array of product IDs
    getProductIds() {
        return this.productIds;
    }
}

function createWorkloadModule() {
    return new CreateProduct();
}

module.exports.createWorkloadModule = createWorkloadModule;
