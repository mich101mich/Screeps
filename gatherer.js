const jobs = [
];
module.exports = {
	run: function (creep)
	{
		switch (creep.memory.state)
		{
			default:
                if (creep.isFull())
                    creep.memory.state = STATE_WORKING;
                break;
			case STATE_WORKING:
                if (creep.get('energy') === 0)
                    delete creep.memory.state;
                break;
            case 3:
                if (Game.time % 100 === 0)
                    delete creep.memory.state;
		}
		const { start, dest, toSource, back, sourceID, targetID } = jobs[creep.memory.job] || jobs[0];
		
		if ((creep.memory.state || 0) === 3 || (dest && creep.pos.roomName === dest.roomName && creep.room.find(FIND_HOSTILE_CREEPS).length > 0) || creep.getActiveBodyparts(CARRY) === 0 || creep.getActiveBodyparts(WORK) === 0)
		{
		    creep.drop('energy');
            creep.movePath(back, dest, start);
            creep.memory.state = 3;
		    return;
		}
		
		switch (creep.memory.state)
		{
            default:
                if (!creep.pos.inRangeTo(start, 1))
                    creep.pickUp('energy')
                if (creep.pos.isEqualTo(dest))
                {
                    const source = Game.getObjectById(sourceID);
                    creep.harvest(source, 'energy');
                    delete creep.memory._move;
                }
                else if (creep.ticksToLive < 150)
                    creep.suicide();
                else
                    creep.movePath(toSource, start, dest);
				return;
			case STATE_WORKING:
                if (creep.pos.isEqualTo(start))
                {
                    const target = Game.getObjectById(targetID);
                    creep.transfer(target, 'energy');
                    delete creep.memory._move;
                    return;
                }
                creep.movePath(back, dest, start);
                if (creep.pos.x % 49 === 0 || creep.pos.y % 49 === 0)
                    return;
                const structures = creep.room.lookForAtArea(LOOK_STRUCTURES, creep.pos.y -1, creep.pos.x -1, creep.pos.y +1, creep.pos.x +1, true).map(s => s[s.type]);
                if (structures.length > 0)
                {
                    const target = structures.find(s => s && s.isType(['extension', 'container']) && s.neededResources('energy') > 0);
                    if (target)
                    {
                        creep.transfer(target, 'energy', Math.min(creep.get('energy'), target.neededResources('energy')));
                        return;
                    }
                    const repair = structures.find(s => s && s.needsRepair(true));
                    if (repair)
                    {
                        creep.repair(repair);
                        return;
                    }
                }
                const build = _.find(Game.constructionSites, s => s.pos.inRangeTo(creep, 3));
                if (build)
                {
                    creep.build(build);
                    if (build.structureType === STRUCTURE_ROAD)
                        creep.cancelOrder('move');
                    return;
                }
                if (creep.room.lookForAt(LOOK_STRUCTURES, creep).find(s => s.structureType === STRUCTURE_ROAD) || !creep.memory._move || !creep.memory._move.index)
                    return;
                if (creep.pos.getPathIndex(toSource, start) !== -1)
                    creep.pos.createConstructionSite(STRUCTURE_ROAD);
				return;
			case STATE_STARTING:
			    creep.findJob();
			    if (creep.memory.job >= jobs.length)
			        creep.memory.job = 0;
				delete creep.memory.state;
				return;
		}
	}
};