const express = require('express')
var cors = require('cors')
const mongoose = require('mongoose') 
const dotenv = require('dotenv')
const taskRouter = require("./src/routers/taskRoutes")
const userRouter = require("./src/routers/userRoutes")

const multer = require('multer');
const path = require('path');

dotenv.config("./.env")
const dbPassword = process.env.DB_PASSWORD

// Configure Multer for File Uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads'); // Upload folder
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

// Ensure 'uploads' folder exists
const fs = require('fs');
const { type } = require('os')
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}



mongoose.connect(`mongodb+srv://hajeenah:${dbPassword}@main.ooa8l.mongodb.net/?retryWrites=true&w=majority&appName=main`)
.then(res=>{
    console.log("DB Connected Successfully")
})
.catch(err=>{
    console.log("DB Connection failed")
})

const ImagesSchema = new mongoose.Schema({
    url : {type : String}
});
const imagesModel = mongoose.model('images',ImagesSchema) 


const app = express()

app.use(cors({
    origin: 'http://localhost:5173'
  }))

app.use(express.json())  

app.use((req,res,next)=>{
    console.log("working")
    next()
})

// Endpoint for Image Upload
app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    imagesModel.create({url : `/uploads/${req.file.filename}`})
    .then(res => {
        console.log("Res :", res)
    })
    .catch(err => {
        console.log("Error :", err)
    })
    res.json({ filePath: `/uploads/${req.file.filename}` });
});
app.get("/images",async (req,res)=>{
    const images = await imagesModel.find()
    res.json({images})
})

// Serve Uploaded Files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use("",taskRouter)
app.use("/user",userRouter)


app.listen(3000, ()=>{
    console.log("Server started on port 3000 test")
})