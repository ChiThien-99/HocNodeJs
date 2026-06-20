import { cartEntity } from "../models/cart.model.js";
export const getCart=async(req,res)=>{
    const {idClient}=req.params;
    const cart=await cartEntity.findOne({clientId:idClient});
    res.render("cart.ejs",{cart});
}
export const deleteProduct=async(req,res)=>{
    try {
    const {idClient,idProduct}=req.body;
    if (!idProduct || !idClient) {
        return res.json({mess:"Không tìm được idProduct,idClient",success:false});
    }
    console.log(idClient);
    console.log(idProduct);
    const updateCart=await cartEntity.findOneAndUpdate(
        {clientId:idClient},
        {
            $pull:{
            products:{productId:idProduct}
        }
       },
       {new:true},
    )
    let totalItems=0;
    if (updateCart&&updateCart.products) {
        totalItems=updateCart.products.reduce((sum,item)=>sum+item.quantity,0);
    }
    res.json({mess:"Xóa sản phẩm thành công",success:true,totalItems});
    } catch (error) {
    res.json({mess:"Xóa sản phẩm thất bại",success:false,error:error.message});  
    }
    
}