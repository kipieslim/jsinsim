const ezstruct = require('ezstruct');
ezstruct.setStringEncoding('ASCII');

const packets = {};
packets.IS_ISI = (data) => {
    data.size = 44;
    data.type = 1;

    const struct = `
    typedef struct {
        unsigned char size;
        unsigned char type;
        unsigned char reqi;
        unsigned char zero;

        unsigned short udpport;
        unsigned short flags;

        unsigned char insimver;
        unsigned char prefix;
        unsigned short interval;

        char admin[16];
        char iname[16];
    } data;`;

    return pack(struct, data);
};

packets.IS_VER = (data) => {
    data.size = 20;
    data.type = 2;

    const struct =  `
        typedef struct {
            unsigned char size;
            unsigned char type;
            unsigned char reqi;
            unsigned char zero;

            char version[8];
            char product[6];
            unsigned char insimver;
            unsigned char spare;
        } data;`;

    return unpack(struct, data);
}

packets.IS_TINY = (data) => {
    data.size = 4;
    data.type = 3;

    const struct = `
        typedef struct {
            unsigned char size;
            unsigned char type;
            unsigned char reqi;
            unsigned char subt;
        } data;`;

    return pack(struct, data);
};

packets.IS_SMALL_PACK = (data) => {
    data.size = 8;
    data.type = 4;

	const struct =  `
        typedef struct {
            unsigned char size;
            unsigned char type;
            unsigned char reqi;
            unsigned char subt;

            unsigned long uval;
        } data;`;

    return pack(struct, data);
};

packets.IS_SMALL = (data) => {
	const struct =  `
        typedef struct {
            unsigned char size;
            unsigned char type;
            unsigned char reqi;
            unsigned char subt;

            unsigned long uval;
        } data;`;

    return unpack(struct, data);
};

packets.IS_ISM = (data) => {
    data.size = 40;
    data.type = 10;

	const struct = `
        typedef struct {
            unsigned char size;
            unsigned char type;
            unsigned char reqi;
            unsigned char zero;

            unsigned char host;
            unsigned char sp1;
            unsigned char sp2;
            unsigned char sp3;

            char hname[32];
        } data;`;

    return unpack(struct, data);
}

// IS_STA
// IS_SFP
// IS_MOD

//const windows = require('windows1257');

packets.IS_MSO = (data) => {
    data.size = 136;
    data.type = 11;

    const struct = `
        typedef struct {
            unsigned char size;
            unsigned char type;
            unsigned char reqi;
            unsigned char zero;

            unsigned char ucid;
            unsigned char plid;
            unsigned char usertype;
            unsigned char textstart;

            char msg[128];
        } data;`;

    return unpack(struct, data);
}

// IS_III
// IS_ACR

packets.IS_MST = (data) => {
    if(data.text === undefined) {
        data.text = '';
    }

    data.text = data.text.slice(0, 63);

    data.size = 68;
    data.type = 13;

    const struct = `
        typedef struct {
            unsigned char size;
            unsigned char type;
            unsigned char reqi;
            unsigned char zero;

            char text[64];
        } data;`;

    return pack(struct, data);
}

// IS_MSX
// IS_MSL


packets.IS_MTC = (data) => {
    if(data.text === undefined) {
        data.text = '';
    }

    var len = data.text.length + 1;

    if(len >= 127) len = 127;
    if((len % 4) != 0) len += 4 - (len % 4);

    data.size = 8 + len;
    data.type = 14;

    const struct = `
        typedef struct {
            unsigned char size;
            unsigned char type;
            unsigned char reqi;
            unsigned char sound;

            unsigned char ucid;
            unsigned char plid;
            unsigned char sp2;
            unsigned char sp3;

            char text[${len}];
        } data;`;

    return pack(struct, data);
}

// IS_SCH

packets.IS_VTN = (data) => {
    data.size = 8;
    data.type = 16;

    const struct = `
        typedef struct {
            unsigned char size;
            unsigned char type;
            unsigned char reqi;
            unsigned char zero;

            unsigned char ucid;
            unsigned char action;
            unsigned char sp2;
            unsigned char sp3;
        } data;`;

    return unpack(struct, data);
}

// ISP_RST

packets.IS_PLC = (data) => {
    data.size = 12;
    data.type = 53;

    const struct = `
        typedef struct {
            unsigned char size;
            unsigned char type;
            unsigned char reqi;
            unsigned char zero;

            unsigned char ucid;
            unsigned char sp1;
            unsigned char sp2;
            unsigned char sp3;

            unsigned long cars;
        } data;`;

    return pack(struct, data);
}

