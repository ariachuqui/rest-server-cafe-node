const { Schema, model } = require("mongoose");


const CategorySchema = Schema({
    name: {
        type: String,
        require: [true, 'the name is required'],
        unique: true
    },
    state: {
        type: Boolean,
        default: true,
        require: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User', 
        require: true
    }
})

CategorySchema.methods.toJSON = function() {
    const { __v, state, ...category } = this.toObject();
    return category;
}

module.exports = model("Category", CategorySchema);