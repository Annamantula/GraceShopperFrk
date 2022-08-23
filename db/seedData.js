const  client  = require('./client');
const {
  createCart,
  createOrderProduct, 
  createOrder,
  createCartProducts, 
  createUser, 
  createProduct,
  createContactInfo
} = require('./index');
  

  async function dropTables() {
    try {
    console.log("Dropping All Tables...")
    await client.query (`
        DROP TABLE IF EXISTS orders_products;
        DROP TABLE IF EXISTS orders;
        DROP TABLE IF EXISTS cart_products;
        DROP TABLE IF EXISTS cart;
        DROP TABLE IF EXISTS guest_cart;
        DROP TABLE IF EXISTS products;
        DROP TABLE IF EXISTS contacts;
        DROP TABLE IF EXISTS users;
    `)
    console.log("Finished dropping tables")
    }catch(error){
      console.error("error dropping tables")
      throw error
    }
  }
  
  async function createTables() {
    try {
    console.log("Starting to build tables...")
    await client.query (`
    CREATE TABLE users( 
      id SERIAL PRIMARY KEY, 
      password VARCHAR(255) NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      "isActive" BOOLEAN DEFAULT true,
      "isAdmin" BOOLEAN DEFAULT false
      );
    CREATE TABLE products(
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL,
      description TEXT NOT NULL,
      price FLOAT NOT NULL,
      price_type TEXT NOT NULL,
      category TEXT NOT NULL,
      inventory FLOAT,
      img_url VARCHAR(255),
      "isActive" BOOLEAN DEFAULT true
      );
    CREATE TABLE contacts (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      email VARCHAR(255) UNIQUE NOT NULL,
      first_name VARCHAR(255) NOT NULL,
      last_name VARCHAR(255) NOT NULL,
      phone BIGINT,
      street TEXT NOT NULL,
      street_num INT,
      apt VARCHAR(255) NOT NULL,
      city VARCHAR(255) NOT NULL,
      zip INT
      );
      CREATE TABLE guest_cart(
      id SERIAL PRIMARY KEY,
      code VARCHAR(255) UNIQUE
      );
      CREATE TABLE cart(
        id SERIAL PRIMARY KEY,
        guest_cart_id INT,
        user_id INTEGER REFERENCES users(id)
      );
    CREATE TABLE cart_products(
      id SERIAL PRIMARY KEY,
      cart_id INTEGER REFERENCES cart(id),
      product_id INTEGER REFERENCES products(id),
      count FLOAT,
      UNIQUE (cart_id, product_id)
    );

    CREATE TABLE orders(
      id SERIAL PRIMARY KEY,
      customer_id INT,
      delivery_date VARCHAR(255) NOT NULL,
      total_cost FLOAT NOT NULL
    );
    CREATE TABLE orders_products(
      id SERIAL PRIMARY KEY,
      order_id INTEGER REFERENCES orders(id),
      product_id INTEGER REFERENCES products(id),
      count FLOAT,
      purchase_price FLOAT
    );
  
   `)
   console.log("Finished building table")
    }catch(error){
      console.error("error building table")
      throw error
    }
  }

  async function createInitialUsers() {
    console.log("Starting to create users...")
    try {
      const usersToCreate = [
        { email: "albert", password: "bertie99", isAdmin: true},
        { email: "sandra", password: "sandra123",isAdmin: false },
        { email: "glamgal", password: "glamgal123",isAdmin: false },
      ]
      const users = await Promise.all(usersToCreate.map(createUser))
  
      console.log("Users created:")
      console.log(users)
      console.log("Finished creating users!")
    } catch (error) {
      console.error("Error creating users!")
      throw error
    }
  }

  async function createInitialProducts() {
    console.log("Starting to create products");
    
    try {
      const brands = ["Transistor Foods", "Little Bytes Foods", "Cache Creameries", "URL Manufacturing", "Server Farms", "Irvine/Ortiz", "Memory Flash Farms", "Greener Capacitors", "Static Charge Foods"];
      const foods = [
        /*Fruits*/
        {name: "Apples", category: "fruit", price_type:"/lb", img_url: "https://th.bing.com/th/id/OIP.tiWHZ4k7FcRXlBanb2zfCgHaHO?pid=ImgDet&rs=1"},
        {name: "Blueberries", category: "fruit", price_type:"/lb", img_url: "https://www.pngall.com/wp-content/uploads/2/Blueberry-PNG-Image.png"},
        {name: "Bananas", category: "fruit", price_type:"/lb", img_url: "https://www.pngplay.com/wp-content/uploads/2/Banana-PNG-Photo-Image.png"},
        {name: "Pears", category: "fruit", price_type:"/lb", img_url: "http://cdn.shopify.com/s/files/1/0329/5513/8183/products/1560264116_5cffbdb4763d7_1024x.png?v=1588904819"},
        {name: "Oranges", category: "fruit", price_type:"lb", img_url: "https://assets.stickpng.com/thumbs/580b57fcd9996e24bc43c16d.png"},
        {name: "Tangerines", category: "fruit", price_type:"/lb", img_url: "https://glutenfreecuppatea.co.uk/wp-content/uploads/2017/10/are-tangerines-low-fodmap-high-fodmap.jpg"},
        {name: "Grapes", category: "fruit", price_type:"/lb", img_url: "https://target.scene7.com/is/image/Target/GUEST_8cd241e1-79c9-406c-bf9b-f42d2303c673"},
        {name: "Grapefruits", category: "fruit", price_type:"/lb", img_url: "https://i0.wp.com/agroegypt.com/wp-content/uploads/2021/01/grapfr.jpg?fit=400%2C400&ssl=1"},
        /*Vegetables*/
        {name: "Corn", category: "vegetable", price_type:"/lb", img_url: "https://cdn.shopify.com/s/files/1/0336/7167/5948/products/image-of-organic-corn-organics-28658533335084_400x400.jpg?v=1627981622"},
        {name: "Potatoes", category: "vegetable", price_type:"/lb", img_url: "https://cdn.shopify.com/s/files/1/0336/7167/5948/products/image-of-organic-russet-potatoes-vegetables-14764126634028_400x400.jpg?v=1637693077"},
        {name: "Carrots", category: "vegetable", price_type:"/lb", img_url: "https://cdn.shopify.com/s/files/1/0364/8317/0441/products/image_c3977de3-2c7c-4b8f-87b4-393faee7bbc2_400x.jpg?v=1589078864"},
        {name: "Lettuce", category: "vegetable", price_type:"/lb", img_url: "https://www.vegetables.bayer.com/content/dam/bayer-vegetables/product-photography/lettuce/seminis_lettuce_valleyheart_studio.png.transform/promoCardMedium/image.jpg"},
        {name: "Cabbage", category: "vegetable", price_type:"/lb", img_url: "https://cdn.shopify.com/s/files/1/0336/7167/5948/products/image-of-organic-cabbage-organics-28658388303916_400x400.jpg?v=1628075912"},
        {name: "Green Peas", category: "vegetable", price_type:"/lb", img_url: "https://chefsmandala.com/wp-content/uploads/2018/04/Green-Pea-400x400.jpg"},
        {name: "Onions", category: "vegetable", price_type:"/lb", img_url: "https://cdn.shopify.com/s/files/1/0336/7167/5948/products/image-of-red-onion-vegetables-14763640553516_400x400.jpg?v=1622061254"},
        /*Meats*/
        {name: "Ground Beef", category: "meat", price_type:"/lb", img_url: "https://scene7.samsclub.com/is/image/samsclub/0025463100000_A"},
        {name: "Pork Chops", category: "meat", price_type:"/lb", img_url: "https://target.scene7.com/is/image/Target/GUEST_bcb3d977-e604-479f-9f0f-b185ae8e9c5e"},
        {name: "Chicken Drumsticks", category: "meat", price_type:"/lb", img_url: "https://scene7.samsclub.com/is/image/samsclub/0025452300000_A"},
        {name: "Chicken Thighs", category: "meat", price_type:"/lb", img_url: "https://scene7.samsclub.com/is/image/samsclub/0025443000000_A"},
        {name: "Boneless Skinless Chicken Breasts", category: "meat", price_type:"/lb", img_url: "https://scene7.samsclub.com/is/image/samsclub/0066507201122_A"},
        {name: "Sirloin Steak", category: "meat", price_type:"/lb", img_url: "https://scene7.samsclub.com/is/image/samsclub/0025468000000_A"},
        {name: "Bacon", category: "meat", price_type:"/lb", img_url: "https://cdn11.bigcommerce.com/s-295z9o5zsa/images/stencil/400x400/products/677/1712/Bacon_Iso_TSTS__33504.1639094650.jpg?c=2"},
        {name: "Ground Chuck", category: "meat", price_type:"/lb", img_url: "https://target.scene7.com/is/image/Target/GUEST_eb375f9f-b919-4b5e-a377-b2f826bf305e"},
        {name: "Beef Ribs", category: "meat", price_type:"/lb", img_url: "https://scene7.samsclub.com/is/image/samsclub/0021208800000_B?wid=400&hei=400"},
        {name: "Pork Ribs", category: "meat", price_type:"/lb", img_url: "https://scene7.samsclub.com/is/image/samsclub/0021102500000_B?wid=400&hei=400"},
        /*Grocery*/
        {name: "Bran Cereal", category: "grocery", price_type:"/unit", img_url: "https://target.scene7.com/is/image/Target/GUEST_bee486e8-7917-45db-b812-8cd47fd22a23"},
        {name: "Corn Chips", category: "grocery", price_type:"/unit", img_url: "https://target.scene7.com/is/image/Target/GUEST_a57c4ffb-e486-4cbb-af9d-d6e07d396498"},
        {name: "Potato Chips", category: "grocery", price_type:"/unit", img_url: "https://target.scene7.com/is/image/Target/GUEST_5fee4c76-989a-42fc-a3f8-e89c9c96b760"},
        {name: "Chocolate Chip Cookies", category: "grocery", price_type:"/unit", img_url: "https://scene7.samsclub.com/is/image/samsclub/0022923200000_B?wid=400&hei=400"},
        {name: "Macaroni Noodles", category: "grocery", price_type:"/unit", img_url: "https://target.scene7.com/is/image/Target/GUEST_cff088c5-94f0-497e-8c39-53eba4d9450a"},
        {name: "Spaghetti Noodles", category: "grocery", price_type:"/unit", img_url: "https://scene7.samsclub.com/is/image/samsclub/0007680800646_A"},
        {name: "Chicken Noodle Soup", category: "grocery", price_type:"/unit", img_url: "https://d2d8wwwkmhfcva.cloudfront.net/400x/filters:fill(FFF,true):format(jpg)/d2lnr5mha7bycj.cloudfront.net/product-image/file/large_78885ea7-5b15-4c4e-89e1-736e7fd6a281.jpg"},
        {name: "Whole Grain Bread", category: "grocery", price_type:"/unit", img_url: "https://media1.popsugar-assets.com/files/thumbor/jFjkZTsuNrki2FPU7JaQRQtYZEA/fit-in/1024x1024/filters:format_auto-!!-:strip_icc-!!-/2019/09/06/879/n/44548660/shopuetZLY/i/Pepperidge-Farm-Whole-Grain-Soft-Sprouted-Grain-Bread.jpg"},
        
      ]

      /*Setup For Product Creation*/
      let productsToCreate = [];
      let pBrands = 6;
      let pFoods = 16;
      let jump = 1;

      /*Product Creation*/
      for (let i = 0; i < (foods.length * brands.length); i++) {

        /*Set Jump and Set Pointers Within Range*/
        if (jump < 0) {
          jump = (-jump) + 1;
        }
        else {
          jump = -(jump + 1);
        }
        while (pBrands >= brands.length) {
          pBrands = pBrands - brands.length;
        }
        while (pBrands < 0) {
          pBrands = pBrands + brands.length;
        }
        while (pFoods >= foods.length){
          pFoods = pFoods - foods.length;
        }
        while (pFoods < 0) {
          pFoods = pFoods + brands.length;
        }

        /*Assignment*/
        let name = (brands[pBrands] + " " + foods[pFoods].name );
        let description = `You will be sure to enjoy the ${foods[pFoods].name} from ${brands[pBrands]}.`;
        let price =Number.parseFloat(10 * Math.random()).toFixed(2);
        let price_type = foods[pFoods].price_type;
        let category = foods[pFoods].category;
        let inventory = Math.round(10 * Math.random());
        let img_url = foods[pFoods].img_url;
        
        productsToCreate[i] = {name: name, description: description, price: price, price_type: price_type, category: category, inventory: inventory, img_url: img_url}

        /*Move Pointers*/
        pFoods = pFoods + jump;
        pBrands = pBrands + jump;
      }
      
      /*Place Products in Database*/
      const products = await Promise.all(productsToCreate.map(createProduct))
      console.log("Products created:")
      console.log(products)
      console.log("Finished creating products!")
    }
    catch (error) {
      console.error("Error creating products!");
      throw error;
    }
  }


  async function createInitialContact() {
    console.log("Starting to create contact");
    
    try {
      const contactToCreate = [
        {userId: 1, first_name: "Albert", last_name:"Gilbert",email: "albert", phone:3425648745,street:"Bryn Mare ave",street_num:3450,apt:"3a",city:"Atlanta",zip:306783},
        {userId: 2, first_name:"Sandra",last_name:"Brown", email: "sandra", phone:2244597823,street:"Western ave",street_num:7546,apt:201,city:"Dallas",zip:40786},
        {userId: 3, first_name:"Glamgal",last_name:"Scotch", email: "ana2@gmail.com", phone:3021207843,street:"15th ave",street_num:2301,apt:2,city:"Miami",zip:34567},
        
        ]

      const contacts = await Promise.all(contactToCreate.map(createContactInfo))

      console.log("Contact created:")
      console.log(contacts)
      console.log("Finished creating contact!")
    }
    catch (error) {
      console.error("Error creating contact!");
      throw error;
    }

  }

  async function createInCart() {
    console.log("Starting to create cart");
    
    try {
      const cartToCreate = [
        {user_id:1},
        {user_id:2},
        {user_id:3}
        ]
      const cart = await Promise.all(cartToCreate.map(createCart))

      console.log("Cart created:")
      console.log(cart)
      console.log("Finished creating cart!")
    }
    catch (error) {
      console.error("Error creating cart!");
      throw error;
    }

  }

  async function createInCartProduct() {
    console.log("Starting to create cart");
    
    try {
      const cartProductToCreate = [
        {cart_id:1, product_id:1, count:1.0},
        {cart_id:2, product_id:2, count:2.0},
        {cart_id:2, product_id:3, count:9.0}
        ]
      const cartProducts = await Promise.all(cartProductToCreate.map(createCartProducts))

      console.log("Cart created:")
      console.log(cartProducts)
      console.log("Finished creating cart!")
    }
    catch (error) {
      console.error("Error creating cart!");
      throw error;
    }

  }

  async function createInOrder() {    
    try {
      const orderToCreate = [
        {customer_id:1, delivery_date:" ", total_cost:1.25},
        {customer_id:1, delivery_date:" ", total_cost:12.95},
        {customer_id:3, delivery_date:" ", total_cost:5.75},
        
        ]
      const order = await Promise.all(orderToCreate.map(createOrder))

      console.log("Cart created:")
      console.log(order)
      console.log("Finished creating cart!")
    }
    catch (error) {
      console.error("Error creating cart!");
      throw error;
    }

  }
  
  async function createInOrderProducts() {    
    try {
      const orderProductsToCreate = [
        {order_id:1, product_id:2, count:1, purchase_price:1.25},
        
        ]
      const orderProducts = await Promise.all(orderProductsToCreate.map(createOrderProduct))

      console.log("Cart created:")
      console.log(orderProducts)
      console.log("Finished creating cart!")
    }
    catch (error) {
      console.error("Error creating cart!");
      throw error;
    }

  }


  async function rebuildDB() {
    try {
      await dropTables()
      await createTables()
      await createInitialUsers()
      await createInitialProducts();
      await createInitialContact();
      await createInCart();
      await createInCartProduct();
      await createInOrder();
      await createInOrderProducts();
      
    } catch (error) {
      console.log("Error during rebuildDB")
      throw error
    }
  }
  
  module.exports = {
    rebuildDB,
    dropTables,
    createTables,
  }