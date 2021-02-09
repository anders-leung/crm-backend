module.exports = {
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  initials: String,
  emailPassword: String,
  name: String,
  private: Boolean,
  createdAt: {
    type: Date,
    default: Date.now,
  },
};
