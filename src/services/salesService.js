import salesRepo from '../logic/salesRepo.js';
import salesModel from '../models/salesModel.js';
import incomeService from './incomeService.js';  // Servicio de ingresos

const SalesRepo = new salesRepo();
const IncomeService = new incomeService();

class salesService {
    async addSale(data) {
        // Validar campos obligatorios
        if (!data.refreskoId || !data.size || !data.quantity || !data.totalPrice) {
            throw new Error('refreskoId, size, quantity, and totalPrice are required');
        }

        const newSale = new salesModel(
            null, // ID generado automáticamente
            data.refreskoId,
            data.size,
            data.quantity,
            data.totalPrice
        );

        const saleId = await SalesRepo.addSale(newSale);
        
        // Agregar el ingreso relacionado con esta venta
        await IncomeService.addIncome(data.totalPrice);

        return saleId;
    }

    async updateSale(id, data) {
        const sale = await SalesRepo.getSaleById(id);
        if (!sale) throw new Error('Sale not found');
        await SalesRepo.updateSale(id, data);
    }

    async deleteSale(id) {
        const sale = await SalesRepo.getSaleById(id);
        if (!sale) throw new Error('Sale not found');
        await SalesRepo.deleteSale(id);
    }

    async getSaleById(id) {
        return await SalesRepo.getSaleById(id);
    }

    async getSalesByRefresko(refreskoId) {
        return await SalesRepo.getSalesByRefresko(refreskoId);
    }
}

export default salesService;
