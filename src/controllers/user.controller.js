import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const registerUser = asyncHandler( async(req, res) => {
    // get user details from frontend
    // check if all the fields are entered(validation)
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload images and avatar to cloudinary
    // create user object - entry to db
    // remove password and refresh token from the response 
    // check for user creation
    // return res

    const {fullName, email, password, username} = req.body
    console.log("email: ", email);

    /*
    This is used to check whether the entered field is empty or not. If empty then it returns an 
    api error. Hence other field can also be implemented individually.
    if(fullName==""){
        throw new ApiError(400, "fullname is required")
    }
    */


    // this does the same work but takes everyinput in a single time using the some keyword
    if(
        [fullName, email, password, username].some((field) => field?.trim === "" )
    ){
        throw new ApiError((400), "All fields are required")
    }

    const existedUser = User.findOne({
        $or: [{username}, {email}]
    })

    if(existedUser){
        throw new ApiError(409, "User with email or username already exists")
    }

    // just like req.body , multer gives us access to use files hence req.files
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar is required")
    }

    //upload on cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400, "Avatar is required")
    }

    // Create a userbase object to store in mongodb
    const user = await User.create({
        fullname,
        email,
        avatar:avatar.url,
        coverImage:coverImage?.url || "", //checks if coverImage is present then shows the url else return null
        password,
        username:username.toLowerCase()
    })
        /*
        User.findById()    
        User.findById(user._id)  just like an element user.email , user.-id is a method that finds the id which mongodb automatically gives an data object
        await User.findById(user._id)    since this will take time hence await is used
        await User.findById(user._id).select(   .select is a chaining process that determines which element will be selected to not show like password
            "-password -refreshToken"
        )
        */
        const createdUser = await User.findById(user._id).select(
            "-password -refreshToken"
        )

        // check is user is registered 
        if(!createdUser){
            throw new ApiError(500, "Something went wrong while resgistering the user ")
        }


        // Give a response to user
        return res.status(201).json(
            new ApiResponse(200, createdUser, "User registered successfully")
        )
})

export { registerUser}