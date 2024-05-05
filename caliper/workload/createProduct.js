'use strict';

/**
 * Caliper benchmark test script for the 'createProduct' transaction.
 */

const { WorkloadModuleBase } = require('@hyperledger/caliper-core');
const { createHash } = require('crypto');

class CreateProduct extends WorkloadModuleBase {
    constructor() {
        super();
        this.txIndex = -1;
        this.productId = `product_${Math.floor(Math.random() * 100000)}`;
        this.productJson = {
            id: this.productId,
            name: "Sample Product",
            barcode: "ABCDE",
            placeOfOrigin: "Sample Origin",
            productionDate: "2024-05-05",
            expirationDate: "2024-12-31",
            unitQuantity: 100,
            unitQuantityType: "pieces",
            unitPrice: 10.5,
            category: "Sample Category",
            locationData: {
                current: {
                    location: "Sample Location",
                    arrivalDate: "2024-05-05"
                }
            }
        };
    }

    /**
     * Initializes the workload module.
     */
    async initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext) {
      await super.initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext);  
      // No initialization required for this workload
    }

    /**
     * Generate a unique product ID.
     * @returns {string} Product ID
     */
    generateProductId() {
        return `product_${createHash('md5').update(new Date().toISOString()).digest('hex').substring(0, 10)}`;
    }

    /**
     * Generate a random number.
     * @param {number} min - Minimum value.
     * @param {number} max - Maximum value.
     * @returns {number} Random number between min and max.
     */
    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * Assemble and return TX Object for createProduct transaction.
     * @returns {Object} TX Object
     */
    async submitTransaction() {
      this.txIndex++;
      const assetID = `${this.roundIndex}_${this.workerIndex}_${this.txIndex}_${Date.now()}`;
      let size = (((this.txIndex % 10) + 1) * 10).toString(); // [10, 100]
      let owner = this.owners[this.txIndex % this.owners.length];
      return this.sutAdapter.invokeSmartContract('ProductSupplyChainContract', 'createProduct', [JSON.stringify(this.productJson)], 30);
    }

    /**
     * Cleanup the workload module.
     */
    async cleanupWorkloadModule() {
        // No cleanup required for this workload
    }
}

/**
 * Create a new instance of the workload module.
 * @returns {WorkloadModuleBase} The workload module instance.
 */
function createWorkloadModule() {
    return new CreateProduct();
}

module.exports.createWorkloadModule = createWorkloadModule;
