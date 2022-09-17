const express = require('express');
const router = express.Router();
const { ObjectId } = require("mongodb");
const logger = require('../../config/logger');
const ration = require("../../models/ration");
const moment = require("moment");

/* add ration*/ 
router.post('/', async(req, res, next) => {
    try 
    {
        let create = await ration.insertOne(req.body);
        if(create.packet_id){
            res.status(200).send({status: true, statusCode: 200, message: "ration added successfully..."});
        }
        else{
            res.status(400).send({status: false, statusCode: 400, err: create});
        }
    }
    catch(err)
    {
        logger.logEvents("Error", err.stack);
        res.status(400).send({status: false, statusCode: 400, message: err.message}); 
    }
});

/* get ration*/
router.get('/', async(req, res, next) => {
    try 
    {
        let water = await ration.sort_ration_water();
        let food = await ration.sort_ration_food();
        res.status(200).send({status: true, statusCode: 200, data:{water,food}})
    }
    catch(err)
    {
        logger.logEvents("Error", err.stack);
        res.status(400).send({status: false, statusCode: 400, message: err.message}) 
    }
});



/* delete offer */
router.delete('/', async(req, res, next) => {
    try 
    {
        let get = await ration.deleteOne({_id: req.query._id});

        res.status(200).send({status: true, statusCode: 200, message: "ration deleted successfully."})
    }
    catch(err)
    {
        logger.logEvents("Error", err.stack);
        res.status(400).send({status: false, statusCode: 400, message: err.message}) 
    }
});

