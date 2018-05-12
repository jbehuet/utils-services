import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    user_id: { type: String, required: true, unique: true },
    registered_on: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema, 'users');