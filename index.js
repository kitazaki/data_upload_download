const http = require('http');
const PORT = 80;
const fs = require('fs');
var html = fs.readFileSync('index.html');

http.createServer(function(req, res) {
 if(req.method === 'GET') {
   console.log(req.url);
   if(req.url === '/') {
     res.writeHead(200, {'Content-Type': 'text/html'});
     res.end(html);
   } else {
     var filename = req.url.split('/');
     console.log(filename[1]); 
     var isExist = false;
     try {
       fs.statSync(filename[1]);
       isExist = true;
     } catch(err) {
       isExist = false;
     }
     if(isExist) {
       var file = fs.readFileSync(filename[1])
       res.writeHead(200, {'Content-Type': 'text/plain'});
       res.end(file);
     } else {
       res.writeHead(404, {"Content-Type": "text/plain"});
       res.write("404 Not Found\n");
       res.end();
       console.log("file not found")
     }
   }

 } else if(req.method === 'POST') {
   var data = [];
   console.log(req.url);
   var filename = req.url.split('/');
   console.log(filename[1]);

   //POSTデータを受けとる
   req.on('data', function(chunk) {data.push(chunk)})
     .on('end', function() {
       var buf = Buffer.concat(data);
       res.writeHead(200, {'Content-Type': 'text/plain'});
       res.end('Succeded to receive');
       fs.writeFile(filename[1], buf, (err) => {
         if (err) throw err;
         console.log('正常に書き込みが完了しました');
       });
     })
   }
 
}).listen(PORT);
console.log(`Server running. Port is ${PORT}`);
