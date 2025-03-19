import mongoose, { Document, Schema } from "mongoose";

export interface IContest extends Document {
  name: string;
  platform: string;
  url: string;
  start_time: Date;
  end_time: Date;
  solution_link?: string;
}

const ContestSchema: Schema = new Schema({
  name: { type: String, required: true },
  platform: { type: String, required: true },
  url: { type: String, required: true },
  start_time: { type: Date, required: true },
  end_time: { type: Date, required: true },
  solution_link: { type: String },
});

export default mongoose.model<IContest>("Contest", ContestSchema);
