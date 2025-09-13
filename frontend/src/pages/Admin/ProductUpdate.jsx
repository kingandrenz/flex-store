import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
    useUpdateProductMutation, 
    useDeleteProductMutation, 
    useGetProductByIdQuery, 
    useUploadProductImageMutation, 
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";

function ProductUpdate() {
    const params = useParams();

    const {data: productData} = useGetProductByIdQuery(params._id);

    const [image, setImage] = useState(productData?.image || '');
    const [name, setName] = useState('');
    const [description, setDescription] = useState(productData?.name ||"");
    const [price, setPrice] = useState(productData?.price || '');
    const [category, setCategory] = useState(productData?.category || "");
    const [quantity, setQuantity] = useState(productData?.quantity || 0);
    const [brand, setBrand] = useState(productData?.brand || "");
    const [countInStock, setCountInStock] = useState(productData?.countInStock || 0);
    
    const navigate = useNavigate();

    const {data: categories = []} = useFetchCategoriesQuery();
    const [uploadProductImage] = useUploadProductImageMutation();
    const [updateProduct] = useUpdateProductMutation();
    const [deleteProduct] = useDeleteProductMutation();


    const uploadFileHandler = async (e) => {
        const formData = new FormData()
        formData.append("image", e.target.files[0])

        try {
            const res = await uploadProductImage(formData).unwrap()
            toast.success(res.message);
            setImage(res.image);
        } catch (error) {
            toast.error(error?.data.message || error.error)
        }
    }


    const handleSubmit = async (e) => {
            e.preventDefault();
    
            try {
                const formData = new FormData()
                formData.append('image', image)
                formData.append('name', name)
                formData.append('description', description)
                formData.append('price', price)
                formData.append('category', category)
                formData.append('quantity', quantity)
                formData.append('brand', brand)
                formData.append('countInStock', countInStock)
               
                const {data} = await updateProduct({productId: params._id, formData});
                console.log("params: ", params)
                if (data.error) {
                    toast.error(data.error)
                } else {
                    toast.success(`product successfully updated`)
                    navigate('/admin/allproductslist') // remeber to change it to /shop
                }
            } catch (error) {
                console.error(error);
                toast.error("product update failed! Try again")
                
            }
        }


        const handleDelete = async () => {
            try {
                let answer = window.confirm("Are you Sure you want to delete this product?");
                if (!answer) return;

                const {data} = await deleteProduct(params._id);
                toast.success(`${toast.name} is deleted`)
                navigate(`/admin/allproductslist`)
            } catch (error) {
                console.error(error);
                toast.error("Deletion failed! Try agai")
                
            }
        }

    useEffect(()=>{
        if (productData?._id) {
            setName(productData?.name);
            setDescription(productData?.description);
            setPrice(productData?.price);
            setCategory(productData?.category);
            setQuantity(productData?.quantity);
            setBrand(productData?.brand);
            setImage(productData?.image);
        }
    }, [productData])


  return (
    <div className="container xl:ml-[9rem] sm:mx-[0]">
        <div className="flex flex-col md:flex-row">
            {/* Admin Menu */}
            <AdminMenu />
            <div className="md:w-3/4 p-3">
                <h2 className="h-12 text-2xl font-bold mb-4">Update Product</h2>

               {image && (
                    <div className="text-center">
                        <img src={image} alt="product" className="block mx-auto max-h-[200px]"/>
                    </div>
                )}

                {/* Product Form */}
                <div className="mb-3">
                    <label className="border text-black px-4 block w-full text-center
                    rounded-lg cursor-pointer font-bold py-11">
                        {image ? image.name : "upload Image"}

                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={uploadFileHandler}
                            className={!image ? "hidden" : 'text-black'}
                         />
                    </label>
                </div>

                <div className="p-3">
                    <div className="flex flex-wrap gap-x-4">
                        <div className="one"> 
                            <label htmlFor="name">name</label> <br />
                            <input type="text" 
                                className="p-4 mb-3 w-[26rem] border rounded-lg bg-[#101011] text-white"
                                value={name} onChange={(e) => setName(e.target.value)}
                             />
                        </div>
                        <div className="two"> 
                            <label htmlFor="name block">Price</label> <br />
                            <input type="number" 
                                className="p-4 mb-3 w-[26rem] border rounded-lg bg-[#101011] text-white"
                                value={price} onChange={(e) => setPrice(e.target.value)}
                             />
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-x-4">
                        <div className="one"> 
                            <label htmlFor="name block">Quantity</label> <br />
                            <input type="number" 
                                className="p-4 mb-3 w-[26rem] border rounded-lg bg-[#101011] text-white"
                                value={quantity} onChange={(e) => setQuantity(e.target.value)}
                             />
                        </div>
                        <div className="two"> 
                            <label htmlFor="name block">Brand</label> <br />
                            <input type="text" 
                                className="p-4 mb-3 w-[26rem] border rounded-lg bg-[#101011] text-white"
                                value={brand} onChange={(e) => setBrand(e.target.value)}
                             />
                        </div>
                    </div>

                    <label htmlFor="" className="my-5">Description</label>
                    <textarea type='text' className="p-2 mb-3 bg-[#101011] border rounded-lg w-[95%]
                    text-white" value={description} onChange={(e)=> setDescription(e.target.value)}></textarea>
                    <div className="flex justify-between">
                        <div>
                            <label htmlFor="name block">Count In Stock</label> <br />
                            <input type="number" className="p-4 mb-3 w-[26rem] border rounded-lg bg-[#101011]
                             text-white" value={countInStock} onChange={(e)=> setCountInStock(e.target.value)} />
                        </div>
                        
                        <div>
                            <label htmlFor="">Category</label> <br />
                            <select placeholder="Choose Category" className="p-4 mb-3 w-[26rem] border rounded-lg bg-[#101011]
                             text-white" value={category} onChange={(e)=> setCategory(e.target.value)}>
                                {categories?.map((c)=> (
                                    <option key={c._id} value={c._id}>
                                        {c.name}
                                    </option>
                                ))}
                             </select>
                        </div> 
                    </div>
                         <div>
                            <button onClick={handleSubmit} className="py-4 px-10 mt-5 rounded-lg text-lg text-white
                         font-bold bg-green-600 mr-6">Update</button>

                            <button onClick={handleDelete} className="py-4 px-10 mt-5 rounded-lg text-lg text-white
                         font-bold bg-red-600">Delete</button>
                         </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ProductUpdate
