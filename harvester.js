const jobs = {
    'E59S62': [
		{ pos: new RoomPosition(28,44,'E59S62'), sourceID: '57ef9e5386f108ae6e60f246', targets: [2,3] },
		{ pos: new RoomPosition(18, 6,'E59S62'), sourceID: '57ef9e5386f108ae6e60f244', targets: [4,7,5,6] },
    ],
    'E59S61': [
		{ pos: new RoomPosition(33, 8,'E59S61'), sourceID: '57ef9e5386f108ae6e60f241', targets: [6] },
    ],
    'E58S62': [
		{ pos: new RoomPosition(12,20,'E58S62'), sourceID: '57ef9e5086f108ae6e60f207', targets: [2] },
		{ pos: new RoomPosition(40,41,'E58S62'), sourceID: '57ef9e5086f108ae6e60f209', targets: [8,1] },
    ],
    'other' : [
		{ pos: new RoomPosition( 4,27,'E58S61'), sourceID: '57ef9e5086f108ae6e60f205', targets: [4] },
		{ pos: new RoomPosition(31,43,'E57S61'), sourceID: '57ef9e4d86f108ae6e60f1c2', targets: [5] },
		{ pos: new RoomPosition(38,20,'E57S62'), sourceID: '57ef9e4d86f108ae6e60f1c4', targets: [6] },
    ],
};
module.exports = {
	run: function (creep)
	{
	    if (!jobs[creep.getRoomName()]) jobs[creep.getRoomName()] = jobs['other'];
		let { pos, sourceID, targets} = jobs[creep.getRoomName()][creep.memory.job] || jobs[creep.getRoomName()][0];
		if (creep.getActiveBodyparts('work') < 3 && (spawn = Game.spawns[creep.getRoomName()], spawn && spawn.room.energyAvailable >= 800 && !spawn.spawning))
		    creep.suicide();
		switch (creep.memory.state)
		{
			default:
			    if (creep.room.storage && creep.room.storage.neededResources('energy') < 50000)
			        return;
			    const source = Game.getObjectById(sourceID);
			    if (source.energy === 0)
			        return;
                creep.harvest(source);
                if (creep.get('energy') < 10)
                    return;
                for (let t in targets)
                {
                    let target = creep.room.lookForAt(LOOK_STRUCTURES, creep.pos.getInDirection(targets[t])).find(s => s.storeCapacity !== undefined || s.energyCapacity !== undefined);
                    switch(Game.time % 4)
                    {
                        case 0:
                            if (target && target.neededResources('energy') > 0) creep.transfer(target, 'energy', Math.min(creep.get('energy'), target.neededResources('energy')));
                            else continue;
                            return;
                        case 1:
                            if (!target) creep.build(creep.room.lookForAt(LOOK_CONSTRUCTION_SITES, creep.pos.getInDirection(targets[t]))[0]);
                            else continue;
                            return;
                        case 2:
                            if (target && target.hits < target.hitsMax)
                                creep.repair(target);
                            else continue;
                            return;
                        case 3:
                            if (target && target.neededResources('energy') > 0) creep.pickUp('energy');
                    }
                }
				return;
			case STATE_STARTING:
				if (creep.memory.job === undefined)
				{
					creep.findJob();
					pos = (jobs[creep.getRoomName()][creep.memory.job] || jobs[creep.getRoomName()][0]).pos;
				}
				if (creep.goTo(pos))
				    delete creep.memory.state;
		}
	}
};