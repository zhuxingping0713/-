const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.static('public'));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI);

const TransactionSchema = new mongoose.Schema({
    date: String,
    type: String,
    category: String,
    amount: Number,
    note: String
});
const Transaction = mongoose.model('Transaction', TransactionSchema);

app.get('/api/transactions', async (req, res) => {
    const transactions = await Transaction.find().sort({ date: -1 });
    res.json(transactions);
});

app.post('/api/transactions', async (req, res) => {
    const transaction = new Transaction(req.body);
    await transaction.save();
    res.json({ success: true, record: transaction });
});

app.delete('/api/transactions/:id', async (req, res) => {
    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ success: true });
});

app.delete('/api/transactions', async (req, res) => {
    await Transaction.deleteMany({});
    res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
