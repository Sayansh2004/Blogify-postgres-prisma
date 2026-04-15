

export const userProfile=async(req,res)=>{
    try{
       const user=req.user;

       return res.status(200).json({success:true,message:"User data fetched successfully",data:user})


    }catch(err){
        return res.status(400).json({success:false,message:"failed to fetch user profile"})
    }
}

