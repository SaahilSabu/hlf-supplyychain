'use strict';

const { WorkloadModuleBase } = require('@hyperledger/caliper-core');
const fs = require('fs');

class GetProduct extends WorkloadModuleBase {
    constructor() {
        super();
        this.productIds = [];
        this.csvFilePath = './productIds.csv';
        // Check if the CSV file exists
        if (fs.existsSync(this.csvFilePath)) {
            // Read the product IDs from the CSV file
            const data = fs.readFileSync(this.csvFilePath, 'utf-8');
            this.productIds = data.trim().split('\n').slice(1); // Exclude the header
        }
    }

    async initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext) {
        await super.initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext);
    }

    async submitTransaction() {
        // Select a random product ID from the list
        const randomProductId = this.productIds[Math.floor(Math.random() * this.productIds.length)];
        const request = {
            contractId: this.roundArguments.contractId,
            contractFunction: 'getProduct',
            invokerIdentity: 'User1',
            contractArguments: [randomProductId],
            readOnly: true
        };
        await this.sutAdapter.sendRequests(request);
    }

    async cleanupWorkloadModule() {}

    // No need to set productIds in this module
}

function createWorkloadModule() {
    return new GetProduct();
}

module.exports.createWorkloadModule = createWorkloadModule;
