const moment = require("moment");
//data for water
let sort_ration_water=[
    {
        "_id": "630f4dd76dfa4b388fb6a075",
        "packet_id": "W1",
        "packet_type": "water",
        "quantity_in_litres": 1
    },
    {
        "_id": "630f4dfb6dfa4b388fb6a079",
        "packet_id": "W3",
        "packet_type": "water",
        "quantity_in_litres": 1
    },
    {
        "_id": "630f4de56dfa4b388fb6a077",
        "packet_id": "W2",
        "packet_type": "water",
        "quantity_in_litres": 2
    }
]
//data for food
let sort_ration_food = [
    {
        "_id": "6308c7612d7bcc2c6d00e4ce",
        "packet_id": "F1",
        "packet_type": "Food",
        "packet_content": "Chips",
        "calories": 1000,
        "quantity_in_litres": 0,
        "expiry_date": "2022-08-21"
    },
    {
        "_id": "6308c9e07f458766c6f9cf2d",
        "packet_id": "F4",
        "packet_type": "Food",
        "packet_content": "paneer",
        "calories": 1300,
        "quantity_in_litres": 0,
        "expiry_date": "2022-08-25"
    },
    {
        "_id": "6308c9c47f458766c6f9cf2b",
        "packet_id": "F3",
        "packet_type": "Food",
        "packet_content": "Roti",
        "calories": 1200,
        "quantity_in_litres": 0,
        "expiry_date": "2022-08-26"
    },
    {
        "_id": "6308c9717f458766c6f9cf29",
        "packet_id": "F2",
        "packet_type": "Food",
        "packet_content": "Biscuits",
        "calories": 1500,
        "quantity_in_litres": 0,
        "expiry_date": "2022-09-15"
    },
    {
        "_id": "63108ba7f71382a269269ea6",
        "packet_id": "F8",
        "packet_type": "Food",
        "packet_content": "Biscuit",
        "calories": 500,
        "expiry_date": "2022-09-21"
    },
    {
        "_id": "630f43eccdfdcf7b913ec4d3",
        "packet_id": "F5",
        "packet_type": "Food",
        "packet_content": "paneer",
        "calories": 2000,
        "quantity_in_litres": 0,
        "expiry_date": "2022-09-25"
    },
    {
        "_id": "630f440ecdfdcf7b913ec4d5",
        "packet_id": "F6",
        "packet_type": "Food",
        "packet_content": "paneer",
        "calories": 500,
        "quantity_in_litres": 0,
        "expiry_date": "2022-10-09"
    },
    {
        "_id": "630f4453cdfdcf7b913ec4d7",
        "packet_id": "F7",
        "packet_type": "Food",
        "packet_content": "french fries",
        "calories": 2500,
        "quantity_in_litres": 0,
        "expiry_date": "2024-08-09"
    }
]
      //logic
        let sortedRations_food = sort_ration_food;
        let sortedRations_water = sort_ration_water;
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
        var today='2019-05-05';
        var start='2019-05-05';

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

        for(let i=0; i<schedule.length; i++){
            console.log(schedule[i])
        }
        // console.log("schedule",schedule)