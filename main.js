global.rooms = ['E59S62', 'E59S61', 'E58S62', 'other'];
global.reservations = [  ];
global.claims = [ 'E57S61', 'E57S62', 'E58S61', 'E59S61', 'E59S62', 'E58S62' ];
global.blackList = [ 'E57S61' ];
const roles = { };
const DEFENDER=0, HARVESTER=1,UPGRADER=2,MOVER=3,REDIRECTER=4,MINER=5,BUILDER=6,REPAIRER=7,COLLECTER=8,CLAIMER=9,GATHERER=10;
global.ROLE = ['defender','harvester','upgrader','mover','redirecter','miner','builder','repairer','collecter','claimer','gatherer'];
global.max = {
    'other' : [     1    ,     3     ,     0    ,   0   ,      0     ,   0   ,    0    ,     0    ,     4     ,     0   ,     0    ],
    'E59S62': [     0    ,     2     ,     0    ,   2   ,      2     ,   1   ],
    'E59S61': [     0    ,     1     ,     0    ,   2   ,      2     ,   1   ],
    'E58S62': [     0    ,     2     ,     0    ,   2   ,      1     ,   1   ],
};
global.parts = [
	{ 'move': 25, 'attack': 18, 'heal': 7 }, // defender
	{ 'work': 8, 'carry': 2, 'move': 4 }, // harvester
	{ 'work': 6, 'carry': 1, 'move': 3 }, // upgrader
	{ 'work':  1, 'carry': 19 }, // mover
	{ 'carry': 12, 'move': 1 }, // redirecter
	{ 'work': 12, 'carry': 6 }, // miner
	{ 'work': 15, 'carry': 15 }, // builder
	{ 'work': 20, 'carry': 8 }, // repairer
	{ 'work':  1, 'carry': 27 }, // collecter
	{ 'claim': 5, 'move': 5 }, // claimer
	{ 'work': 8, 'carry': 12, 'move': 10 }, // gatherer
];
global.towers = {
    'other': [],
    'E59S62': ['5807144f5b35cec470f1bf13', '580aa04a9467a0153e9f5aa0', '583637e8d6b6df8f6806b9a6'],
    'E59S61': ['580abd8c5b264d2c07498dd8', '58113f17ffb52d6f29c16b21', '582e15aa0c2f48cd0cccb590', '587168715303c12a5ca188e5', '58716b324896104c500eeeb4', '58716f4c9bc4e78166f850ea'],
    'E58S62': ['5816b0c63ce5b03567601525', '5821c83fb28725375521b837', '58551a5195341e682660b953'],
};
global.links = {
    'other' : [],
    'E59S62': [{ link: '580a932f74724a17702ba780', targets: ['5836203f3a2c112d5c90620c', '580a8511aa3e566d1ec9dd94'] }],
    'E59S61': [{ link: '5810b0ee2ff05dea0d3ef8ef', targets: ['581163f81e3570ed437f842d'] }],
    'E58S62': [{ link: '581b888866ba7b71650a3056', targets: ['5820fc1b99681ba66f51ddd5', '581b6c3403f2eb460ff54b0f']}],
};
global.labs = {
    'other' : {},
    'E59S62': { none: [{ labID: '58318e8581c212d729c2eb2e', sources: ['58319b1fcd51df5772df507c', '5831a59bdbdd066e54d80485'] }] },
    'E59S61': { none: [{ labID: '587d822f4fca26681656bfc8', sources: ['587d466d238d0acd35f14536', '587d519bf4b662ca62fc248c'] }] },
    'E58S62': { none: [{ labID: '587d8e5d56d9ac99164dc573', sources: ['587d99fb1ab8e96a74fc2bf3', '587da4756c0745243ad48030'] }] },
};
global.terminals = {
    'other' : [],
    'E59S62': [ { type: 'UL', target: 'E59S61' } ],
    'E59S61': [],
    'E58S62': [ { type: 'ZK', target: 'E59S61' } ],
};
global.deals = [
    { room: 'E59S61', type: 'H', price: 0.3 },
    { room: 'E59S61', type: 'O', price: 0.3 },
    { room: 'E59S62', type: 'U', price: 0.15 },
    { room: 'E59S62', type: 'L', price: 0.2 },
    { room: 'E58S62', type: 'K', price: 0.1 },
    { room: 'E58S62', type: 'Z', price: 0.1 },
    { room: 'E59S62', type: 'energy', price: 0.01, minStorage: 700000, min: 100000 },
    { room: 'E59S61', type: 'energy', price: 0.01, minStorage: 700000, min: 100000 },
    { room: 'E58S62', type: 'energy', price: 0.01, minStorage: 700000, min: 100000 },
];
global.minerals = {
    'other' : { id: '57efa0c1b8c6899106eaedd4', type: 'U' },
    'E59S62': { id: '57efa0c1b8c6899106eaedd4', type: 'U' },
    'E59S61': { id: '57efa0c1b8c6899106eaedd3', type: 'H' },
    'E58S62': { id: '57efa0c1b8c6899106eaedc2', type: 'K' },
};

