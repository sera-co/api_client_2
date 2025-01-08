const express = require('express');
const mongoose=require('mongoose')
const MenuItem=require('./MenuItem.js')
const dotenv=require('dotenv').config()
const { resolve } = require('path');

const app = express();
const port = 3010;
app.use(express.json())
app.use(express.static('static'));

mongoose
.connect(process.env.DB_URL)
.then(()=>console.log('Database connected successfully'))
.catch((err)=>console.log("Database connection failed",err.message))

app.put('/menu/:id',async(req,res)=>{
  const{name,description,price}=req.body;
  const{id}=req.params;

  if(!name && !description && !price){
    return res.sendStatus(400).json({message:"Atleast one field must be given"})
  }

  try{
    const updatedMenuItem=await MenuItem.findById(id)
    if(!updatedMenuItem){
      return res.status(404).json({message:'Menu item not found'})
    }
    if (name !== undefined) updatedMenuItem.name = name;
    if (description !== undefined) updatedMenuItem.description = description;
    if (price !== undefined) updatedMenuItem.price = price;
    const updatedMenuItems=await updatedMenuItem.save();
    res.status(200).json({message:"Menu item updated successfully",MenuItem:updatedMenuItems} )
  }catch(err){
    res.status(500).json({message:"Failed to update menu",error:err.message})
  }
})
app.delete('/menu/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedMenuItem = await MenuItem.findByIdAndDelete(id);
    if (!deletedMenuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.status(200).json({ message: 'Menu item deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete menu item', error: err.message });
  }
});

app.get('/get_menu', async (req, res) => {
  try {
    const menuItems = await MenuItem.find();
    res.status(200).json(menuItems);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch menu', error: err.message });
  }
});


app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
