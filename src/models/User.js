import { Schema, model } from "mongoose";

import bcrypt from "bcrypt";
import BigNumber from "bignumber.js";
import Birds from "../birds";
import mongooseHidden from "mongoose-hidden";

function getDefault() {
  var data = new Map();
  for (const key in Birds) {
    if (object.hasOwnProperty(key)) {
      data.set(key, BigNumber(0));
    }
  }
  return data;
}

const UserSchema = new Schema({
  email: String,
  username: { type: String, unique: true, minlength: 6, maxlength: 50 },
  referrer: Schema.Types.ObjectId,
  password: { type: String, minlength: 6, maxlength: 50, hide: true },
  hash: { type: String, hide: true },
  charge: {
    purchase: { type: Schema.Types.BigNumber, default: BigNumber(0), scale: 2 },
    withdraw: { type: Schema.Types.BigNumber, default: BigNumber(0), scale: 2 },
  },
  paid: { type: Schema.Types.BigNumber, default: BigNumber(0), scale: 4 },
  cashPoint: { type: Schema.Types.BigNumber, default: BigNumber(0), scale: 4 },
  stock: {
    type: Map,
    of: Schema.Types.BigNumber,
    default: getDefault,
  },
  snappShot: {
    date: { type: Date, default: Date.now },
    data: {
      type: Map,
      of: Schema.Types.BigNumber,
      default: getDefault,
    },
  },
  birds: {
    type: Map,
    of: Schema.Types.BigNumber,
    default: getDefault,
  },
  lastCollect: { type: Date, default: Date.now },
  attempts: { type: Number, default: 0 },
  joined: { type: Date, default: Date.now },
  active: {
    type: Boolean,
    default: false,
  },
});

UserSchema.pre("save", function (next) {
  this.email = this.email.toLowerCase();
  var password = this.password || "";
  delete this.password;
  if (!this.hash) {
    this.hash = bcrypt.hashSync(password, 10);
  }
  return next();
});

UserSchema.methods.authenticate = function (password) {
  if (bcrypt.compareSync(password, this.hash) && this.attempts < 20) {
    this.attempts = 0;
    this.save();
    delete this.hash;
    return this;
  } else {
    this.attempts++;
    this.save();
    return false;
  }
};

UserSchema.methods.calcEggs = function () {
  var now = Date.now();
  var diffTime = Math.floor((now - this.snappShot.date) / 1000) / 3600;

  var data = new Map();
  for (const key in Birds) {
    if (object.hasOwnProperty(key)) {
      data.set(
        key,
        this.snappShot.data
          .get(key)
          .plus(this.birds.get(key).times(Birds[key].Fertility).times(diffTime))
      );
    }
  }
  this.snappShot = {
    date: now,
    data: data,
  };

  return this.snappShot;
};

UserSchema.methods.collect = function () {
  var snappShot = this.calcEggs();

  var data = new Map();
  for (const key in Birds) {
    if (object.hasOwnProperty(key)) {
      data.set(key, this.stock.get(key).plus(snappShot.data.get(key)));
    }
  }
  this.stock = data;
  this.snappShot = {
    date: snappShot.date,
    data: getDefault(),
  };
};

UserSchema.methods.buyBirds = function (name, amount) {
  if (!Birds.hasOwnProperty(name)) throw new Error("specified bird unavaleble");

  var bird = Birds[name];

  var totalCost = BigNumber(amount).times(bird.cost);

  if (totalCost.gt(this.charge.purchase))
    throw new Error("enaugh charge unavaleble");

  this.charge.purchase.minus(totalCost);

  this.birds.set(name, this.birds.get(name).plus(amount));

  // todo: save an snappShot
  this.calcEggs();

  return true;
};

UserSchema.methods.replenish = function (amount) {
  this.charge.purchase = this.charge.purchase.plus(amount);
};

UserSchema.methods.convert = function (amount) {
  if (!this.charge.withdraw.gt(amount))
    throw new Error("enaugh withdraw coins unavaleble");
  this.charge.purchase = this.charge.purchase.plus(amount);
  this.charge.withdraw = this.charge.withdraw.minus(amount);
  return true;
};

UserSchema.plugin(mongooseHidden);

export default model("User", UserSchema);
