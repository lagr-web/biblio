import mongoose from "mongoose";

const testDateSchema = new mongoose.Schema({
    date: {
        type: Date, // Validerer, at `date` er en gyldig dato
        required: true
    },
});

const TestDate = mongoose.model('testdate', testDateSchema);

export default TestDate;
