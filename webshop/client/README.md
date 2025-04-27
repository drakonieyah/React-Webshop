# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

# Code Citations

## License: unknown
https://github.com/nvega23/EBike_Emporium/tree/a940f2e60e3a4cac4065a20433e33e868f02bdbb/backend/routes/products.js

```
}
   });

   // Get all products
   router.get('/', async (req, res) => {
       try {
           const products = await Product.find();
           res.json(products);
       } catch (error) {
           res.status(
```


## License: unknown
https://github.com/Pyrole-2002/Dummy-App/tree/e47cb56ef807fe576fcb0e08f307c89237c19345/backend/routes/products.js

```
);

   // Get all products
   router.get('/', async (req, res) => {
       try {
           const products = await Product.find();
           res.json(products);
       } catch (error) {
           res.status(500)
```


## License: unknown
https://github.com/TahaZaman6547/EcommeceBackEnd/tree/428e920a838edd15b1acecb0e7ea28260da6f143/routes/product.js

```
', async (req, res) => {
       try {
           const products = await Product.find();
           res.json(products);
       } catch (error) {
           res.status(500).json({ error: 'Failed to fetch products' }
```


## License: unknown
https://github.com/linhpham39/Bike-Rental-System/tree/faabf36f0fc1df5fff262de09ec568e9e432303e/backend/controllers/ProductController.js

```
(req, res) => {
       try {
           const products = await Product.find();
           res.json(products);
       } catch (error) {
           res.status(500).json({ error: 'Failed to fetch products' });
       }
```


## License: unknown
https://github.com/nalin360/foodappbackend/tree/3f043eadc6988ceef60c59930b59d2eacfbe9806/index.js

```
) => {
       try {
           const products = await Product.find();
           res.json(products);
       } catch (error) {
           res.status(500).json({ error: 'Failed to fetch products' });
       }
   });

   /
```

## License: Apache_2_0
https://github.com/taposroy1/Assignment/tree/e1eff2b2372e9a5796fde26598ca5a77519f1253/Module-10/index.js

```
const mongoose = require('mongoose');

     const productSchema = new mongoose.Schema({
         name: { type: String, required: true },
         price: { type: Number, required: true },
         description: { type: String, required: true },
```


## License: unknown
https://github.com/overhard-end/auth-service/tree/ba803d75924a05bf73635ff6ab25b76c6ee1bf85/models/user.js

```
require('mongoose');

     const userSchema = new mongoose.Schema({
         email: { type: String, required: true, unique: true },
         password: { type: String, required: true },
         role: { type: String, default: 'user
```


## License: unknown
https://github.com/delacerate/midterm-gigih/tree/0062ea9b5904ca60968f61763cf3dbe3fb17a9d2/db.js

```
= require('mongoose');

   mongoose.connect(process.env.MONGO_URI, {
       useNewUrlParser: true,
       useUnifiedTopology: true,
   })
   .then(() => console.log('Connected to MongoDB'))
   .catch((err) =>
```


## License: unknown
https://github.com/chrisdecember/webRPS/tree/52112a913e24b31dfc956866af417256c0de0946/server.js

```
process.env.MONGO_URI, {
       useNewUrlParser: true,
       useUnifiedTopology: true,
   })
   .then(() => console.log('Connected to MongoDB'))
   .catch((err) => console.error('Failed to connect to MongoDB',
```

