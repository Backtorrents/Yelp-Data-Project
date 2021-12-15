const contents = [
    {
        content: "C:\\Users\\Pathik\\Downloads\\yelp_academic_dataset_business-json.csv",
        collection: "yelp_academic_dataset_business-json",
        idPolicy: "overwrite_with_same_id", //overwrite_with_same_id|always_insert_with_new_id|insert_with_new_id_if_id_exists|skip_documents_with_existing_id|abort_if_id_already_exists|drop_collection_first|log_errors
        //Use the transformer to customize the import result
        //transformer: (doc)=>{ //async (doc)=>{
        //   doc["importDate"]= new Date()
        //   return doc; //return null skips this doc
        //}
    },
    {
        content: "C:\\Users\\Pathik\\Downloads\\crime_data.csv",
        collection: "crime_data",
        idPolicy: "overwrite_with_same_id",
    },
    {
        content: "C:\\Users\\Pathik\\Downloads\\Neighborhoods_ZIP_Code_Lookup.xlsx - Sheet1.csv",
        collection: "xlsx - Sheet1",
        idPolicy: "overwrite_with_same_id",
    }
];

mb.importContent({
    connection: "localhost",
    database: "admin",
    fromType: "file",
    batchSize: 2000,
    contents
})

db.rest.count({"city":"Austin"})
db.rest.find({"city":"Austin"})


//Find all restaurants with a rating > 4 stars and sort by rating.
db.rest.aggregate([
    {$match: {stars:{$gt:4}}},
    {$project:{name:1, stars:1}},
    {$sort : {stars:-1}}
])


db.rest.aggregate([
    { "$group": { _id: "$postal_code", count: { $sum: 1 } } }
])

//Number of Zip codes in Austin, Texas
db.rest.aggregate([
    {$set:{_id:"$postal_code"}},
    {$unionWith: {coll:"nbh", pipeline:[{$set:{_id:"$postal_code"}}]}},
    {$sort:{stars:1}},
    {$group:{_id:"$postal_code"}}
]).count();

//Join neighbourhoods and restaurants on zip code.
//We see that only 1007 out of 1303 restaurants
//fall in Zip Codes in Austin texas
db.rest.aggregate([{
    $lookup:{
        from:'nbh',
        localField:"postal_code",
        foreignField:"postal_code",
        as: 'Neighborhood'
    }
},
{$unwind:"$Neighborhood"},
{$addFields:{Neighborhood:"$Neighborhood.Neighborhood"},
}]).sort({ "stars": -1 }).limit(10000);