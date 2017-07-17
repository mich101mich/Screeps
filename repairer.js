const idleSpots = {
    'E59S62': new RoomPosition(40,37,'E59S62'),
    'E59S61': new RoomPosition( 9,20,'E59S61'),
    'E58S62': new RoomPosition(17,16,'E58S62'),
};
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
                if (creep.get('energy') == 0)
                    delete creep.memory.state;
		}
		if (Game.time % 3 === 0 && !creep.isFull())
            creep.pickUp('energy');
		switch (creep.memory.state)
		{
			default:
			    if (creep.ticksToLive < 50)
			    {
			        creep.suicide();
			        return;
			    }
			    let source = Game.getObjectById(creep.memory.source);
			    if (!source || source.get('energy') === 0)
                    source = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: s => s.isType(['container','storage','link']) && s.get('energy') > 500});
			    if (!source || source.get('energy') === 0)
			        break;
			    creep.memory.source = source.id;
                if (creep.goTo(source, 1))
                {
                    creep.withdraw(source, 'energy');
                    delete creep.memory.source;
                }
                return;
			case STATE_WORKING:
				let target = Game.getObjectById(creep.memory.target);
				if ((!target || !target.needsRepair(true)) && Memory.count.repair > 0)
				{
				    let min = 50, minI = -1;
					for (const i in Memory.repair[creep.pos.roomName])
					{
						target = Game.getObjectById(Memory.repair[creep.pos.roomName][i]);
						if (!target || !target.needsRepair(true))
						{
                            Memory.repair[creep.pos.roomName][i] = undefined;
                            continue;
						}
						const range = target.pos.getRangeTo(creep);
						if (range < min)
						{
                            min = range;
                            minI = i;
                            if (min < 3)
                                break;
						}
					}
					if (minI !== -1)
                    {
                        target = Game.getObjectById(Memory.repair[creep.pos.roomName][minI]);
                        Memory.repair[creep.pos.roomName][minI] = undefined;
                    }
				}
				if ((!target || !target.needsRepair(true)) && Memory.count.repair > 0)
                {
                    for (const r in Memory.repair)
                    {
                        target = Game.getObjectById(Memory.repair[r].find(s => (st = Game.getObjectById(s), st && st.needsRepair(true))));
                        if (target && target.needsRepair(true))
                            break;
                    }
                }
				if (target && target.needsRepair(true))
				{
					if (creep.goTo(target, 3))
					    creep.repair(target);
					else
                        creep.repair(creep.room.lookForAt(LOOK_STRUCTURES, creep)[0]);
					creep.memory.target = target.id;
					return;
				}
				else
				    delete creep.memory.target;
		}
		let room = _.max(_.filter(Game.rooms, r => r.storage), r => r.storage.get('energy'));
		room = (!room || room == Infinity || !idleSpots[room.name] ? 'E59S62' : room.name);
		const dest = idleSpots[room];
		creep.goTo(dest);
	}
};