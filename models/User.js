const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema ({
    name: {
        type: String,
        required: true, 
        trim: true
    },
    email: {
        type: String,
        required: true, 
        unique: true,
        lowercase: true,
        trim : true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        select: false
    },
    role: {
        type: String,
        enum: ['employee', 'admin'],
        default: 'employee'
    }
}, { timestamps: true });

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// Method to compare entered password with hashed password
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!candidatePassword || !this.password) return false;
  return await bcrypt.compare(String(candidatePassword), this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;