// IS_RST

packets.IS_NCN = (data) => {
    data.size = 56;
    data.type = 18;

    const struct = `
        typedef struct {
            unsigned char size;
            unsigned char type;
            unsigned char reqi;
            unsigned char ucid;

            char uname[24];
            char pname[24];

            unsigned char admin;
            unsigned char total;
            unsigned char flags;
            unsigned char sp3;
        } data;`;

    return unpack(struct, data);
}

packets.IS_NCI = (data) => {
    data.size = 16;
    data.type = 19;

    const struct = `
        typedef struct {
            unsigned char size;
            unsigned char type;
            unsigned char reqi;
            unsigned char ucid;

            unsigned char language;
            unsigned char sp1;
            unsigned char sp2;
            unsigned char sp3;

            unsigned long userid;
            unsigned long ipaddress;
        } data;`;
    
    var buf = unpack(struct, data);

    // IP adress
    var IP = [];
	for (var i = 0; i < 4; i++) {
		IP.push(data[12+i]);
    }
    buf.ipaddress = IP.join('.');

    return buf;
}

packets.IS_CNL = (data) => {
    data.size = 8;
    data.type = 19;

    const struct = `
        typedef struct {
            unsigned char size;
            unsigned char type;
            unsigned char reqi;
            unsigned char ucid;

            unsigned char reason;
            unsigned char total;
            unsigned char sp2;
            unsigned char sp3;
        } data;`;

    return unpack(struct, data);
}

packets.IS_CPR = (data) => {
    data.size = 36;
    data.type = 20;

    const struct = `
        typedef struct {
            unsigned char size;
            unsigned char type;
            unsigned char reqi;
            unsigned char ucid;

            char pname[24];
            char plate[8];
        } data;`;

    return unpack(struct, data);
}

packets.IS_NPL = (data) => {
    data.size = 76;
    data.type = 21;

    const struct = `
        typedef struct {
            unsigned char size;
            unsigned char type;
            unsigned char reqi;
            unsigned char plid;

            unsigned char ucid;
            unsigned char ptype;
            signed short flags;

            char pname[24];
            char plate[8];

            char cname[4];
            char sname[16];
            char tyres[4];

            unsigned char hmass;
            unsigned char htres;
            unsigned char model;
            unsigned char pass;

            int spare;

            unsigned char setf;
            unsigned char nump;
            unsigned char sp2;
            unsigned char sp3;
        } data;`;

    return unpack(struct, data);
}

packets.IS_PLP = (data) => {
    data.size = 76;
    data.type = 22;

    const struct = `
        typedef struct {
            unsigned char size;
            unsigned char type;
            unsigned char reqi;
            unsigned char plid;
        } data;`;

    return unpack(struct, data);
}

packets.IS_PLL = (data) => {
    data.size = 76;
    data.type = 23;

    const struct = `
        typedef struct {
            unsigned char size;
            unsigned char type;
            unsigned char reqi;
            unsigned char plid;
        } data;`;

    return unpack(struct, data);
}

packets.IS_CRS = (data) => {
    data.size = 76;
    data.type = 24;

    const struct = `
        typedef struct {
            unsigned char size;
            unsigned char type;
            unsigned char reqi;
            unsigned char plid;
        } data;`;

    return unpack(struct, data);
}

// IS_LAP
// IS_SPX

packets.IS_PIT = (data) => {
    data.size = 24;
    data.type = 26;

    const struct = `
        typedef struct {
            unsigned char size;
            unsigned char type;
            unsigned char reqi;
            unsigned char plid;

            unsigned short lapsdone;
            unsigned short flags;

            unsigned char sp0;
            unsigned char penalty;
            unsigned char numstops;
            unsigned char sp3;

            char tyres[4];

            unsigned long work;
            unsigned long spare;
        } data;`;

    return unpack(struct, data);
}

packets.IS_PSF = (data) => {
    data.size = 12;
    data.type = 27;

    const struct = `
        typedef struct {
            unsigned char size;
            unsigned char type;
            unsigned char reqi;
            unsigned char plid;

            unsigned long stime;
            unsigned long spare;
        } data;`;

    return unpack(struct, data);
}

// IS_PLA
// IS_CCH

packets.IS_PEN = (data) => {
    data.size = 8;
    data.type = 30;

    const struct = `
        typedef struct {
            unsigned char size;
            unsigned char type;
            unsigned char reqi;
            unsigned char plid;

            unsigned char oldpen;
            unsigned char newpen;
            unsigned char reason;
            unsigned char sp3;

        } data;`;

    return unpack(struct, data);
}

