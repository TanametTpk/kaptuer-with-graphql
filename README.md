# What is this?

this package work with kaptuer for implement graphql faster.

# Installation

`npm i --save kaptuer-with-graphql`

then import

```
const kaptuer = require('kaptuer-open-api')
const kaptuerWithMongo = require('kaptuer-with-mongo')
const withGraphql = require('kaptuer-with-graphql')

var Schema = require("mongoose").Schema;

const dbConfig = {
  
    rewrite: "mongodb://localhost:27017/test"
  
}

var userSchema = Schema({

    name : { type:String, required : true, lowercase : true, trim : true},
    password : { type:String},
	provider_id : { type:String },
	verify: {type:Boolean, default: false}

}, { timestamps: true })

userSchema.index({ email:1 , provider_type:1 } , {unique: true});

let models = [
    {
        model: userSchema,
        name: "customer",
        permission:{
            getable:["name","provider_type","verify"],
            updatable:["name"]
        }
    }
]

let withMongo = kaptuerWithMongo.connect(models, dbConfig, {autoRouting:true, dbVerbose:true})

kaptuer.use(withGraphql(withMongo._models, {graphiql: true}))
kaptuer.setup({
    ...withMongo,
    // routes,
    // services,
    port: <your port>
}).start()

```

# Disclaimer
## This dependency build on top of
- graphql-compose-mongoose
- express-graphql
- graphql-compose
## This dependency not support configuration of graphql and Docs of API you can read at https://www.npmjs.com/package/graphql-compose-mongoose