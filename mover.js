const jobs = {
	'E59S62': [
        { start: new RoomPosition(31,41,'E59S62'), path: '6211111881111188888888111888184544455544444444555554455555' },
    ],
	'E59S61': [
        { start: new RoomPosition(13,17,'E59S61'), path: '26444444433333333333332222222666666677777777777778888888' },
    ],
	'E58S62': [
        { start: new RoomPosition(15,20,'E58S62'), path: '7623328422233222444444443333444444488888887777888888886667766667' },
    ],
	'other' : [
        { start: new RoomPosition(31,41,'E59S62'), path: '621111188111118888888811188844455544444444555554455555' },
    ],
};
module.exports = {
	run : function(creep)
	{
	    if (Game.cpu.bucket < 500 && Game.time % 2 === 0)
	        return;
	    
		if (Game.time % 20 === (creep.memory.job || 0) * 2 && creep.getActiveBodyparts('carry') < 4 && (spawn = Game.spawns[creep.getRoomName()], spawn && spawn.room.energyAvailable > 800 && !spawn.spawning))
		    creep.suicide();
	    if (!jobs[creep.getRoomName()]) jobs[creep.getRoomName()] = jobs['other'];
		let { start, path, type = 'energy', sources = ['storage', 'link'], targets = ['extension', 'spawn', 'tower'] } = jobs[creep.getRoomName()][creep.memory.job] || jobs[creep.getRoomName()][0];
		if (creep.ticksToLive < 30)
		    targets.concat(sources);
		switch (creep.memory.state)
		{
			default:
                creep.movePath(path, start);
                creep.pickUp(type);
                let structures;
                try { structures = creep.room.lookForAtArea(LOOK_STRUCTURES, creep.pos.y -1, creep.pos.x -1, creep.pos.y +1, creep.pos.x +1, true).map(s => s.structure); }catch(e){ };
                if (structures && structures.length > 0)
                {
                    if (creep.get(type) > 0)
                    {
                        const target = structures.find(s => s.isType(targets) && s.neededResources(type) > 0);
                        if (target)
                        {
                            creep.transfer(target, type, Math.min(creep.get(type), target.neededResources(type)));
                            return;
                        }
                    }
                    if (creep.ticksToLive > 30 && !creep.isFull())
                    {
                        const source = structures.find(s => s.isType(sources) && s.get(type) > 0);
                        creep.withdraw(source, type);
                        if (source) return;
                    }
                    if (creep.get('energy') === 0)
                        return;
                    const repair = structures.find(s => s.needsRepair(true));
                    creep.repair(repair);
                    if (repair) return;
        		}
                if (creep.get('energy') > 0)
                {
                    creep.build(_.find(Game.constructionSites, s => s.pos.inRangeTo(creep, 3)));
                    if (!_.find(Game.constructionSites, s => s.structureType === STRUCTURE_ROAD && s.pos.isEqualTo(creep)) && creep.pos.getPathIndex(path,start) !== -1)
                        creep.pos.createConstructionSite(STRUCTURE_ROAD);
                }
				return;
			case STATE_STARTING:
				creep.findJob();
				delete creep.memory.state;
		}
	}
};