// 1. Destructure the getDb function from your connection file
const { getDb } = require("../connection"); 

const get_table = async (req, res) => {
    try {
        // 2. Await the database instance to ensure it's connected
        const db = await getDb(); 
        
        // 3. Use 'db' directly (this replaces db.sample_db)
        let target = await db.collection("Target").find({schedule:"today"}).sort().toArray();
        let result = await db.collection("Exercise").find({target:target[0].target}).sort().toArray();

        let checklist = await db.collection("Checklist").find().sort().toArray();
       
        res.send({
            exercises: result,
            checklist: checklist
        });
    } catch (err) {
        console.error("Fetch Error:", err.message);
        return res.status(400).json({ error: err.message });
    }
};

const next = async (req, res) => {
    try {
        // 2. Await the database instance to ensure it's connected
        const db = await getDb(); 

        await db.collection("Checklist").deleteMany({})
        let data = req.body.content;

        for(let x=0; x < data.length; x++){
            await db.collection("Exercise").updateOne(
                { name: data[x].name },
                { $set: { "reps": data[x].reps, 
                            "weight": data[x].weight, 
                            "dropsets": data[x].dropsets, 
                            "speed": data[x].speed,
                            "sets": data[x].sets,
                            "rest_time": data[x].rest_time} 
                }
            )
        }

        // 3. Use 'db' directly (this replaces db.sample_db)
        let targets = await db.collection("Target").find().sort().toArray();

        let pass = 0
        for(let x = 0; x < targets.length; x++){
            if(pass == 1 && targets[x].schedule != "if_available"){
                await db.collection("Target").updateOne(
                { target: targets[x].target },
                { $set: { "schedule": "today" } }
                )
                break;
            }
            if(targets[x].schedule == "today"){
                await db.collection("Target").updateOne(
                { target: targets[x].target },
                { $set: { "schedule": "next" } }
                )
                pass = 1
            }
            if(x+1 == targets.length){
                await db.collection("Target").updateOne(
                { target: targets[0].target },
                { $set: { "schedule": "today" } }
                )
            }
        }

        let target = await db.collection("Target").find({schedule:"today"}).sort().toArray();
        let result = await db.collection("Exercise").find({target:target[0].target}).sort().toArray();
        
        let checkarray = [];
        for (let y = 0; y < result.length; y++) {
        // 1. Create a fresh object for this specific result item
            let newEntry = {};

            for (let z = 0; z < result[y].sets; z++) {
                // 2. Dynamically add "set1", "set2", etc. to the object
                newEntry["set" + (z + 1)] = "uncheck";
            }

            // 3. Push the completed object into the array
            checkarray.push(newEntry);
        }

        // 4. Insert the array of objects into MongoDB
        await db.collection("Checklist").insertMany(checkarray);
        let checklist = await db.collection("Checklist").find().sort().toArray();
        res.send({
            exercises: result,
            checklist: checklist
        });
    } catch (err) {
        console.error("Fetch Error:", err.message);
        return res.status(400).json({ error: err.message });
    }
};

const updatecheck = async (req, res) => {
    const { index, set } = req.query; 
    const setKey = `set${set}`; // e.g., "set1"

    const db = await getDb();

        const checklist = await db.collection("Checklist").find().toArray();
        const targetDoc = checklist[parseInt(index)];
        await db.collection("Checklist").updateOne(
            { _id: targetDoc._id }, 
            { $set: { [setKey]: "check" } } 
        );

        res.status(200).send("Updated");
};

const insert_data = async (req, res) => {
    try {
        // 2. Await the database instance here as well
        const db = await getDb(); 
        let params = req.body;
        
        // 3. Use 'db' directly
        let result = await db.collection("user").find({ age: params.age }).toArray();
        
        if (result.length == 0) {
            await db.collection("user").insertOne({ 
                name: params.name, 
                age: params.age 
            });
        } else {
            await db.collection("user").updateOne(
                { age: params.age }, 
                { $set: { name: params.name } }
            );
        }
        res.status(500).send('Internal Server Error: 500');

    } catch (err) {
        // console.error('504 Gateway Timeout');
        res.status(504).send('504 Gateway Timeout');
    }
};

module.exports = { get_table, next, updatecheck, insert_data };