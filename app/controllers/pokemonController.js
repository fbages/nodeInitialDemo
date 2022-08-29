//Controller que fa una petició a POKEMON API, passant un número Id, extreu de tota la resposta, el nom, alçada i pes del Pokemon identificat

const http = require('http');
const https = require('https');

exports.pokemon = async (req, res) => {
    try {
        let idPokemon = req.params.id;
        let output = '';
    
    
        //configuracio de la peticio HTTPS
        const options = {
            host: 'pokeapi.co',
            port: 443,
            path: '/api/v2/pokemon/' + idPokemon,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        const port = options.port == 443 ? https : http;
    
        const req2 = port.request(options, (res2) => {
            
            //console.log(`statusCode: ${res2.statusCode}`);
            res2.setEncoding('utf8');
    
            res2.on('data', chunk => {
                output += chunk;
              });
    
            res2.on('end', () => {
                if(output!='Not Found'){
                    let obj = JSON.parse(output);
                    res.send({
                        status: true,
                        message:`El nom del pokemon és ${obj.name}, la seva alçada és ${obj.height} i pesa ${obj.weight}`});
                } else {
                    res.status(404);
                    res.send({
                        status: false,
                        message:'Pokemon not found'
                    });
                }
                //  onResult(res.statusCode, obj);
            });
        
            res2.on('error', (err) => {
            res.status(400);
            res.send({
                status: false,
                message:"error de busqueda"
            })
             });
        })
       
      req2.end( );
        
    } catch (error) {
       res.send({
        status: false,
        message:'error: ' + error.message
    });
    }
  
}