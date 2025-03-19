import mongoose, { Document, Schema } from "mongoose";

export interface IBookmark extends Document {
  userId: string;
  contestId: mongoose.Schema.Types.ObjectId;
}

const BookmarkSchema: Schema = new Schema({
  userId: { type: String, required: true },
  contestId: { type: mongoose.Schema.Types.ObjectId, ref: "Contest", required: true },
});

export default mongoose.model<IBookmark>("Bookmark", BookmarkSchema);
