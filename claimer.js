const jobs = [
    { room: 'E57S62', attack: false },
];
module.exports = {
    run : function(creep)
    {
        let targets = reservations.map(r => {return {room: r, attack: false}}).concat(jobs);
        let { room, attack } = targets[creep.memory.job] || {};
        switch(creep.memory.state)
        {
            default:
                if (attack)
                    creep.attackController(creep.room.controller);
                else
                    creep.reserveController(creep.room.controller);
                return;
            case STATE_STARTING:
                if (creep.memory.job === undefined)
                {
                    const used = []
                    for (let name in Game.creeps)
                        if (Game.creeps[name].isColleague(creep))
                            used[Memory.creeps[name].job] = true;
                    for (let j in targets)
                    {
                        if (!used[j] && (targets[j].attack || !Game.rooms[targets[j].room] || !Game.rooms[targets[j].room].controller.reservation || Game.rooms[targets[j].room].controller.reservation.ticksToEnd < 3000))
                        {
                            creep.memory.job = j;
                            room = targets[j].room;
                            break;
                        }
                    }
                }
                if (creep.pos.roomName === room)
                {
                    if (creep.goTo(creep.room.controller, 1))
				        delete creep.memory.state;
				    return;
                }
				creep.goTo((Game.rooms[room] ? Game.rooms[room].controller : new RoomPosition(25,27,room)));
        }
    }
};