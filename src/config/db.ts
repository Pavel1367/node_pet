import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config();
const connectDB = async (): Promise<void> =>{

    try{
        if(!process.env.MONGO_URI){
            throw new Error('MongoDB URI doesn\'t exist')
        }
        const connection = await mongoose.connect(process.env.MONGO_URI)
        console.log(`Mongo connected ${connection.connection.host}`)
    }catch(err){
        console.error(err)
        process.exit(1)
    }
}
mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to database');
});

mongoose.connection.on('error', (err) => {
    console.log(`Mongoose connection error: ${err}`);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
});
export default connectDB