packets.IS_TOC = (data) => {
    data.size = 8;
    data.type = 31;

    const struct = `
        typedef struct {
            unsigned char size;
            unsigned char type;
            unsigned char reqi;
            unsigned char plid;

            unsigned char olducid;
            unsigned char newucid;
            unsigned char sp2;
            unsigned char sp3;

        } data;`;

    return unpack(struct, data);
}

// IS_TOC
// IS_FLG
// IS_PFL
// IS_FIN
// IS_RES
// IS_REO
// IS_AXI
// IS_AXO

packets.IS_MCI = (data) => {
    data.size = 32;
    data.type = 38;

    const struct = `
        typedef struct {
            unsigned char size;
            unsigned char type;
            unsigned char reqi;
            unsigned char numc;
        } data;`;

    const buf = unpack(struct, data);

    if(buf.compcar === undefined) {
        buf.compcar = [];
    }

    
    for(let i = 0; i < buf.numc; i++)
	{
		// Next packet start position
		var start = 4 + (i * 28);
		var tbuf = data.slice(start, (start + 28));

		var c = packets.CompCar(tbuf);
        buf.compcar.push(c);
    }

    return buf;
}
/*
packets.IS_CON = (data) => {
    data.size = 40;
    data.type = 50;

    const struct = `
        typedef struct {
            unsigned char size;
            unsigned char type;
            unsigned char reqi;
            unsigned char zero;

            unsigned short spclose;
            unsigned short time;
        } data;`;

    


    const buf = unpack(struct, data);

    
    console.log(data, data.slice(9, 24), data.slice(24, 39));
    buf.c1 = packets.CarContact(data.slice(9, 24));
    buf.c2 = packets.CarContact(data.slice(24, 40));

    console.log(buf);

    return buf;
}
*/
packets.IS_OBH = (data) => {
    data.size = 24;
    data.type = 51;

    const struct = `
        typedef struct {
            unsigned char size;
            unsigned char type;
            unsigned char reqi;
            unsigned char plid;

            unsigned short spclose;
            unsigned short time;

            char c[8];

            signed short x;
            signed short y;

            unsigned char zbyte;
            unsigned char sp1;
            unsigned char index;
            unsigned char obhflags;
        } data;`;


    const buf = unpack(struct, data);
    buf.c = packets.CarContOBJ(data.slice(8, 16));

    return buf;
}

packets.IS_OCO = (data) => {
    data.size = 8;
    data.type = 60;

    const struct = `
        typedef struct {
            unsigned char size;
            unsigned char type;
            unsigned char reqi;
            unsigned char zero;

            unsigned char ocoaction;
            unsigned char index;
            unsigned char identifier;
            unsigned char data;
        } data;`;

    return pack(struct, data);
}

// IS_HLV

packets.IS_AXM_UNPACK = (data) => {
    data.size = 0;
    data.type = 54;

    const struct = `
        typedef struct {
            unsigned char size;
            unsigned char type;
            unsigned char reqi;
            unsigned char numo;

            unsigned char ucid;
            unsigned char pmoaction;
            unsigned char pmoflags;
            unsigned char sp3;
        } data;`;

    const buf = unpack(struct, data);

    buf.objects = [];

    for(let i = 0; i < buf.numo; i++)
	{
		var start = 8 + (i * 8);
		var tbuf = data.slice(start, (start + 28));

		var c = packets.ObjectInfo(tbuf);
        buf.objects.push(c);
    }
    
    return buf;
}

packets.IS_AXM_PACK = (data) => {
    data.size = 8 + (data.info !== undefined ? 8 : 0);
    data.type = 54;

    const struct = `
        typedef struct {
            unsigned char size;
            unsigned char type;
            unsigned char reqi;
            unsigned char numo;

            unsigned char ucid;
            unsigned char pmoaction;
            unsigned char pmoflags;
            unsigned char sp3;
        } data;`;

    var buf = pack(struct, data);

    if(data.info !== undefined) {
        const inf = data.info;
        delete data.info;

        buf = Buffer.concat([buf,  packets.ObjectInfoPack(inf)]);
    }

    return buf;
}

