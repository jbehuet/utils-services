import mongoose from 'mongoose';

const applicationSchema = mongoose.Schema({
    name: { type: String, required: true, unique: true }
});

export default mongoose.model('Application', applicationSchema, 'applications');