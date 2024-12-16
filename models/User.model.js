const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let UserSchema = new Schema({
  id: { type: Number, required: false },
  name: { type: String, required: true, max: 40 },
  userName: { type: String, required: true, min: 6 },
  passWord: { type: String, required: true, min: 8 },
  role: { type: String, enum: ["admin", "user"], required: true },
  position: { type: String, required: true},
  address : { type: String, required: true},
  phone : { type: String, required: true, max: 10, min:10},
});

// Export the model
module.exports = mongoose.model("User", UserSchema);
