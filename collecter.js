const jobs = [
    { start: new RoomPosition(14,16,'E59S61'), dest: new RoomPosition( 6,27,'E58S61'), toSource: '668888777777666666666666677777777777777777777777777777777', back: '333333333333333333333333333333332222222222222333333444422', sourceDir: 6, targetDir: 1 },
    { start: new RoomPosition( 5,29,'E58S61'), dest: new RoomPosition(32,44,'E57S61'), toSource: '66665555555666666668877777788', back: '44333333442222222211111112222', sourceDir: 7, targetDir: 1 },
    { start: new RoomPosition(13,20,'E58S62'), dest: new RoomPosition(38,21,'E57S62'), toSource: '56666677788888766667778881', back: '54443332222344444333222221' , sourceDir: 7, targetDir: 1 },
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
		}
		const { start, dest, toSource, back, sourceDir, targetDir } = jobs[creep.memory.job] || jobs[0];
		switch (creep.memory.state)
		{
            default:
                if (!creep.pos.inRangeTo(start, 1) && Game.time % 3 === 0)
                    creep.pickUp('energy')
                if (creep.pos.isEqualTo(dest))
                {
                    const pos = creep.pos.getInDirection(sourceDir);
                    const source = creep.room.lookForAt(LOOK_STRUCTURES, pos)[0];
                    if (source)
                        creep.withdraw(source, 'energy');
                    else
                        creep.build(creep.room.lookForAt(LOOK_CONSTRUCTION_SITES, pos)[0]);
                    delete creep.memory._move;
                }
                else if (creep.ticksToLive < toSource.length + 40)
                    creep.suicide();
                else
                    creep.movePath(toSource, start, dest);
				return;
			case STATE_WORKING:
                if (creep.pos.isEqualTo(start))
                {
                    const pos = creep.pos.getInDirection(targetDir);
                    const target = creep.room.lookForAt(LOOK_STRUCTURES, pos)[0];
                    if (!target && creep.build(creep.room.lookForAt(LOOK_CONSTRUCTION_SITES, pos)[0]) === ERR_INVALID_TARGET)
                        creep.drop('energy');
                    else
                        creep.transfer(target, 'energy');
                    delete creep.memory._move;
                    return;
                }
                creep.movePath(back, dest, start);
                if (Game.time === 0)
                    return;
                const road = creep.room.lookForAt(LOOK_STRUCTURES, creep).find(s => s.structureType === STRUCTURE_ROAD);
                if (road)
                {
                    if (road.hits < road.hitsMax)
                        creep.repair(road);
                    return;
                }
                if (creep.build(creep.room.lookForAt(LOOK_CONSTRUCTION_SITES, creep)[0]) !== ERR_INVALID_TARGET)
                    return;
                if (creep.pos.getPathIndex(toSource, start) !== -1)
                    creep.pos.createConstructionSite(STRUCTURE_ROAD);
				return;
			case STATE_STARTING:
			    creep.findJob();
			    if (creep.memory.job >= jobs.length)
			        creep.memory.job = 0;
				delete creep.memory.state;
		}
	}
};