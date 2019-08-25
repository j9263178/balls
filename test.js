var re = new RegExp(/(?<=sid: ')(.*?)(?=',)/)
var socket = " maxHttpBufferSize: 100000000,\n" +
    "        httpCompression: [Object],\n" +
    "        supportsBinary: true,\n" +
    "        _events: [Object],\n" +
    "        _eventsCount: 5,\n" +
    "        sid: 'vNm7UZASSE1Eu9cxAAAA',\n" +
    "        req: null,\n" +
    "        res: null,\n" +
    "        writable: false },"

var sid=re.exec(socket);

console.log(sid);