packets.IS_AXM_PACK_ARRAY = (data) => { // array
    var objects = JSON.parse(JSON.stringify(data.info));

    if(data.numo > 60 || objects.length > 60) {
        var buffer = Buffer.alloc(0);

        for (var i = 0; i < Math.floor(objects.length/60); i++) {
            data.size = 8 + (60 * 8);
            data.type = 54;
            data.numo = 60;
            data.info = objects.slice(i*60, i*60+60);

            buffer = Buffer.concat([buffer,  packets.IS_AXM_PACK_ARRAY_SEND(data)]);
        }

        if(objects.length % 60 > 0) {
            data.size = 8 + (objects.length % 60 * 8);
            data.type = 54;
            data.numo = objects.length % 60;
            data.info = objects.slice(Math.floor(objects.length/60)*60, Math.floor(objects.length/60)*60+objects.length % 60);
            
            buffer = Buffer.concat([buffer,  packets.IS_AXM_PACK_ARRAY_SEND(data)]);
        }

        return buffer;

        /*if(data.info.length % 60 > 0) {
            console.log(Math.floor(data.info.length/60)*60 + data.info.length % 60)
        }*/
       //data.size = 8 + (Math.floor(data.info.length/60) * 8);
        //data.type = 54;

        //console.log(data.size)
    }
    else {
        return packets.IS_AXM_PACK_ARRAY_SEND(data);
    }
}

packets.IS_AXM_PACK_ARRAY_SEND = (data) => { // array
    data.size = 8 + (data.numo * 8);
    data.type = 54;

    const struct = `
        typedef struct {
            unsigned char size;
            unsigned char type;
            unsigned char reqi;
            unsigned char numo;

            unsigned char ucid;
            unsigned char pmoaction;
            unsigned char pmoflags;
            unsigned char sp3;
        } data;`;
    
    var info = false;
    if(data.info !== undefined) {
        info = data.info;
        delete data.info;
    }

    var buf = pack(struct, data);

    if(info) {
        info.forEach(object => {
            buf = Buffer.concat([buf,  packets.ObjectInfoPack(object)]);
        });
    }

    //console.log(buf.length)

    return buf;
}

// IS_SCC
// IS_CPP
// IS_RIP
// IS_SSH

packets.IS_BFN = (data) => {
    data.size = 8;
    data.type = 42;

    const struct = `
        typedef struct {
            unsigned char size;
            unsigned char type;
            unsigned char reqi;
            unsigned char subt;

            unsigned char ucid;
            unsigned char clickid;
            unsigned char clickmax;
            unsigned char inst;
        } data;`;

    if(data[3] == 2 || data[3] == 3) {
        return unpack(struct, data);
    }
    else {
        return pack(struct, data);
    }
}

packets.IS_BTN = (data) => {
    var len = data.text.length + 1;

	if (len > 240)
		len = 240;

	if ((len % 4) != 0)
        len += 4 - (len % 4);
        
    data.size = 12 + len;
    data.type = 45;

    const struct = `
        typedef struct {
            unsigned char size;
            unsigned char type;
            unsigned char reqi;
            unsigned char ucid;

            unsigned char clickid;
            unsigned char inst;
            unsigned char bstyle;

            unsigned char typein;
            unsigned char l;
            unsigned char t;
            unsigned char w;
            unsigned char h;

            char text[${len}];
        } data;`;

    return pack(struct, data);
}

packets.IS_BTT = (data) => {
    data.size = 104;
    data.type = 47;

    const struct = `
        typedef struct {
            unsigned char size;
            unsigned char type;
            unsigned char reqi;
            unsigned char ucid;

            unsigned char clickid;
            unsigned char inst;
            unsigned char typein;
            unsigned char sp3;

            char text[96];
        } data;`;

    return unpack(struct, data);
}

packets.IS_BTC = (data) => {
    data.size = 8;
    data.type = 46;

    const struct = `
        typedef struct {
            unsigned char size;
            unsigned char type;
            unsigned char reqi;
            unsigned char ucid;

            unsigned char clickid;
            unsigned char inst;
            unsigned char cflags;
            unsigned char sp3;
        } data;`;

    return unpack(struct, data);
}

packets.IS_JRR = (data) => {
    data.size = 16;
    data.type = 58;

    const struct = `
        typedef struct {
            unsigned char size;
            unsigned char type;
            unsigned char reqi;
            unsigned char plid;

            unsigned char ucid;
            unsigned char jrraction;
            unsigned char sp2;
            unsigned char sp3;
        } data;`;

    var j = packets.ObjectInfoPack({ X: 0, Y: 0, Z: 0, flags: 0, heading: 0 });
    if(data.x !== undefined && data.y !== undefined || data.z !== undefined) {
        j = packets.ObjectInfoPack({ X: data.x * 16, Y: data.y * 16, Z: data.z * 4, flags: 128, index: 0, heading: data.heading });
    }

    return Buffer.concat([pack(struct, data),  j]);
}

