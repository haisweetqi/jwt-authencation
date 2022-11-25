const express = require('express')
const jwt = require('jsonwebtoken')
var cors = require('cors')
const app = express()
const port = 5000

app.use(express.json())
app.use(cors())

const users = [
    {
        id: 1,
        name: "Leanne Graham",
        username: "aaa",
        password : "123456",
        email: "Sincere@april.biz",
        isAdmin : true
    },
    {
        id: 2,
        name: "Ervin Howell",
        username: "Antonette",
        password : "123456",
        email: "Shanna@melissa.tv",
        isAdmin : true
    },
    {
        id: 3,
        name: "Clementine Bauch",
        username: "Samantha",
        password : "123456",
        email: "Nathan@yesenia.net",
        isAdmin : true
    }
    
]

const generateAccessToken = (user) =>{
    return jwt.sign({id : user.id , isAdmin : user.isAdmin}, "myScecretKey",{expiresIn : "5m"})
}

const generateRefreshToken = (user) =>{
    return  jwt.sign({id : user.id , isAdmin : user.isAdmin}, "myRefreshScecretKey",{expiresIn : "15m"})
}

app.post('/api/login' , (req,res) =>{
    const {username,password} = req.body
    const user = users.find((u) => {
        return u.username === username && u.password === password
    })
    if(user){
        const accessToken = generateAccessToken(user)
        const refreshToken =  generateRefreshToken(user)
        refreshTokens.push(refreshToken)
       res.json({
        username : user.username,
        isAdmin : user.isAdmin,
        accessToken,
        refreshToken
       })
    }else{
        res.status(400).json("Username and Password is incorrect")
    }
})




const verifyToken = (req,res,next) =>{
    const authHeader = req.headers.token
    if(authHeader) {
        const token  = authHeader.split(" ")[1]

        jwt.verify(token, "myScecretKey" , (err , user) =>{
            if(err){
                return res.status(403).json("Token is not valid")
            }
            req.user = user
            next()
    })
    }else{
        res.status(401).json("You are not authorized ")
    }
}

app.delete('/api/users/:userId' ,verifyToken, (req,res) =>{
    if(req.user.id === req.params.userId || req.user.isAdmin){
        res.status(200).json("User has been deleted")
    }else{
        return res.status(403).json("You are not allowed to access this")
    }
})

let refreshTokens = []

app.post('/api/refreshToken', (req,res) =>{
    const refreshToken = req.body.token

    if(!refreshToken) return res.status(401).json("You are not authenticated")
    if(!refreshTokens.includes(refreshToken)){
        return res.status(403).json("Refresh token is not a valid refresh token")
    } 
    jwt.verify(refreshToken , "myRefreshScecretKey" , (err,user) =>{
        err && console.log(err);
        refreshTokens = refreshTokens.filter((token) => token !== refreshToken)

        const newAccessToken = generateAccessToken(user)
        const newRefreshToken = generateRefreshToken(user)      

        res.status(200).json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        })
    })

})

app.post('/api/logout',verifyToken  , (req,res) =>{
    const refreshToken = req.body.token
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken)
    res.status(200).json("You are logout successfully")
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})