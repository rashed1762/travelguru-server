const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const jwt=require('jsonwebtoken');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9xcpzdk.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ message: 'UnAuthorized access' });
  }
  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
    if (err) {
      return res.status(403).send({ message: 'Forbidden access' })
    }
    req.decoded = decoded;
    next();
  });
}



async function run(){
    try{
        await client.connect();
        const serviceCollection = client.db('travel_guru').collection('balirooms');
        const beijingCollection = client.db('travel_guru').collection('beijingrooms');
        const indiaCollection = client.db('travel_guru').collection('indiarooms');
        const italyCollection = client.db('travel_guru').collection('italyrooms');
        const maldivCollection = client.db('travel_guru').collection('maldivrooms');
        const morokkoCollection = client.db('travel_guru').collection('morokkorooms');
        const suitzerlandCollection = client.db('travel_guru').collection('suitzerlandrooms');
        const bookingCollection = client.db('travel_guru').collection('booking');
        const productCollection = client.db('travel_guru').collection('product');
        const productbookingCollection = client.db('travel_guru').collection('productbooking');
        const userCollection = client.db('travel_guru').collection('users');
        

        app.put('/user/admin/:email', async (req, res) => {
          const email = req.params.email;
          const filter = { email: email };
          const updateDoc = {
            $set: { role: 'admin' },
          };
          const result = await userCollection.updateOne(filter, updateDoc);
          res.send(result);
        })

        app.get('/admin/:email', async (req, res) => {
          const email = req.params.email;
          const user = await userCollection.findOne({ email: email });
          const isAdmin = user.role === 'admin';
          res.send({ admin: isAdmin })
        })


        
        app.put('/user/:email', async (req, res) => {
          const email=req.params.email;
          const user =req.body;
          const filter={email:email};
          const options ={upsert:true};

          const updateDoc={
            $set:user,
          };
          const result =await userCollection.updateOne(filter,updateDoc,options);
          const token=jwt.sign({email:email},process.env.ACCESS_TOKEN_SECRET,{expiresIn:'2h'})
          res.send({result,token});
          });

          app.get('/user', async (req,res)=>{
            const users=await userCollection.find().toArray();
            res.send(users);
          })

          



          app.get('/product', async (req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
            });

            app.post('/productbooking',async (req,res)=>{
              const booking=req.body;
              const result=await productbookingCollection.insertOne(booking);
              res.send(result);
            })

            app.get('/productbooking',async (req,res)=>{
              const useremail=req.query.useremail;
              const query={useremail:useremail};
              const result=await productbookingCollection.find(query).toArray();
              res.send(result);
            })

            app.delete('/productbooking/:id',async (req,res)=>{
              const id=req.params.id;
              const filter={_id:ObjectId(id)};
              const result=await productbookingCollection.deleteOne(filter);
              res.send(result);
            })
          


    app.get('/balirooms', async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
      });

      app.get('/beijingrooms', async (req, res) => {
        const query = {};
        const cursor = beijingCollection.find(query);
        const services = await cursor.toArray();
        res.send(services);
        });

        app.get('/indiarooms', async (req, res) => {
          const query = {};
          const cursor = indiaCollection.find(query);
          const services = await cursor.toArray();
          res.send(services);
          });

          app.get('/beijingrooms', async (req, res) => {
            const query = {};
            const cursor = beijingCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
            });


            app.get('/italyrooms', async (req, res) => {
              const query = {};
              const cursor = italyCollection.find(query);
              const services = await cursor.toArray();
              res.send(services);
              });


              app.get('/maldivrooms', async (req, res) => {
                const query = {};
                const cursor = maldivCollection.find(query);
                const services = await cursor.toArray();
                res.send(services);
                });



                app.get('/morokkorooms', async (req, res) => {
                  const query = {};
                  const cursor = morokkoCollection.find(query);
                  const services = await cursor.toArray();
                  res.send(services);
                  });

                  app.get('/suitzerlandrooms', async (req, res) => {
                    const query = {};
                    const cursor = suitzerlandCollection.find(query);
                    const services = await cursor.toArray();
                    res.send(services);
                    });

                    app.get('/booking',async (req,res)=>{
                      const useremail=req.query.useremail;
                      const query={useremail:useremail};
                      const result=await bookingCollection.find(query).toArray();
                      res.send(result);
                    })


                    app.get('/booking/:id',async (req,res)=>{
                      const id=req.params.id;
                      const query={_id:ObjectId(id)};
                      const result=await bookingCollection.findOne(query);
                      res.send(result);
                    })


                    app.post('/booking',async (req,res)=>{
                      const booking=req.body;
                      const result=await bookingCollection.insertOne(booking);
                      res.send(result);
                    })

                    

     


    }
    finally{

    }
}
run().catch(console.dir);



app.get('/hero', (req, res) => {
  res.send('hero meets heroku')
})


app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })