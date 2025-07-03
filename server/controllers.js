// server/controllers.js
const fs = require('fs').promises;
const path = require('path');

const dataFilePath = path.join(__dirname, '../data/data.json');

// Helper function to read data from JSON file
async function readData() {
    try {
        const data = await fs.readFile(dataFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading data:', error);
        // Initialize default data if file doesn't exist or can't be read
        return {
            codename: "Newbie",
            level: 1,
            hp: 80, // match UI
            mood: 65, // match UI
            focus: 45, // match UI
            exp: 65,  //match UI
            stats: {
                Intelligence: 85, // match UI
                Physical: 60,   // match UI
                Spiritual: 70,  // match UI
                Core: 75,       // match UI
                Psyche: 65,     // match UI
            },
            quests: [
                { id: "quest1", text: "Complete morning routine", completed: false },
                { id: "quest2", text: "Work on project for 2h", completed: false },
                { id: "quest3", text: "30min physical training", completed: false },
                { id: "quest4", text: "Meditation session", completed: false },
                { id: "quest5", text: "Learn something new", completed: false },
            ],
        };
    }
}

// Helper function to write data to JSON file
async function writeData(data) {
    try {
        await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.error('Error writing data:', error);
    }
}


// Controller to get data
async function getData(req, res) {
    try {
        const data = await readData();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get data' });
    }
}

// Controller to update data
async function updateData(req, res) {
    const updateType = req.body.type;
    const data = await readData(); // Fetch current data

    try {
        if (updateType === 'quest') {
            const questId = req.body.questId;
            const completed = req.body.completed;

            data.quests = data.quests.map(quest =>
                quest.id === questId ? { ...quest, completed: completed } : quest
            );
        } else if (updateType === 'stat'){
            const statName = req.body.statName;
            const statValue = req.body.statValue;

            if(data.stats.hasOwnProperty(statName)){
                data.stats[statName] = statValue;
            }
        } else if (updateType === 'vital'){
            const vitalName = req.body.vitalName;
            const vitalValue = req.body.vitalValue;

            if(data.hasOwnProperty(vitalName)){
                data[vitalName] = vitalValue;
            }
        }
        await writeData(data);
        res.json({ message: 'Data updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update data' });
    }
}

module.exports = { getData, updateData };