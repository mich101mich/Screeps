const jobs = {
    'E59S62': {start: new RoomPosition(30,42,'E59S62'), dest: new RoomPosition(43,43,'E59S62'), toSource: '2433333333334', toTarget: '8777777777786', sourceID: '57efa0c1b8c6899106eaedd4', targetID: '58084c461cbdb8932c410f3f', type: 'U'},
    'E59S61': {start: new RoomPosition(14,16,'E59S61'), dest: new RoomPosition(44,15,'E59S61'), toSource: '64444444333333333333322222222332', toTarget: '67766666666777777777777788888882', sourceID: '57efa0c1b8c6899106eaedd3', targetID: '580c19179673ada767b60ce9', type: 'H'},
    'E58S62': {start: new RoomPosition(14,20,'E58S62'), dest: new RoomPosition(43,28,'E58S62'), toSource: '332222332224444444433334444445', toTarget: '188888877778888888866677666677', sourceID: '57efa0c1b8c6899106eaedc2', targetID: '5818404b7ae2960d21dd8ae2', type: 'K'},
};
module.exports = {
	run: function (creep)
	{
	    const { start, dest, toSource, toTarget, sourceID, targetID, type } = jobs[creep.getRoomName()] || jobs['other'];
		switch (creep.memory.state)
		{
			default:
                if (creep.isFull())
                    creep.memory.state = STATE_WORKING;
                break;
			case STATE_WORKING:
                if (creep.get(type) < 1)
                    delete creep.memory.state;
		}
		switch (creep.memory.state)
		{
			default:
			    const source = Game.getObjectById(sourceID)
				if (source && source.mineralAmount < 1)
				{
				    if (creep.get(type) < 1)
				        creep.suicide();
				    else
				        creep.memory.state = STATE_WORKING;
				    return;
				}
			    if (creep.pos.isEqualTo(dest))
			    {
			        if (Game.time % 6 !== 0)
			            return;
			        creep.harvest(source);
				    delete creep.memory._move;
			    }
			    else
			    {
			        creep.movePath(toSource, start, dest);
                    if (creep.ticksToLive < toTarget.length + 150)
                        creep.suicide();
                    if (Game.time % 3 === 0)
                        creep.pickUp(type);
                }
				return;
			case STATE_WORKING:
			    const target = Game.getObjectById(targetID);
				if (creep.pos.isEqualTo(start))
				{
				    creep.transfer(target, type);
				    delete creep.memory._move;
				    return;
				}
				else
				    creep.movePath(toTarget, dest, start);
				return;
		}
	}
};