module.exports.loop = function ()
{
    let error;
    try
    {


        /*// recycling with a creep
        if (Game.creeps.smash && Game.flags.recycle)
            if (Game.creeps.smash.goTo(Game.flags.recycle,1))
                Game.creeps.smash.say(Game.creeps.smash.dismantle(Game.creeps.smash.room.lookForAt(LOOK_STRUCTURES,Game.flags.recycle)[0]));*/

        // claiming rooms in 'claims'
        if (Game.creeps.claimer && Memory.creeps.claimer.role === -1)
        {
            function isTarget(room) { return room && (!Game.rooms[room] || !Game.rooms[room].controller.my); }
            const c = Game.creeps.claimer;
            let target = c.memory.target;
            if (!isTarget(target))
                target = _.find(claims, r => isTarget(r));
            if (isTarget(target))
            {
                c.memory.target = target;
                const con = (Game.rooms[target] ? Game.rooms[target].controller : new RoomPosition(25,25,target));
                if (c.goTo(con, 1))
                    c.say(c.claimController(con));
            }
        }
        // removing the downgrade timer from controllers
        if (Game.creeps.refresher && Memory.creeps.refresher.role === -1)
        {
            function isTarget(room) { return room && Game.rooms[room] && Game.rooms[room].controller.my && Game.rooms[room].controller.ticksToDowngrade < 3000; }
            const c = Game.creeps.refresher;
            let target = c.memory.target;
            if (!isTarget(target))
                target = _.find(claims, r => isTarget(r));
            if (isTarget(target))
            {
                c.memory.target = target;
                
                if (c.get('energy') === 0)
                {
                    let en = _.find(Game.structures, s => s.pos.roomName === c.pos.roomName && s.get('energy') > 0) || Game.rooms[rooms[0]].storage;
                    if (c.goTo(en, 1))
                        c.withdraw(en, 'energy', 10);
                }
                else
                {
                    const con = (Game.rooms[target] ? Game.rooms[target].controller : new RoomPosition(25,25,target));
                    if (c.goTo(con, 3))
                        c.say(c.upgradeController(con));
                }
            }
        }
        // check weather a claim needs to be refreshed / reclaimed
        if (Game.time % 64 === 0)
        {
            claims.forEach(r => {
                if (Game.rooms[r] && Game.rooms[r].controller.my && Game.rooms[r].controller.ticksToDowngrade && Game.rooms[r].controller.ticksToDowngrade > 1000)
                    return;
                if ((!Game.rooms[r] || !Game.rooms[r].controller.my))
                {
                    if (Game.creeps.claimer)
                        return;
                    let spawn = _.find(Game.spawns, s => !s.spawning && s.room.energyAvailable >= 650);
                    if (spawn)
                        spawn.createCreep([CLAIM,MOVE], 'claimer', {room: 'other', role: -1});
                }
                else
                {
                    if (Game.creeps.refresher)
                        return;
                    let spawn = _.find(Game.spawns, s => !s.spawning && s.room.energyAvailable >= 200);
                    if (spawn)
                        spawn.createCreep([WORK,CARRY,MOVE], 'refresher', {room: 'other', role: -1});
                }
            });
        }

        // attack Room
        //for (let name in Game.spawns)
        //    Game.spawns[name].createCreep([TOUGH,TOUGH,ATTACK,MOVE,MOVE,MOVE], undefined, {room: 'other', role: -4});
        //for (let name in Game.spawns)
        //    Game.spawns[name].createCreep([TOUGH,MOVE,TOUGH,MOVE,TOUGH,MOVE,TOUGH,MOVE,ATTACK,MOVE,ATTACK,MOVE,ATTACK,MOVE,ATTACK,MOVE,ATTACK,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK], undefined, {room: 'other', role: -4});
        //for (let name in Game.spawns)
        //    Game.spawns[name].createCreep([TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK], undefined, {room: 'other', role: -2});
        //for (let name in Game.spawns)
        //    Game.spawns[name].createCreep([TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL], undefined, {room: 'other', role: -3});
        /*_.filter(Game.creeps, c => c.memory.role === -4)
            .forEach(c => {
                const enemy = c.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                if (enemy && c.pos.inRangeTo(enemy, 2))
                {
                    c.moveTo(enemy, {reusePath: 0});
                    c.attack(enemy);
                    return;
                }
                if (!Game.flags['attack'])
                    return;
                if (c.pos.roomName === Game.flags['attack'].pos.roomName && !c.room.controller.my)
                {
                    let structure = c.room.lookForAt(LOOK_STRUCTURES, Game.flags['attack'])[0] || c.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES, {filter: s => s.hits});
                    c.moveTo(structure, {ignoreCreeps: true});
                    if (c.pos.isNearTo(structure))
                        c.attack(structure);
                    else
                        c.attack(c.pos.findClosestByRange(FIND_STRUCTURES));
                    if (structure)
                        return;
                }
                c.moveTo(Game.flags['attack'], {ignoreCreeps:true});
            })
        _.filter(Game.creeps, c => c.memory.role === -2)
            .forEach(c => {
                if (!Game.flags['attack'])
                    return;
                c.moveTo(Game.flags['attack'], {ignoreCreeps:true});
                if (c.pos.roomName === Game.flags['attack'].pos.roomName && !c.room.controller.my)
                {
                    let structure = c.room.lookForAt(LOOK_STRUCTURES, Game.flags['attack'])[0] || c.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES, {filter: s => s.hits});
                    c.moveTo(structure, {reusePath:0,ignoreCreeps:true});
                    c.dismantle(structure);
                }
            })
        /*_.filter(Game.creeps, c => c.memory.role === -3)
            .forEach(c => {
                c.heal(c);
                const creep = c.pos.findClosestByRange(FIND_MY_CREEPS, {filter: c => c.memory.role === -4 && c.hits < c.hitsMax - 300});
                if (creep)
                {
                    c.moveTo(creep, {reusePath: 0});
                    if (c.pos.isNearTo(creep) && creep.hits < creep.hitsMax - 300)
                        c.heal(creep);
                    else if (c.pos.inRangeTo(creep, 3) && creep.hits < creep.hitsMax - 300)
                        c.rangedHeal(creep);
                }
                else
                    c.moveTo(Game.flags['attack'], {reusePath:2, ignoreCreeps:true})
            })*/
    }
    catch(e) {error = e;}

    //return;
	let count = { };
	let creeps = { };
	for (const room of rooms)
	{
	    count[room] = {};
	    creeps[room] = [];
	}
	
	/* Market =====================================================================================================================================================================*/ try {
    /*// always look for tokens ;) just in case
    if (Game.time % 4 === 0)
    {
        const token = Game.market.getAllOrders({type:ORDER_SELL, resourceType:SUBSCRIPTION_TOKEN}).find(o => o.price < Game.market.credits && o.price < 3000000);
        if (token) Game.market.deal(token.id, 1);
    }*/
	if (Game.time % 32 === 0)
    {
        // check through all the deals
        for (const { room, type, price, min = 5000, minStorage = 0 } of deals)
        {
            const r = Game.rooms[room];
            if (!r || !r.terminal || !r.storage || r.storage.get('energy') < 100000 || r.storage.get(type) < minStorage)
                continue;
            // sell resources
            const amount = r.terminal.get(type);
            let buy = _.min(Game.market.getAllOrders({type: ORDER_BUY, resourceType: type})
                .filter(o => o.price >= price && o.amount >= 1000)
                , o => o.price);
            if (!buy || buy == Infinity)
                continue;
            if (amount >= min)
            {
                Game.market.deal(buy.id, Math.min(buy.amount, 10000, amount), room);
                continue;
            }
            
            // buy resources
            const space = r.terminal.neededResources();
            if (space < 5000 || type === 'energy')
                continue;
            let sell = _.min(Game.market.getAllOrders({type: ORDER_SELL, resourceType: type})
                .filter(o => o.price < price && o.amount >= 1000)
                , o => o.price);
            if (sell && sell != Infinity && sell.price < buy.price*0.9)
                Game.market.deal(sell.id, Math.min(sell.amount, 10000, space), room);
        }
    }

	/* Refresh =====================================================================================================================================================================*/ }catch(e) { error = e; } try {
	if (Game.time % 64 === 0)
	{
	    console.log(' ');
		console.log('<span style="color:cyan">--------------------------------- Tick 0x' + Game.time.toString(16).toUpperCase() + ' ---------------------------------</span>');
	}
	if (Game.time % 64 === 0)
	{
        // update repair amount
        Memory.count.energy = _.min(_.filter(Game.rooms, r => r.storage).map(r => r.storage.store['energy']));
        
	    // look for structures that need repairing
		Memory.repair = {};
		_.forEach(Game.rooms, r => {
            if (blackList.indexOf(r.name) !== -1)
                return;
            if (!r.controller || r.controller.my)
            {
                const repairs = r.find(FIND_STRUCTURES, { filter: x => x.needsRepair(false) });
                Memory.repair[r.name] = repairs.map(s => s.id);
                if (repairs.length === 0)
                    delete Memory.repair[r.name];
            }
		});
        Memory.count.repair = _.sum(Memory.repair, r => r.length);
        if (Memory.count.repair > 0)
        {
            let repairs = '';
            for (let r in Memory.repair)
                repairs += r + ': ' + Memory.repair[r].length + '; ';
            console.log('Repairs: ' + repairs + 'Total: <span style="color:' + percentToColor(1-(Memory.count.repair/100)) + '">' + Memory.count.repair + '</span>');
        }
        if (_.size(Game.constructionSites) > 0)
            console.log(_.size(Game.constructionSites) + ' Construction Sites');
	}
	else if (Game.time % 32 === 0)
    {
        // remove structures that have been repaired from Memory
        for (const r in Memory.repair)
        {
            Memory.repair[r] = Memory.repair[r].filter(id => Game.getObjectById(id) && Game.getObjectById(id).needsRepair(true));
            if (Memory.repair[r].length === 0)
                delete Memory.repair[r];
        }
        Memory.count.repair = _.sum(Memory.repair, r => r.length);
    }

	/* Adjust max =====================================================================================================================================================================*/ }catch(e) { error = e; } try {
	max['other'][BUILDER] = Math.ceil(_.filter(Game.constructionSites, c => blackList.indexOf(c.pos.roomName) === -1).length / 100);
	max['other'][REPAIRER] = Math.ceil(Memory.count.repair / 100);
    max['other'][CLAIMER] = Math.ceil(reservations.filter(r => Game.rooms[r] && (!Game.rooms[r].controller.reservation || Game.rooms[r].controller.reservation.ticksToEnd < 3000)).length / 2);

	/* Delete dead Creeps =====================================================================================================================================================================*/ }catch(e) { error = e; } try {
	for (const name in Memory.creeps)
	{
	    // remove dead creeps from memory
		if (!Game.creeps[name])
		{
			delete Memory.creeps[name];
			continue;
		}
		// write all creeps into 'count'
		const creep = Game.creeps[name], room = creep.getRoomName();
		creeps[room].push(name);
		if (creep.isAlive())
			count[room][creep.memory.role] = (count[room][creep.memory.role] || 0) + 1;
	}

	/* Main Loop =====================================================================================================================================================================*/ }catch(e) { error = e; }

	for (const room of rooms)
	{

		/* Towers =====================================================================================================================================================================*/ try {
		if (Game.time % 6 === 0 || Memory.state[room] > 0)
		{
            for (const id of towers[room])
            {
                const tower = Game.getObjectById(id);
                if (!tower)
                    continue;
                // look for any enemies in the room; only target creeps that don't belong to me and can do damage
                const enemy = tower.pos.findClosestByRange(FIND_CREEPS, {filter: c => c.owner.username !== 'mich101mich' && (c.getActiveBodyparts(ATTACK) > 0 || c.getActiveBodyparts(RANGED_ATTACK) > 0 || c.getActiveBodyparts(WORK) > 0 || c.hits < 500)});
                if (enemy)
                {
                    tower.attack(enemy);
                    // invaders don't need to trigger the alarm
                    if (enemy.owner.username === 'Invader')
                    {
                        Memory.state[room] = 1;
                        continue;
                    }
                    // check if any spawn is in danger
                    if (Game.rooms[room].find(FIND_MY_SPAWNS).find(s => s.pos.inRangeTo(enemy, 3) || s.hits < s.hitsMax) && !Game.rooms[room].controller.safeMode)
                        Game.rooms[room].controller.activateSafeMode();
                    if (Memory.state[room] < 3)
                        Game.notify('We are being attacked by: ' + enemy.name + ' of Player ' + enemy.owner.username + ' in tick ' + Game.time);
                    Memory.state[room] = 3;
                    continue;
                }
                Memory.state[room] = 0;
                // heal all injured creeps
                const friend = tower.pos.findClosestByRange(FIND_MY_CREEPS, {filter: c => c.hits < c.hitsMax});
                if (friend)
                {
                    tower.heal(friend);
                    continue;
                }
                if (!Memory.repair[room])
                    continue;
                // find structures that need imideate repairing (aka ramparts)
                let target = Memory.repair[room].find(id => (s = Game.getObjectById(id), s && s.hits < 500));
                if (!target && Memory.count.repair >= 100 && count['other'][REPAIRER] === 0)
                    target = Memory.repair[room].find(id => (t = Game.getObjectById(id), t && t.needsRepair(true)));
                tower.repair(Game.getObjectById(target));
            }
		}

		/* Adjust max =====================================================================================================================================================================*/ }catch(e) { error = e; } try {
        if (room !== 'other')
		    max[room][DEFENDER] = Math.max(0, Memory.state[room]*Memory.state[room] - 2, (_.find(Memory.state, s => s > 2) ? 5 : 0 ));
		if ((Game.rooms[room] && Game.rooms[room].storage && Game.rooms[room].storage.get(minerals[room].type) > 100000) || !Game.getObjectById(minerals[room].id) || Game.getObjectById(minerals[room].id).mineralAmount < 1)
			max[room][MINER] = 0;

		/* Links =====================================================================================================================================================================*/ }catch(e) { error = e; } try {
        links[room].forEach(l => {
            const link = Game.getObjectById(l.link);
            if (link.cooldown > 0 || link.energy < 100)
                return;
            let target = _.find(l.targets, id => (t = Game.getObjectById(id), t && t.energy < 400));
            if (target)
                link.transferEnergy(Game.getObjectById(target));
        });

		/* Terminals =====================================================================================================================================================================*/ }catch(e) { error = e; } try {
		if (Game.time % 16 === 0 && Game.rooms[room] && Game.rooms[room].terminal)
		{
    		let send = false;
    		for (const { type, target, amount = 1000, max = 9000 } of terminals[room])
    		{
    			if (Game.rooms[room].terminal.get(type) >= amount && Game.rooms[target].terminal.get(type) < max && Game.rooms[target].terminal.neededResources(type) > amount)
    			{
    			    Game.rooms[room].terminal.send(type, amount, target);
    			    send = true;
    			    break;
    			}
    		}
    		// send spare energy to a room in need
    		if (!send && Game.time % 4 === 0 && Game.rooms[room].storage && Game.rooms[room].storage.get('energy') > 200000)
    		    for (const r of rooms)
    		        if (r !== room && (rm = Game.rooms[r], rm && rm.storage && rm.terminal && _.sum(rm.terminal.store) + 5000 < rm.terminal.storeCapacity && Game.rooms[room].storage.get('energy') - rm.storage.get('energy') > 200000))
    		        {
    		            Game.rooms[room].terminal.send('energy', 1000, r);
    		            break;
    		        }
		}
		
		/* Labs =====================================================================================================================================================================*/ }catch(e) { error = e; } try {
		for (const type in labs[room])
		{
		    for (const { labID, sources, roles = [] } of labs[room][type])
		    {
    			const lab = Game.getObjectById(labID);
    			if (lab.cooldown === 0)
    			    lab.runReaction(Game.getObjectById(sources[0]), Game.getObjectById(sources[1]));
    			if (lab.mineralAmount < 30 || type === 'none')
    				continue;
    			// boost any creeps around the lab
    			const targets = lab.room.lookForAtArea(LOOK_CREEPS, lab.pos.y - 1, lab.pos.x - 1, lab.pos.y + 1, lab.pos.x + 1, true).map(t => t.creep);
    			for (const target of targets)
    			{
    				if ((target.spawning || target.ticksToLive > 1200) && roles.indexOf(target.memory.role) !== -1 && target.body.find(b => b.boost === undefined && b.type === type) !== undefined)
    				{
    					lab.boostCreep(target);
    					break;
    				}
    			}
		    }
		}

		/* Creeps =====================================================================================================================================================================*/ }catch(e) { error = e; } try {
		for (let c in creeps[room])
		{
			try
			{
			    const name = creeps[room][c], creep = Game.creeps[name], role = creep.getRole();
			    if (creep.spawning || creep.memory.role < 0 || !role)
			        continue;
				if (!roles[creep.memory.role])
					roles[creep.memory.role] = require(role); // only import module if needed
				roles[creep.memory.role].run(creep);
			}
			catch (e) { error = e; }
		}
		
		/* Spawning =====================================================================================================================================================================*/ }catch(e) { error = e; } try {
		let spawn = Game.spawns[room], index = 2;
		
		// find secondary spawns in your own room
		for (let i = 2; spawn && spawn.spawning; i++)
            spawn = Game.spawns[room + i];
        
        // room other can spawn in other spawns and picks the best one
        if (room === 'other' && (!spawn || spawn.spawning || spawn.room.energyAvailable < 400))
            spawn = _.max(Game.spawns, s => (s.spawning ? 0 : s.room.energyAvailable))
        
		if (!spawn || spawn == Infinity || spawn.spawning)
			continue;
		
		const energy = spawn.room.energyAvailable, capacity = spawn.room.energyCapacityAvailable;
		// 200 => WORK,CARRY,MOVE
		if (energy < 200)
			continue;
	    // determine if it is possible to collect more energy
		const strength = (count[spawn.pos.roomName] && count[spawn.pos.roomName][MOVER] > 0 && count[spawn.pos.roomName][HARVESTER] > 0);
		
		for (let role = 0; role < max[room].length; role++)
		{
		    // don't do anything if there are enough
			if ((count[room][role] || 0) >= (max[room][role] || 0))
				continue;
				
			// in case of emergency: spawn the important creeps first
			if (!strength && room !== 'other' && role !== MOVER && role !== HARVESTER)
			    continue;
				
			let body = { };
			// copy the parts object
			for (let p in parts[role])
			    body[p] = parts[role][p];
		    
            // calculate the amount of MOVE parts needed (1 MOVE per 2 other parts)
			if (body.move === undefined)
				body.move = Math.ceil(_.sum(body) / 2);
			
			// calculate the cost of the creep
			let cost = _.sum(body, (amount, part) => BODYPART_COST[part] * amount);
			if (cost > energy)
			{
			    // if we could theoretically spawn the creep, just wait
                if (strength && (cost <= capacity || energy / capacity < 0.6))
                    continue;
                
                // otherwise, scale the creep down
                for (let p in body)
                    body[p] = Math.floor(energy / cost * body[p] * 0.9) || 1; // not perfect, but kinda works
			}

            // turn the count based object into the body array
			let final = [];
			for (let p in body)
				for (let i = 0; i < body[p]; i++)
					final.push(p);

            // spawn the creep
			let result = spawn.createCreep(final, Memory.count.creeps, { role, room, state: STATE_STARTING });
			if (result > 0)
			{
			    spawn.spawning = true;
				console.log('Spawning ' + result + ' the ' + ROLE[role] + ' in ' + spawn.name + ' for ' + room);
				count[room][role] = (count[room][role] || 0) + 1;
				Memory.count.creeps = Memory.count.creeps % 100 + 1;
				break;
			}
		}
		}catch(e) { error = e; }
	}
	
	// Debugging =====================================================================================================================================================================
	if (Game.time % 64 === 0)
	{
	    // print out the CPU and bucket
	    const avgCPU = Memory.cpu.total / Memory.cpu.count;
		console.log('Average CPU: <span style="color:' + (avgCPU >= 10 ? 'red' : 'green') + '">' + avgCPU + '</span>;  ' +
		    'total Bucket: <span style="color:' + percentToColor(Game.cpu.bucket / 10000) + '">' + Game.cpu.bucket + '</span>');
		
	    // print out the storage fill percentage in fancy colors
		let debug = 'Stored Energy: ';
		for (let r in rooms)
            if (Game.rooms[rooms[r]] && Game.rooms[rooms[r]].storage)
            {
                const filled = Game.rooms[rooms[r]].storage.get('energy') / 1000000;
                debug += rooms[r] + ': <span style="color:' + percentToColor(filled*4) + '">' + Math.floor(filled*1000)/10 + '%</span>;  ';
            }
		console.log(debug);
		
		// print out missing creeps
		debug = '';
		rooms.forEach(room => {
            let c = count[room], missing = _.reduce(max[room], (ret,m,role) => { if ((c[role] || 0) < (m || 0)) ret += ROLE[role] + ' x' + ((m || 0) - (c[role] || 0)) + ' '; return ret; }, '')
            if (missing.length > 0) debug += '[ ' + room + ': ' + missing + '] ';
		});
		if (debug.length > 0) console.log('<span style="color:red">Missing: ' + debug + '</span>');
		
		// print out extra creeps
		debug = '';
		rooms.forEach(room => {
            let m = max[room], extra = _.reduce(count[room], (ret,c,role) => { if ((c || 0) > (m[role] || 0)) ret += (ROLE[role] || role) + ' x' + ((c || 0) - (m[role] || 0)) + ' '; return ret; }, '')
            if (extra.length > 0) debug += '[ ' + room + ': ' + extra + '] ';
		});
		if (debug.length > 0) console.log('<span style="color:green">Extra: ' + debug + '</span>');
		
		// print out the number of creeps room other should have
		console.log('Room other: ' + _.reduce(max['other'], (ret,m,role) => { if (m > 0) ret += ROLE[role] + ': ' + m + '  '; return ret; }, ''));
	}
	
    // send a debug message as notification
    if (Game.time % 8192 === 0)
    {
        let message = 'Average CPU usage: ' + (Memory.cpu.total/Memory.cpu.count) + ';  total Bucket: ' + Game.cpu.bucket + ';\n'
            + 'Builds: ' + _.filter(Game.constructionSites, c => blackList.indexOf(c.pos.roomName) === -1).length + ';   '
            + 'Repairs: ' + Memory.count.repair + ';\n'
            + 'Credits: ' + Math.floor(Game.market.credits / 1000) + 'K;\n';
        _.filter(Game.rooms, r => r && r.storage)
            .forEach(r => message += r.name + ': ' + Math.floor(r.storage.get('energy')/10000) + ';  ');
        Game.notify(message, 60);
    }

	// meassure and calculate average CPU usage
	if (!Memory.cpu || Game.time % 8192 === 0)
	    Memory.cpu = { total: 0, count: 0 };
	Memory.cpu.total += Game.cpu.getUsed();
	Memory.cpu.count++;

    // re-throw any error messages -> notification and red triangle next to "Console"
	if (error !== undefined)
	    throw error;
};

