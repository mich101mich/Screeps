const jobs = {
    'E59S62': [
        { pos: new RoomPosition(30,44,'E59S62'), dump: 8, connections: [
            { type: 'energy', sources: [1], targets: [4,8] },
            { type: 'U', sources: [8], targets: [5,4] },
            { type: 'L', sources: [4], targets: [3] },
            { type: 'UL', sources: [2], targets: [4] },
            { type: 'energy', sources: [4], targets: [8], min: 200000 },
            { type: 'energy', sources: [8], targets: [4], min: 10000 },
        ]},
        { pos: new RoomPosition(16,13,'E59S62'), connections: [
            { type: 'energy', sources: [6], targets: [2,1] },
        ]},
    ],
    'E59S61': [
        { pos: new RoomPosition(13,14,'E59S61'), dump: 4, connections: [
            { type: 'energy', sources: [3], targets: [1,7,8,5,4] },
            { type: 'H', sources: [4], targets: [8] },
            { type: 'G', sources: [8], targets: [5] },
            { type: 'energy', sources: [8], targets: [4], min: 200000 },
            { type: 'energy', sources: [4], targets: [1,7,8,5], min: 10000 },
        ]},
        { pos: new RoomPosition(11,12,'E59S61'), dump: 4, connections: [
            { type: 'ZK', sources: [4], targets: [6] },
            { type: 'UL', sources: [4], targets: [7] },
            { type: 'G', sources: [8], targets: [4] },
        ]},
    ],
    'E58S62': [
        { pos: new RoomPosition(14,18,'E58S62'), dump: 6, connections: [
            { type: 'energy', sources: [3], targets: [4,2,6] },
            { type: 'K', sources: [6], targets: [1,2] },
            { type: 'Z', sources: [2], targets: [8] },
            { type: 'ZK', sources: [7], targets: [2] },
            { type: 'energy', sources: [2], targets: [6], min: 200000 },
            { type: 'energy', sources: [6], targets: [2], min: 10000 },
        ]},
    ],
};
module.exports = {
	run: function (creep)
	{
	    if ((Game.cpu.bucket < 500 && Game.time % 8 !== 0) || Game.time % 2 === 0)
	        return;
	    
		let { pos, dump, connections } = jobs[creep.getRoomName()][creep.memory.job] || jobs[creep.getRoomName()][0];
		switch (creep.memory.state)
		{
            default:
                if (creep.ticksToLive < 5)
                {
                    creep.suicide();
                    return;
                }
                if (creep.get() > 0)
                {
                    for (const type in creep.carry)
                    {
                        if (creep.get(type) === 0)
                            continue;
                        if (dump)
                            creep.transfer(Game.getObjectById(dump), type);
                        else
                            creep.drop(type);
                        return;
                    }
                }
                for (const { type, sources, targets, min = 0 } of connections)
                {
                    let amount = 0;
                    for (const id of targets)
                    {
                        if (!Game.getObjectById(id))
                            continue;
                        amount += Game.getObjectById(id).neededResources(type);
                        if (amount >= creep.carryCapacity)
                            break;
                    }
                    if (amount < 100)
                        continue;
                    let source;
                    for (const id of sources)
                    {
                        source = Game.getObjectById(id);
                        if (source && source.get(type) > min)
                        {
                            creep.withdraw(source, type, Math.min(source.get(type) - min, amount, creep.carryCapacity));
                            creep.memory.state = STATE_WORKING;
                            return;
                        }
                    }
                }
                if (dump && creep.pickUp())
                    creep.memory.state = STATE_WORKING;
                return;
			case STATE_WORKING:
                if (creep.get() === 0)
                {
                    delete creep.memory.state;
                    return;
                }
                for (const { type, sources, targets, min = 0 } of connections)
                {
                    if (creep.get(type) === 0)
                        continue;
                    const target = Game.getObjectById(targets.find(t => Game.getObjectById(t) && Game.getObjectById(t).neededResources(type) > 0));
                    if (target)
                    {
                        const amount = Math.min(creep.get(type), target.neededResources(type));
                        creep.transfer(target, type, amount);
                        if (creep.get(type) - amount === 0)
                            delete creep.memory.state;
                        return;
                    }
                }
                for (const type in creep.carry)
                {
                    if (creep.get(type) === 0)
                        continue;
                    if (dump)
                        creep.transfer(Game.getObjectById(dump), type);
                    else
                        creep.drop(type);
                    return;
                }
				return;
			case STATE_STARTING:
				if (creep.memory.job === undefined)
				{
					creep.findJob();
					pos = jobs[creep.getRoomName()][creep.memory.job].pos;
				}
				if (creep.goTo(pos))
				    delete creep.memory.state;
		}
	}
};

for (const room in jobs)
{
    if (!Game.rooms[room])
        continue;
    for (const j in jobs[room])
    {
        const job = jobs[room][j];
        let structures = [];
        for (let i=1;i<=8;i++)
            structures[i] = Game.rooms[room].lookForAt(LOOK_STRUCTURES, job.pos.getInDirection(i))[0];
        structures = structures.map(s => (s ? s.id : undefined));
        job.dump = structures[job.dump];
        for (const c in job.connections)
        {
            job.connections[c].sources = job.connections[c].sources.map(dir => structures[dir]);
            job.connections[c].targets = job.connections[c].targets.map(dir => structures[dir]);
        }
    }
}

