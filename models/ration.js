var mongoose = require("mongoose");

const rationSchema = new mongoose.Schema(
  {
    packet_id: {
      type: String,
      unique: true
    },
    packet_type: {
      type: String
    },
    packet_content: {
      type: String
    },
    calories: {
      type: Number
    },
    expiry_date: {
      type: Date
    },
    quantity_in_litres: {
      type: Number
    }
  }
);

let ration = mongoose.model("ration", rationSchema);

insertOne = async (query) => {
    try{
        const create = await ration(query).save();
        return create;
    }catch (err) {
        return err
    }
}

find = async (query) => {
  try{
      const get = await ration.find(query);
      return get
  }catch (err) {
      return err
  }
}

sort_ration_food = async (query) => {
  try{
      const get = await ration.aggregate([
        {
          '$match':{
            'packet_type':"Food"
          }
        },
        {
          '$sort': {
            'expiry_date': 1
          }
        }, {
          '$project': {
            'packet_id': 1, 
            'packet_type': 1, 
            'packet_content': 1, 
            'calories': 1, 
            'quantity_in_litres': 1, 
            'expiry_date': {
              '$dateToString': {
                'format': '%Y-%m-%d', 
                'date': '$expiry_date'
              }
            }
          }
        }
      ]);
      return get
  }catch (err) {
      return err
  }
}

sort_ration_water = async (query) => {
  try{
      const get = await ration.aggregate([
        {
          '$match':{
            'packet_type':"water"
          }
        },
        {
          '$sort': {
            'quantity_in_litres':1
          }
        },
        {
          '$project': {
            'packet_id': 1, 
            'packet_type': 1, 
            'quantity_in_litres': 1
            }
          }
      ]);
      return get
  }catch (err) {
      return err
  }
}


updateOne = async (match, query) => {
  try{
      const set = await  ration.updateOne(match, query)
      return set
  }catch (err) {
      return err
  }
}

deleteOne = async (query) => {
  try{
      const set = await  ration.deleteOne(query);
      return set
  }catch (err) {
      return err
  }
}



module.exports = {
  insertOne,
  find,
  updateOne,
  deleteOne,
  sort_ration_food,
  sort_ration_water
}