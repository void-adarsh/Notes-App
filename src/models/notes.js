const mongoose = require("mongoose");

const NoteSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

NoteSchema.index({ title: "text", description: "text" });

module.exports = mongoose.model("Note", NoteSchema);
