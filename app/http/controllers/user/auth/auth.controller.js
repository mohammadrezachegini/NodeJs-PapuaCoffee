const {HashString, deleteAccessToken, deleteRefreshToken} = require('../../../../../utils/function')
const {UserModel} = require('../../../../models/user')
const {SignAccessToken, SignRefreshToken} = require('../../../../../utils/function')
const bcrypt = require("bcrypt");


class AuthControllers{

    async register(req,res,next){

        try {
            const {first_name,last_name,email,password} = req.body;
            console.log("req body is " + req.body);
            const hash_password = HashString(password);
            console.log("HAsH password is " + hash_password);
            const user = await UserModel.create({
                first_name:first_name,last_name:last_name,email:email, password: hash_password
            })
            console.log("User IS " + user);
            return res.json(user)
        } catch (error) {
            next(error)
        }
        
    }



    async login(req,res,next){
        try {
            const { email, password } = req.body;
            const user = await UserModel.findOne({ email }, { accessToken: 0})
            console.log("Login section " + user);
            if(!user) throw {status: 401, message: "Email or password is wrong"}
            const compareResult = bcrypt.compareSync(password, user.password)
            if(!compareResult) throw {status: 401, message: "Email or password is wrong"}
            // const data = {...req.body}

            
            
            await UserModel.findOne({ _id: user._id  })
            .then(async (users) => {
              if(users.refreshToken == "0") {
                const refreshToken = await SignRefreshToken(users._id);
                users.refreshToken = refreshToken;
                users.save();
                // await UserModel.findOneAndUpdate({ _id: users._id }, { refreshToken:refreshToken }, { new: true })
                // console.log("USEEEEEEEEEEEEEEEEEEEERS " + users);
                return res.status(200).json({
                  statusCode : 200,
                  success: true,
                  message: "successful logged in",
                  data: {
                    refreshToken,
                    users
                  }
                })
              }
              else{
                return res.status(401).json({
                    statusCode : 401,
                    success: false,
                    message: "YOu are already logged in",
                    user
                    
                  })
              }
            })
          } catch (error) {
            next(error)
          }
    }

    async logout(req,res,next){
        try {
            const { refreshToken,userId } = req.body;
            deleteRefreshToken(refreshToken)
            console.log(req.body);
            
            const user = await UserModel.findOne({ userId })
            // 
            // console.log("done");
            await UserModel.findOneAndUpdate({ _id: user._id  })
            .then(user => {
              user.refreshToken = null;
              return user.save();
            })
            // const user = await UserModel.findOne({ userId }, { accessToken: 0})
            // await UserModel.findOneAndUpdate({ _id: user._id }, { accessToken: "", refreshToken: "null" })
            return res.status(200).json({
              statusCode : 200,
              success: true,
              message: "successful logged out",
              user
            })
          } catch (error) {
            next(error)
          }
    }

    async saveUser(mobile,code){
        const now = (new Date().getTime())
        let otp = {
        code,
        expiresIn: (new Date().getTime() + 120000)
        }
        const user = await this.checkExistUser(mobile);

        if (user){
            console.log(otp.code, now);
            if (+user.otp.expiresIn > now) throw createError.Forbidden("Your code is not expired")
            return (await this.updateUser(mobile, { otp }))
        }
        return (await UserModel.create({
        mobile,
        otp,
        Role: ROLES.USER
        }))
    }


    async refreshToken (req,res,next){
        try {
            const {refreshToken} = req.body
            const email = VerifyRefreshToken(refreshToken)
            const user = await UserModel.findOne({email})
            const accessToken = await SignAccessToken(user._id)
            const newRefreshToken = await SignRefreshToken(user._id)
            return res.json({
                data : {
                    accessToken,
                    refreshToken: newRefreshToken
                }
            })

        } catch (error) {
            
        }
    }

    async checkExistUser(email) {
        const user = await UserModel.findOne({ email });
        return user
      }
    }


module.exports = {
    authController: new AuthControllers()
}
