import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = newSchema(
    {
        videoFile: {
            type: String ,//cloudinary url
            required: ture
        },
        thumbnail: {
            type: String ,
            required: ture
        },
        description: {
            type: String ,//cloudinary gives this
            required: ture
        },
        duration: {
            type: Number ,
            required: true
        },
        views: {
            type: Number,
            default : 0
        },
        isPublished:{
            type: Boolean,
            default: true
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true
    }
)

videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video", videoSchema)