packets.IS_CIM = (data) => {
    data.size = 8;
    data.type = 64;

    const struct = `
        typedef struct {
            unsigned char size;
            unsigned char type;
            unsigned char reqi;
            unsigned char ucid;

            unsigned char mode;
            unsigned char submode;
            unsigned char seltype;
            unsigned char sp3;
        } data;`;


    return unpack(struct, data);
}

packets.CompCar = (data) => {
    const struct = `
        typedef struct {
            unsigned short node;
            unsigned short lap;

            unsigned char plid;
            unsigned char position;
            unsigned char info;
            unsigned char sp3;

            signed long x;
            signed long y;
            signed long z;

            unsigned short speed;
            unsigned short direction;
            unsigned short heading;
            signed short angvel;
        } data;`;

    const buf = unpack(struct, data);

    // data
    buf.speed = buf.speed / 32768 * 360;
    buf.x = buf.x / 65536;
    buf.y = buf.y / 65536;
    buf.z = buf.z / 65536;
    buf.heading = buf.heading / 182.0444444;

    return buf;
}

packets.ObjectInfo = (data) => {
    const struct = `
        typedef struct {
            signed short X;
            signed short Y;
            unsigned char Z;

            unsigned char flags;
            unsigned char index;
            unsigned char heading;
        } data;`;

    return unpack(struct, data);
}

packets.ObjectInfoPack = (data) => {
    const struct = `
        typedef struct {
            signed short X;
            signed short Y;
            unsigned char Z;

            unsigned char flags;
            unsigned char index;
            unsigned char heading;
        } data;`;

    return pack(struct, data);
}

packets.CarContOBJ = (data) => {
    const struct = `
        typedef struct {
            unsigned char direction;
            unsigned char heading;
            unsigned char speed;
            unsigned char zbyte;

            signed short X;
            signed short Y;
        } data;`;

    return unpack(struct, data);
}

packets.CarContact = (data) => {
    const struct = `
        typedef struct {
            unsigned char plid;
            unsigned char info;
            unsigned char sp2;
            unsigned short steer;

            unsigned char thrbrk;
            unsigned char cluhan;
            unsigned char gearsp;
            unsigned char speed;

            unsigned char direction;
            unsigned char heading;
            unsigned short accelf;
            unsigned short accelr;
        } data;`;

    return unpack(struct, data);
}


////////////////////////////////////////
const pack = (struct, data) => {
    if(data.size !== undefined) {
        data.size = data.size / 4;
    }
   
    const __f = ezstruct(struct);
    const buffer = __f.data.toBinary(data);

    return buffer;
}

const unpack = (struct, data) => {
    //data.size /= 4;

    const __f = ezstruct(struct);
    const buffer = __f.data.fromBinary(data);

    return buffer;
}

//////////////////////////////

const PACKETS = [ 
    'IS_NONE', 'IS_ISI', 'IS_VER', 'IS_TINY', 'IS_SMALL', 'IS_STA', 'IS_SCH',
    'IS_SFP', 'IS_SCC', 'IS_CPP', 'IS_ISM', 'IS_MSO', 'IS_III', 'IS_MST', 'IS_MTC',
    'IS_MOD', 'IS_VTN', 'IS_RST', 'IS_NCN', 'IS_CNL', 'IS_CPR', 'IS_NPL', 'IS_PLP',
    'IS_PLL', 'IS_LAP', 'IS_SPX', 'IS_PIT', 'IS_PSF', 'IS_PLA', 'IS_CCH', 'IS_PEN',
    'IS_TOC', 'IS_FLG', 'IS_PFL', 'IS_FIN', 'IS_RES', 'IS_REO', 'IS_NLP', 'IS_MCI',
    'IS_MSX', 'IS_MSL', 'IS_CRS', 'IS_BFN', 'IS_AXI', 'IS_AXO', 'IS_BTN', 'IS_BTC',
    'IS_BTT', 'IS_RIP', 'IS_SSH', 'IS_CON', 'IS_OBH', 'IS_HLV', 'IS_PLC', 'IS_AXM_UNPACK',
    'IS_ACR', 'IS_HCP', 'IS_NCI', 'IS_JRR', 'IS_UCO', 'IS_OCO', 'IS_TTC', 'IS_SLC',
    'IS_CSC', 'IS_CIM', 'IS_MAL'
];

const getById = (id) => {
    return PACKETS[id] === undefined ? false : PACKETS[id];
};

const getPacketBuffered = (name, data) => {
    return packets[name] === undefined ? false : packets[name](data);
};

module.exports = { 
    packets: packets, 
    getById: getById, 
    getPacketBuffered: getPacketBuffered 
};