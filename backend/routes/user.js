const router = require("express").Router();
const user = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {authenticatetoken} = require("./userauth");

//sign up

router.post("/sign-up", async (req, res)=> {
    try{
        const{username,email,passward,address} = req.body;

        // user name validation
        if (username.length < 4){
            return res 
            .status(400)
            .json({ message: "username length should be greater than 4"});
        }

        // username exist
        const existingusername = await user.findOne({username:username});
        if (existingusername)
        {
            return res 
            .status(400)
            .json({ message: "username already exist"});
        }
        const existingemail = await user.findOne({email:email});
        if (existingemail)
        {
            return res 
            .status(400)
            .json({ message: "email already exist"});
        }
        // validation for apssward
        if(passward.length <=5)
        {
            return res 
            .status(400)
            .json({ message: "passward should be greater than 5"});
        }
        const hashpass = await bcrypt.hash(passward,10);

        const newuser =new user({
            username:username,
            email:email,
            passward:hashpass,
            address:address,
        });
        await newuser.save();
        return res.status(200).json({message: "signUP successfully"});
    
    } catch (error) {
    console.log("Error Details:", error); // This prints the EXACT problem in your terminal
    res.status(500).json({ 
        message: "Internal server error", 
        actualError: error.message 
    });
}

});

// sign in 
router.post("/sign-in", async (req, res)=> {
    try{
        const {username,passward} = req.body;

        const existinguser = await user.findOne({username});
        if(!existinguser){
            res.status(400).json({message: "invalid credentials"});
        }

        await bcrypt.compare(passward, existinguser.passward, (err, data)  => {
            if (data){
                const token = jwt.sign(
                {
                    id: existinguser._id,   // ✅ THIS IS THE MOST IMPORTANT LINE
                    role: existinguser.role
                    },
                    "bookstore123",           // ✅ FIX SECRET (must match middleware)
                        { expiresIn: "30d" }
                    );
                res
                .status(200)
                .json({
                    id: existinguser._id , 
                    role: existinguser.role , 
                    token: token,
                });
            }
            else{
                res.status(400).json({message: "invalid creadentials"});
            }
        });
        

    } catch (error) {
        res.status(500).json({message: "internal server error"});
    // console.log("Error Details:", error); // This prints the EXACT problem in your terminal
    // res.status(500).json({ 
    //     message: "Internal server error", 
    //     actualError: error.message 
    // });
}

});

// get user information 
router.get("/get-user-information",authenticatetoken, async (req, res)=> {
    try{
        
        const data = await user.findById(req.user.id).select('-passward');
        return res.status(200).json(data);
    }catch(error) {
        res.status(500).json({message: "internal server error"});
    }
});

//  update address 
router.put("/update-address",authenticatetoken, async (req , res) => {
    try{
        const id = req.user.id;
        const {address} = req.body;
        await user.findByIdAndUpdate(id,{address:address})
        return res.status(200).json({message:"Address updated successfully"});
    }catch(error){
        res.status(500).json({message: "internal server error"});
    }
})

module.exports = router; 