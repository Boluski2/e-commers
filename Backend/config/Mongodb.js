import mongoose from 'mongoose';

// App config
const connectDB = async () =>{

    mongoose.connection.on('connected', () => {
        console.log("DB Connected")
    })

    await mongoose.connect(`${process.env.MONGODB_URL}/e-commerce?retryWrites=true&w=majority`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


}

export default connectDB;