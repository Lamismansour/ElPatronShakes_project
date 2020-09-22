var db = require('./db.json');
const jsonServer = require('json-server');
const { contains } = require('jquery');
const server = jsonServer.create();
const router = jsonServer.router('./db.json');
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 3000;

server.use(jsonServer.rewriter({
    '/api/products': '/products'
}));
server.use(jsonServer.bodyParser);
server.use(middlewares);

server.get('/get/products', (req, res) => {
  let id = req.query['id'];
  if (id != null && id >= 0) {
      let result = db.products.find(product => {
          return product.id == id;
      })
      if (result) {
          let {id, ...product} = result;
          return res.status(200).jsonp(product);
      } else {
          res.status(400).jsonp({
          error: "Bad product id"
          });
      };
  } else {
      res.status(400).jsonp({
          error: "No valid product id"
      });
  } 
});
server.post('/post/product', (req,res) => {
    if (req.method === 'POST') {
      let id = req.body['id'];
      if (id != null && id >= 0) {
        let result = db.products.find(product => {
          return product.id == id;
        })
  
        if (result) {
          let {id, ...product} = result;
          return res.status(200).jsonp(product);
        } else {
          res.status(400).jsonp({
            error: "Bad product id"
          });
        }
      } else {
        res.status(400).jsonp({
          error: "No valid product id"
        });
      }
    }
  });

// const axios = require('axios');
// var productsList = [];
// axios.get('http://localhost:3000/products')
//     .then(resp => {
//         data = resp.data;
//         data.forEach(e => {
//             productsList= [(e.name),(e.img)];
            
//         });
//     })
//     .catch(error => {
//         console.log(error);
//     });    

server.use(router);
server.listen(port);