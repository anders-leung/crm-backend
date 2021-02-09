const mongoose = require('mongoose');

const getter = require('../helpers/getter');

const Schema = mongoose.Schema;
const OptionSchema = new Schema({
  type: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  position: Number,
  details: String,
});

OptionSchema.index({ type: 1, name: 1 }, { unique: true });

/**
 * Methods
 */
OptionSchema.method({
});

/**
 * Statics
 */
OptionSchema.statics = {
  get(id) {
    return getter(this, id);
  },

  /**
   * List services in ascending order of 'position'.
   * @returns {Promise<Option[]>}
   */
  list(type) {
    const sort = { position: 1 };
    if (type === 'Industry') {
      sort.name = 1;
      delete sort.position;
    }

    return this.find({ type })
      .sort(sort)
      .exec();
  },
};

/**
 * @typedef Option
 */
module.exports = mongoose.model('Option', OptionSchema);
