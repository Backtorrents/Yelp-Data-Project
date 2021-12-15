db.nbh.find({})
   .projection({})
   .sort({_id:-1})
   .limit(100);
   
db.nbh.updateMany({},
    {$rename:{"ZIP Code":"postal_code"}});
   