//sort_ration
router.get('/sort_ration', async(req, res, next) => {
    try 
    {
        let sortedRations_food = await ration.sort_ration_food();
        let sortedRations_water = await ration.sort_ration_water();
        //console.log(sortedRations_food)

        const findAllSubsets = (arr = []) => {
            arr.sort();
            const res = [[]];
            let count, subRes, preLength;
            for (let i = 0; i < arr.length; i++) {
               count = 1;
               while (arr[i + 1] && arr[i + 1] == arr[i]) {
                  count += 1;
                  i++;
               }
               preLength = res.length;
               for (let j = 0; j < preLength; j++) {
                  subRes = res[j].slice();
                  for (let x = 1; x <= count; x++) {
                     if (x > 0) subRes.push(arr[i]);
                     res.push(subRes.slice());
                  }
               }
            };
            return res;
         };
        let consume =Array(sortedRations_food.length).fill(0);
        let consumeWater = Array(sortedRations_water.length).fill(0);
        var today=req.query.today;
        var start=req.query.today;

        const endOfDay = () =>{
            // console.log("endofday_today",today)

            var sum=0;
            //calculating total calories from all the food remaining
            for(let i=0;i<consume.length; i++){
                if(consume[i]==0){
                    sum+=sortedRations_food[i].calories; 
                }
            }
            let rwater=0;
            //calculating total water from all the water remaining
            for(let i=0; i<sortedRations_water.length; i++){
                if(!sortedRations_water[i].consumedOn){
                    if(sortedRations_water[i].quantity_in_litres == 1){
                        rwater = rwater +1;
                    }
                    if(sortedRations_water[i].quantity_in_litres >= 2){
                        rwater = rwater +2;
                    }
                }
                
            }
            // console.log("sum",sum)
            // console.log("rwater",rwater)
            if(rwater>=2 && sum>=2500){
                return false;
            }

            return true;
        }

        let consumedWater = (today) => {
            let totalWaterConsumed = 0;
            for(let i=0; i<sortedRations_water.length; i++){
                // console.log("sortedRations_water[i].consumedOn",sortedRations_water[i].consumedOn)
                if(!sortedRations_water[i].consumedOn){
                    if(sortedRations_water[i].quantity_in_litres == 1){
                        totalWaterConsumed = totalWaterConsumed +1;
                    }
                    if(sortedRations_water[i].quantity_in_litres >= 2){
                        totalWaterConsumed = totalWaterConsumed +2;
                    }
                    sortedRations_water[i].consumedOn=today;
                }
                
                if(totalWaterConsumed>=2){
                    break;
                }
            }
            // console.log("waterConsumed",totalWaterConsumed, "today", today)
            return totalWaterConsumed;
        }

        mainWhile:
        while(true){    
            var totalCalories= 0;//total calories consumed in a day
            //check and consume if any package expires on the same day
            for(let i=0; i<consume.length; i++){
                if(sortedRations_food[i].expiry_date==today && consume[i]!=1){
                    consume[i]=1;
                    sortedRations_food[i].consumedOn=today;
                    totalCalories+=sortedRations_food[i].calories;
                }
            }
            // console.log("today",today,"totalCal",totalCalories)
            //check if total calories consumed are more than 2499
            if(totalCalories>=2500){
                //check if water consumed is more than or equal to 2 litres
                let todaysWater1=consumedWater(today);
    
                if(todaysWater1<2){
                    break mainWhile;
                }
                today=moment(today).add(1, 'days').format("YYYY-MM-DD");
                let end = endOfDay();
                if(end){
                    break mainWhile;
                }
                continue;
            }
            var remaining=[];
            var index=[]
            for(let i=0; i<consume.length; i++){
                if(consume[i]==0){

                    remaining.push(sortedRations_food[i].calories);
                    index.push(consume[i]);
                }
            }
            // console.log("remaining",remaining)
            var temp =findAllSubsets(remaining);
            // console.log("temp",temp);
            var addition=0;
            var minimum=999999;
            var currTempArr=temp[0];
            for(let i=0; i<temp.length; i++){
                tempList=temp[i];
                addition=tempList.reduce((a, b) => a + b, 0);
                if(addition+totalCalories>=2500 && addition<minimum){
                    minimum= addition;
                    currTempArr=tempList;
                }
            }
            addition=minimum;
            // console.log("addition",addition,"currTempArr",currTempArr)
            if(totalCalories + addition<2500){
                break mainWhile;
            }

            for(let i=0; i<currTempArr.length; i++){
                for(let j=0; j<consume.length; j++){
                    if(sortedRations_food[j].calories==currTempArr[i] && consume[j]!=1){
                        consume[j]=1;
                        sortedRations_food[j].consumedOn=today;
                        // console.log("consume",consume,"i",i)
                        break;
                    }
                }
            }
            totalCalories=totalCalories+addition;
            // console.log("consume",consume)
            // console.log("totalCalories",totalCalories)
            let todaysWater=consumedWater(today);
            // console.log("water_length",sortedRations_water)

            if(todaysWater<2){
                break mainWhile;
            }
            
            // console.log("sortedRations_water",sortedRations_water)
            today=moment(today).add(1, 'days').format("YYYY-MM-DD");
            // console.log("today",today,"endOfDay",endOfDay())
            //check today is the last day of survival
            if(endOfDay()){
                break mainWhile;
            }else{
                continue;
            }
        }
        
        var totalDays=moment(today).diff(start, 'days');
        //another function
        //sorting the rations based on consumed date
        var schedule =sortedRations_food.concat(sortedRations_water)
        for(let i=0; i<schedule.length; i++){
            if(schedule[i].consumedOn){
                
            }else{
                delete schedule[i]
            }
        }
        hash = schedule.reduce((p,c) => (p[c.consumedOn] ? p[c.consumedOn].push(c) : p[c.consumedOn] = [c],p) ,{}),
        schedule = Object.keys(hash).map(k => ({consumedOn: k, packet_details: hash[k]}));
        schedule.sort((a, b) => {
            return a.consumedOn - b.consumedOn;
        });
        //  console.log(totalDays)
        res.status(200).send({status: true, statusCode: 200, data:{totalDays,schedule}})
    }        //  console.log(totalDays)
    catch(err)
    {
        logger.logEvents("Error", err.stack);
        res.status(400).send({status: false, statusCode: 400, message: err.message}) 
    }
});

module.exports = router;