'use strict';

const { WorkloadModuleBase } = require('@hyperledger/caliper-core');
const fs = require('fs');

class ShipProductTo extends WorkloadModuleBase {
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
        const productId = this.productIds[Math.floor(Math.random() * this.productIds.length)];
        // Generate random new location and arrival date (for demonstration purposes)
        const newLocation = `Location_${Math.floor(Math.random() * 1000)}`;
        const arrivalDate = new Date().toISOString().split('T')[0];
        const request = {
            contractId: this.roundArguments.contractId,
            contractFunction: 'shipProductTo',
            invokerIdentity: 'User1',
            contractArguments: [productId, newLocation, arrivalDate],
            readOnly: false
        };
        await this.sutAdapter.sendRequests(request);
    }

    async cleanupWorkloadModule() {}

    // No need to set productIds in this module
}

function createWorkloadModule() {
    return new ShipProductTo();
}

module.exports.createWorkloadModule = createWorkloadModule;
