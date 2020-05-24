import { Schema, model } from "mongoose";

const counterSchema = new Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

counterSchema.index({ _id: 1, seq: 1 }, { unique: true });

const Counter = model("Counter", counterSchema);

export const autoIncrementModelID = async function (modelName, doc, next) {
  try {
    let counter = await Counter.findByIdAndUpdate(
      // ** Method call begins **
      modelName, // The ID to find for in counters model
      { $inc: { seq: 1 } }, // The update
      { new: true, upsert: true } // The options
    ); // ** Method call ends **
    doc.id = counter.seq;
    next();
  } catch (e) {
    throw new Error("failed to provide unique numeric id");
  }
};

export default Counter

// myModel.pre('save', function (next) {
//     if (!this.isNew) {
//       next();
//       return;
//     }
  
//     autoIncrementModelID('activities', this, next);
//   });