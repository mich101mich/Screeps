const jobs = [ 'E58S61', 'E57S61', 'E57S62', 'E57S62' ];
module.exports = {
    run: function(creep)
    {
        for (let r in Memory.state)
            if (Memory.state[r] > 2)
                creep.memory.job = r;

        const job = jobs[creep.memory.job] || creep.pos.roomName;
        switch(creep.memory.state)
        {
            default:
                if (Game.time % 5 === 0 || creep.memory.hasTarget)
                {
                    if (creep.pos.roomName === job)
                    {
                        const enemy = creep.pos.findClosestByRange(FIND_CREEPS, {filter: c => c.owner.username !== 'mich101mich'});
                        if (enemy)
                        {
                            creep.moveTo(enemy, {reusePath: 2});
                            if (creep.pos.isNearTo(enemy) && creep.getActiveBodyparts(ATTACK) > 0)
                                creep.attack(enemy);
                            else
                                creep.heal(creep);
                            creep.memory.hasTarget = true;
                            return;
                        }
                    }

                    const friend = creep.pos.findClosestByRange(FIND_MY_CREEPS, {filter: c => c.hits < c.hitsMax - 99});
                    if (friend)
                    {
                        creep.heal(friend);
                        if (!creep.goTo(friend, 1))
                            creep.rangedHeal(friend);
                        creep.memory.hasTarget = true;
                        return;
                    }
                    
                    if (creep.pos.roomName === job)
                    {
                        const lair = _.min(creep.room.find(FIND_STRUCTURES, {filter: s => s.isType(STRUCTURE_KEEPER_LAIR) && s.ticksToSpawn !== undefined}), s => s.ticksToSpawn);
                        if (lair && lair != Infinity)
                        {
                            creep.goTo(lair, 1);
                            creep.memory.hasTarget = true;
                            return;
                        }
                    }
                    
                    delete creep.memory.hasTarget;
                }
                break;
            case STATE_STARTING:
                if (creep.getRoomName() === 'other')
                    creep.findJob();
                delete creep.memory.state;
        }
		if (!creep.goTo(new RoomPosition(25,25,job), 8) || Game.time % 10 !== 0)
		    return;
		if (creep.room.lookForAt(LOOK_STRUCTURES, creep).length === 0 && creep.room.lookForAt(LOOK_CONSTRUCTION_SITES, creep).length === 0)
        {
            delete creep.memory.dir;
            return;
        }
        for (let dir=(creep.memory.dir || 0) + 1; dir <= 8; dir++)
        {
            const p = creep.pos.getInDirection(dir);
            if (!p.inRangeTo(new RoomPosition(25,25,job), 8))
                continue;
            if (creep.room.lookForAt(LOOK_STRUCTURES, p).length > 0 || creep.room.lookForAt(LOOK_CONSTRUCTION_SITES, p).length > 0)
                continue;
            creep.memory.dir = dir;
            creep.move(dir);
            return;
        }
    }
};