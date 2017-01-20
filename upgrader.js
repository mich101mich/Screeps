const jobs = {
    'E59S62': { pos: new RoomPosition(29,43,'E59S62'), spots: [1,8,7,5] },
    'E59S61': { pos: new RoomPosition(14,15,'E59S61'), spots: [2,3,4,6,7] },
    'E58S62': { pos: new RoomPosition(40,36,'E58S62'), spots: [5,6,7,8,1,2,3] },
    'other' : { pos: new RoomPosition(33,40,'E59S61'), spots: [8,7,6,5,4,3,2] },
};
module.exports = {
	run: function (creep)
	{
	    let job = jobs[creep.getRoomName()] || jobs['other'],pos;
		switch (creep.memory.state)
		{
			default:
			    if (Game.time % Math.max(10 - Math.floor(Game.cpu.bucket / 1000), 1) !== 0)
			        return;
			
        	    pos = job.pos.getInDirection(job.spots[creep.memory.job]);
                creep.pickUp('energy')
                const source = creep.room.lookForAt(LOOK_STRUCTURES, job.pos).find(s => s.storeCapacity !== undefined || s.energyCapacity !== undefined);
                if (!source)
                {
                    creep.build(creep.room.lookForAt(LOOK_CONSTRUCTION_SITES, job.pos)[0])
                    return;
                }
				if (creep.get('energy') < 10 && creep.ticksToLive > 30)
                    creep.withdraw(source, 'energy');
                else if (creep.get('energy') < 10 && creep.ticksToLive < 20)
                    creep.suicide();
                else if (source.needsRepair(true))
                    creep.repair(source);
                creep.upgradeController(creep.room.controller);
				return;
			case STATE_STARTING:
				if (creep.memory.job === undefined)
					creep.findJob();
        	    pos = job.pos.getInDirection(job.spots[creep.memory.job]);
				if (creep.goTo(pos))
				    delete creep.memory.state;
		}
	}
};