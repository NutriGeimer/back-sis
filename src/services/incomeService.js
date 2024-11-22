class incomeService {
    async addIncome(amount) {
        if (!amount || amount <= 0) {
            throw new Error('Amount must be greater than 0');
        }

        // Aquí se agregaría el ingreso al sistema, por ejemplo:
        // Se podría almacenar en una base de datos o simplemente sumar al total de ingresos
        const currentIncome = await this.getTotalIncome();
        const newIncome = currentIncome + amount;

        // Guardar el nuevo total de ingresos (esto es solo un ejemplo)
        await this.updateIncome(newIncome);
    }

    async getTotalIncome() {
        // Aquí se traería el total de ingresos desde la base de datos
        return 1000;  // Solo un ejemplo, devuelve un valor ficticio
    }

    async updateIncome(totalIncome) {
        // Guardar el total de ingresos en una base de datos o archivo
        console.log('Total Income Updated:', totalIncome);
    }
}

export default incomeService;
