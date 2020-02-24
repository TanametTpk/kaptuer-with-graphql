const {composeWithMongoose} = require('graphql-compose-mongoose/node8')
const graphqlHTTP = require('express-graphql');
const {schemaComposer} = require('graphql-compose')

const capitalizeFirstLetter = (value) => {
    return value.charAt(0).toUpperCase() + value.slice(1);
}

module.exports = (models, options) => {

    let graphiql = false
    if (options && options.graphiql) graphiql = options.graphiql

    Object.keys(models).map((model_name) => {

        let model = models[model_name]

        const customizationOptions = {}
        let tc = composeWithMongoose(model , customizationOptions)

        let queryList = [
            "findById",
            "findByIds",
            "findOne",
            "findMany",
            "count",
            "connection",
            "pagination"
        ]

        let mutationList = [
            "createOne",
            "createMany",
            "updateById",
            "updateOne",
            "updateMany",
            "removeById",
            "removeOne",
            "removeMany"
        ]

        let query_field = {}
        let mutation_field = {}

        queryList.map(query_name => {

            query_field = {
                ...query_field,
                [ model_name + capitalizeFirstLetter(query_name) ] : tc.getResolver(query_name)
            }

        })

        mutationList.map(mutation_name => {

            mutation_field = {
                ...mutation_field,
                [ model_name + capitalizeFirstLetter(mutation_name) ] : tc.getResolver(mutation_name)
            }

        })

        schemaComposer.Query.addFields(query_field)
        schemaComposer.Mutation.addFields(mutation_field)

    })
    
    const graphqlSchema = schemaComposer.buildSchema()
    const _graphql_mid = graphqlHTTP({
        schema: graphqlSchema,
        graphiql,
    })
    
    return {
        routes:{
            graphql:{
                dummy: {
                    path: "/",
                    method: "use",
                    middlewares: ["_graphql_mid"],
                    controller: "graphql",
                    action:"dummy"
                }
            }
        },
        middlewares:{
            _graphql_mid
        },
        services:{
            graphql:{
                dummy: () => {
                    return {}
                }
            }
        }
    }

}