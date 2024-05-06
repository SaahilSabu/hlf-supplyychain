'use strict';

const { WorkloadModuleBase } = require('@hyperledger/caliper-core');

class GetAllProducts extends WorkloadModuleBase {
    async initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext) {
        await super.initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext);
        // Initialize any variables or state here
    }

    async submitTransaction() {
        const request = {
            contractId: this.roundArguments.contractId,
            contractFunction: 'getAllProducts',
            invokerIdentity: 'User1',
            contractArguments: [],
            readOnly: true
        };
        await this.sutAdapter.sendRequests(request);
    }

    async cleanupWorkloadModule() {
        // Clean up any resources here
    }
}

function createWorkloadModule() {
    return new GetAllProducts();
}

module.exports.createWorkloadModule = createWorkloadModule;
