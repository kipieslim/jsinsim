const Packets = require('./packets.js');

const DEFAULT_VEHICLES = { XFG: 1, XRG: 2, XRT: 4, RB4: 8, FXO: 0x10, LX4: 0x20, LX6: 0x40, MRT: 0x80, UF1: 0x100, RAC: 0x200, FZ5: 0x400, FOX: 0x800, XFR: 0x1000, UFR: 0x2000, FO8: 0x4000, FXR: 0x8000, XRR: 0x10000, FZR: 0x20000, BF1: 0x40000, FBM: 0x80000 };

class PlayerHandler {
    constructor(data) {
        this.hostName = data.hostName;
        this.ucid = data.ucid;
        this.uname = data.uname;
        this.pname = data.pname;
        this.admin = !!data.admin;
        this.language = 0;
        this.userid = 0;
        this.ip = false;

        this.vehicle = false;
    }

    message(text, sound = 0) {
        Packets.send(this.hostName, 'IS_MTC', { ucid: 255, text: text, sound: sound });
    }

    kick() {
        Packets.send(this.hostName, 'IS_MST', { text: '/kick ' + this.uname });  
    }

    allowVehicles(vehicles) {
        var c = 0;
        for(const vehicle of vehicles) {
            if(DEFAULT_VEHICLES[vehicle] !== undefined) {
                c += DEFAULT_VEHICLES[vehicle];
            }
        }

        Packets.send(this.hostName, 'IS_PLC', { ucid: this.ucid, cars: c });
    }
}

class PlayersHandler {
    constructor() {
        this.players = [];

        // handle IS_NCN & IS_NCI & IS_CNL packets
        // IS_NCN: player connect
        // IS_NCI: player connect info
        // IS_CNL: player disconnect

        Packets.on('IS_NCN', (data) => {
            if(data.ucid === 0) return;
            this.players.push(new PlayerHandler(data));
        });

        Packets.on('IS_NCI', (data) => {
            const player = this.getByUCID(data.hostName, data.ucid);
            if(player) {
                player.language = data.language;
                player.userid = data.userid;
                player.ip = data.ipaddress;
            }
        });

        Packets.on('IS_CNL', (data) => {
            const deleted = this.deleteByUCID(data.hostName, data.ucid);
            if(deleted) {
                // player deleted
            }
        });
    }

    all(hostName = false) {
        if(hostName) {
            const host = Server.hosts[hostName];
            if(host === undefined) {
                throw 'InSim.Players.all: err: host ' + hostName + ' configuration not defined!';
            }

            return this.players.filter(player => player.hostName === hostName);
        }

        return this.players;
    }

    getByUCID(hostName, ucid) {
        var exists = false;
        for(const player of this.players) {
            if(player.hostName == hostName && player.ucid == ucid) {
                exists = player;
            }
        }

        return exists;
    }

    deleteByUCID(hostName, ucid) {
        var deleted = false;
        for(const player of this.players) {
            if(player.hostName == hostName && player.ucid == ucid) {
                const indexOf = this.players.indexOf(player);
                if(indexOf !== -1) {
                    this.players.splice(indexOf, 1);
                    deleted = true;
                }
            }
        }

        return deleted;
    }
}

module.exports = new PlayersHandler;