global.STATE_STARTING = -1;
global.STATE_COLLECTING = 1;
global.STATE_WORKING = 2;
global.dx = [0, 0, 1, 1, 1, 0, -1, -1, -1];
global.dy = [0, -1, -1, 0, 1, 1, 1, 0, -1];

// turn a room name into coordinates
function RoomToXY (room) {
    const EW = room[0];
    const SN = room.match(/[NSns]/)[0];
    return { x: parseInt(room.substring(1,room.indexOf(SN))) * (EW === 'W' ? -1 : 1), y: parseInt(room.substring(room.indexOf(SN) + 1)) * (SN === 'N' ? -1 : 1) };
}
// turn coordinates into a room name
function XYToRoom (xy) {  return (xy.x < 0 ? 'W' : 'E') + Math.abs(xy.x) + (xy.y < 0 ? 'N' : 'S') + Math.abs(xy.y); }

// return a RoomPosition in the specified direction
RoomPosition.prototype.getInDirection = function (dir) {
	let ret = new RoomPosition(this.x + dx[dir], this.y + dy[dir], this.roomName);
	if (ret.x % 49 !== 0 && ret.y % 49 !== 0)
        return ret;
    let {x, y} = RoomToXY(this.roomName);
	if (ret.x === 0) { x--; ret.x = 49; }
	else if (ret.x === 49) { x++; ret.x = 0; }
	if (ret.y === 0) { y--; ret.y = 49; }
	else if (ret.y === 49) { y++; ret.y = 0; }
	ret.roomName = XYToRoom({x, y});
	return ret;
};
// cheaper comparision that takes any object as parameter
RoomPosition.prototype.equals = function({x,y,roomName}) {
    return this.x === x && this.y === y && this.roomName === roomName;
}
// find the current index on a path
RoomPosition.prototype.getPathIndex = function(path, start) {
    let p = start.getInDirection(0), i;
    for (i = 0; i < path.length; i++)
    {
        if (this.equals(p))
            break;
        p = p.getInDirection(path[i]);
    }
    return (i < path.length ? i : -1);
};
// check the structureType and ID against an 'type', which might be an array
Structure.prototype.isType = function (type)
{
	if (typeof type !== 'object') // aka not an array
		return this.structureType === type || this.id === type;
	for (let i in type)
		if (this.structureType === type[i] || this.id === type[i])
			return true;
	return false;
};
// determine if a structure needs to be repaired or not
Structure.prototype.needsRepair = function (repairing)
{
    let limit = 0.6;
    if (this.structureType === 'constructedWall')
        limit =  0.98;
    if (this.structureType === 'rampart')
        limit = 0.9;
	return this.hits < Math.min(this.hitsMax, Memory.count.energy * 10) * (repairing ? 1 : limit);
};
// get the amount of a certain resource available in a structure
Structure.prototype.get = function (type)
{
	if ((type === 'energy' || !type) && this.energyCapacity)
		return this.energy;
	if (this.storeCapacity)
        return (!type ? _.sum(this.store) : (!this.store || !this.store[type] ? 0 : this.store[type]));
	if (this.structureType === 'lab' && this.mineralType === type)
		return this.mineralAmount;
	if (this.structureType === 'nuker' && type === 'G')
        return this.ghodium;
	return 0;
};
// get the amount of resources of a certain type that a structure needs / can handle
Structure.prototype.neededResources = function (type)
{
	if (this.structureType === 'terminal')
        return Math.min((!type ? this.storeCapacity : (type === 'energy' ? 200000 : 14000)) - this.get(type), this.storeCapacity - this.get());
	if ((type === 'energy' || !type) && this.energyCapacity)
		return this.energyCapacity - this.energy;
	if (this.storeCapacity)
		return this.storeCapacity - _.sum(this.store);
	if (this.structureType === 'lab' && (this.mineralType === type || this.mineralType === null))
		return this.mineralCapacity - this.mineralAmount;
	if (this.structureType === 'nuker' && type === 'G')
        return this.ghodiumCapacity - this.ghodium;
	return 0;
};
// get the amount of a certain resource that a creep holds
Creep.prototype.get = function (type) {
    return (!this.carry || !this.carry[type] ? (!type ? _.sum(this.carry) : 0) : this.carry[type]);
};
// check if a creep has free space
Creep.prototype.isFull = function () {
    return (this.full !== undefined ? this.full : (this.full = _.sum(this.carry) === this.carryCapacity));
};
// check if a creep is about to die
Creep.prototype.isAlive = function () {
    return this.spawning || this.ticksToLive > (this.getRoomName() === 'other' ? 150 : 100);
};
// get the room a creep should be in (kinda deprecated, but whatever)
Creep.prototype.getRoomName = function () {
    return (this.memory.room === -1 ? 'other' : this.memory.room) || this.pos.roomName;
};
// get the name of the role a creep has
Creep.prototype.getRole = function () {
    return ROLE[this.memory.role];
}
// check if another creep has the same role in the same room as this creep
Creep.prototype.isColleague = function (creep)
{
    if (creep.role !== undefined)
        return this.memory.role == creep.role && this.isAlive() && this.getRoomName() === creep.room && this.memory.job !== undefined;
	return this.name !== creep.name && this.memory.role == creep.memory.role && this.isAlive() && this.getRoomName() === creep.getRoomName() && this.memory.job !== undefined;
};
// find the first job that is noch yet taken
Creep.prototype.findJob = function ()
{
    const used = []
    for (let name in Game.creeps)
        if (Game.creeps[name].isColleague(this))
            used[Memory.creeps[name].job] = true;
    for (this.memory.job = 0; used[this.memory.job]; this.memory.job++)
        ;
}
// pick up any resources of a certain type around the creep
Creep.prototype.pickUp = function (type)
{
	let resource = this.room.lookForAtArea(LOOK_RESOURCES, Math.max(this.pos.y - 1, 0), Math.max(this.pos.x - 1, 0), Math.min(this.pos.y + 1, 49), Math.min(this.pos.x + 1, 49), true);
	if (type)
        resource = resource.find(t => t.resource.resourceType === type);
	if (!resource)
		return false;
	this.pickup(resource.resource);
	return true;
};
// move along a given path from a certain start to an optional destination; accepts loops
Creep.prototype.movePath = function (path, start, dest)
{
	if (!this.memory._move || this.memory._move.path !== path)
	{
	    let index = this.pos.getPathIndex(path, start);
		if (index === -1)
		{
			this.goTo(dest || start);
			return false;
		}
		this.memory._move = { path, index, pos: { x: this.pos.x, y: this.pos.y }, ticks: 0 };
	}
	if (this.pos.x !== this.memory._move.pos.x || this.pos.y !== this.memory._move.pos.y)
	{
		this.memory._move.index = (this.memory._move.index + 1) % path.length;
		this.memory._move.ticks = 0;
	}
	else if (++this.memory._move.ticks > 10)
	{
	    delete this.memory._move;
		this.goTo(dest || start);
		return false;
	}
	this.move(parseInt(path[this.memory._move.index]));
	this.memory._move.pos = { x: this.pos.x, y: this.pos.y };
	return true;
};
// edit the cost matrix of the pathfinding algorithm
function editCostMatrix(room, matrix) {
    // handle stationary ore stuck creeps as walls
    _.filter(Game.creeps, c => c.pos.roomName === room && (!c.memory._move || (c.memory._move.ticks || 0) > 5))
        .forEach(c => matrix.set(c.pos.x, c.pos.y, 255));
	if (Game.rooms[room])
	{
	    // DO NOT move anywhere near enemies
    	const enemies = Game.rooms[room].find(FIND_HOSTILE_CREEPS);
    	for (let e in enemies)
    	    for (let dx = -5; dx <= 5; dx++)
    	        for (let dy = -5; dy <= 5; dy++)
    	            matrix.set(enemies[e].pos.x + dx, enemies[e].pos.y + dy, 255);
	}
	return matrix;
}
// better alternative to moveTo with custom pathfinding parameters and proper path handling
Creep.prototype.goTo = function (target, range = 0)
{
    if (target.pos) target = target.pos;
    // if we are already there and not at the edge of a room, we are done
    if (this.pos.inRangeTo(target, range) && this.pos.x%49 !== 0 && this.pos.y%49 !== 0)
    {
        delete this.memory._move;
        return true;
    }
    // if we can't move, why bother?
    if (this.fatigue > 0)
        return false;
    
    let move = this.memory._move;
    // check weather everything is still correct with the path
    if (!move ||
        !move.target ||
        move.target.x !== target.x ||
        move.target.y !== target.y ||
        move.target.roomName !== target.roomName ||
        move.ticks >= 10 ||
        move.index >= move.path.length)
    {
        // calculate a new path (make the damn PathSelecter already!)
        const path = this.pos.findPathTo(target, {reusePath: 19, ignoreCreeps: true, serialize: true, costCallback: editCostMatrix}).substring(4);
        this.memory._move = move = { target, path, index: 0, ticks: 0, pos: { x: this.pos.x, y: this.pos.y } };
    }
    // check if we are stuck
	if (this.pos.x === move.pos.x && this.pos.y === move.pos.y)
	    this.memory._move.ticks++;
	else
	{
		this.memory._move.index++;
		this.memory._move.ticks = 0;
	}
	// move in the next direction (no need for deserializing, silly dev)
	this.move(parseInt(move.path[move.index]));
	this.memory._move.pos = { x: this.pos.x, y: this.pos.y };
	return false;
};
// turn a percentage into a nice color blend from red to green :)
function percentToColor(percent) {
    percent = Math.max(0,Math.min(percent, 1));
    const color = Math.floor(percent*255);
    return '#' + (color >= 240?'0':'') + (255-color).toString(16) + (color<16?'0':'') + color.toString(16) + '00';
}

