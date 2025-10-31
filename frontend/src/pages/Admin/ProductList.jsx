import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
    useCreateProductMutation,
    useUploadProductImageMutation
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";


function ProductList() {
    const [imageFile, setImageFile] = useState(null); 
    
    const [image, setImage] = useState("");
    const [name, setName] = useState('');
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState("");
    const [quantity, setQuantity] = useState(0);
    const [brand, setBrand] = useState("");
    const [countInStock, setCountInStock] = useState(0);
    const [imageUrl, setImageUrl] = useState(null);
    const navigate = useNavigate();

    const [uploadProductImage] = useUploadProductImageMutation();
    const [createProduct] = useCreateProductMutation();
    const { data: categories } = useFetchCategoriesQuery();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // CRITICAL FIX: Send a clean JSON object, not FormData.
            // The 'image' state already holds the Cloudinary URL.
            const productData = {
                image, 
                name,
                description,
                price,
                category,
                quantity,
                brand,
                countInStock,
            };
            
            // Redux Toolkit Query handles JSON serialization
            const {data} = await createProduct(productData);
            
            if (data.error) {
                toast.error("Product creation failed! Try again")
            } else {
                toast.success(`${data.name} is created`)
                navigate('/')
            }
        } catch (error) {
            console.error(error);
            // Updated error toast to handle the common structure of RTK Query errors
            toast.error(error?.data?.message || "Product creation failed! Try again")
        }
    }

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData()
        formData.append("image", file)
        
        setImageFile(file); 

        try {
            const res = await uploadProductImage(formData).unwrap()
            toast.success(res.message);
            
            setImage(res.image); 
            setImageUrl(res.image);
            
            // Fix: Reset the input value 
            e.target.value = null; 
        } catch (error) {
            toast.error(error?.data?.message || error.error);
            setImageFile(null); 
            e.target.value = null;
        }
    }

    return (
        <div className="container xl:ml-[9rem] sm:mx-[0]">
            <div className="flex flex-col md:flex-row">
                <AdminMenu />
                <div className="md:w-3/4 p-3">
                    <h2 className="h-12 text-2xl font-bold mb-4">Create Product</h2>

                    {imageUrl && (
                        <div className="text-center">
                            <img src={imageUrl} alt="product" className="block mx-auto max-h-[200px]"/>
                        </div>
                    )}

                    <div className="mb-3">
                        <label className="border text-black px-4 block w-full text-center
                        rounded-lg cursor-pointer font-bold py-11">
                            {imageFile ? imageFile.name : "Upload Image"}

                            <input
                                type="file"
                                name="image"
                                accept="image/*"
                                onChange={uploadFileHandler}
                                className="hidden" 
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
                                text-white" onChange={(e)=> setCategory(e.target.value)}>
                                    {categories?.map((c)=> (
                                        <option key={c._id} value={c._id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                            </div> 
                        </div>
                        <button onClick={handleSubmit} className="py-4 px-10 mt-5 rounded-lg text-lg text-white
                        font-bold bg-blue-600">Submit</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductList;






// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { 
//     useCreateProductMutation,
//     useUploadProductImageMutation
// } from "../../redux/api/productApiSlice";
// import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
// import { toast } from "react-toastify";
// import AdminMenu from "./AdminMenu";
// // import Modal from '../../components/Modal';
// // import ProductForm from "../../components/ProductForm"; 


// function ProductList() {
//     const [image, setImage] = useState("");
//     const [name, setName] = useState('');
//     const [description, setDescription] = useState("");
//     const [price, setPrice] = useState('');
//     const [category, setCategory] = useState("");
//     const [quantity, setQuantity] = useState(0);
//     const [brand, setBrand] = useState("");
//     const [countInStock, setCountInStock] = useState(0);
//     const [imageUrl, setImageUrl] = useState(null);
//     const navigate = useNavigate();

//     const [uploadProductImage] = useUploadProductImageMutation();
//     const [createProduct] = useCreateProductMutation();
//     const { data: categories } = useFetchCategoriesQuery();

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         try {
//             const productData = new FormData()
//             productData.append('image', image)
//             productData.append('name', name)
//             productData.append('description', description)
//             productData.append('price', price)
//             productData.append('category', category)
//             productData.append('quantity', quantity)
//             productData.append('brand', brand)
//             productData.append('countInStock', countInStock)
           
//             const {data} = await createProduct(productData);
//             console.log("data :", data);
            
//             if (data.error) {
//                 toast.error("product creation failed! Try again")
//             } else {
//                 toast.success(`${data.name} is created`)
//                 navigate('/') // remeber to change it to /shop
//             }
//         } catch (error) {
//             console.error(error);
//             toast.error("product creation failed! Try again")
            
//         }
//     }

//     const uploadFileHandler = async (e) => {
//         const formData = new FormData()
//         formData.append("image", e.target.files[0])

//         try {
//             const res = await uploadProductImage(formData).unwrap()
//             toast.success(res.message);
//             setImage(res.image);
//             setImageUrl(res.image);
//         } catch (error) {
//             toast.error(error?.data.message || error.error)
//         }
//     }

//   return (
//     <div className="container xl:ml-[9rem] sm:mx-[0]">
//         <div className="flex flex-col md:flex-row">
//             {/* Admin Menu */}
//             <AdminMenu />
//             <div className="md:w-3/4 p-3">
//                 <h2 className="h-12 text-2xl font-bold mb-4">Create Product</h2>

//                {imageUrl && (
//                     <div className="text-center">
//                         <img src={imageUrl} alt="product" className="block mx-auto max-h-[200px]"/>
//                     </div>
//                 )}

//                 {/* Product Form */}
//                 <div className="mb-3">
//                     <label className="border text-black px-4 block w-full text-center
//                     rounded-lg cursor-pointer font-bold py-11">
//                         {image ? image.name : "upload Image"}

//                         <input
//                             type="file"
//                             name="image"
//                             accept="image/*"
//                             onChange={uploadFileHandler}
//                             className={!image ? "hidden" : 'text-black'}
//                          />
//                     </label>
//                 </div>

//                 <div className="p-3">
//                     <div className="flex flex-wrap gap-x-4">
//                         <div className="one"> 
//                             <label htmlFor="name">name</label> <br />
//                             <input type="text" 
//                                 className="p-4 mb-3 w-[26rem] border rounded-lg bg-[#101011] text-white"
//                                 value={name} onChange={(e) => setName(e.target.value)}
//                              />
//                         </div>
//                         <div className="two"> 
//                             <label htmlFor="name block">Price</label> <br />
//                             <input type="number" 
//                                 className="p-4 mb-3 w-[26rem] border rounded-lg bg-[#101011] text-white"
//                                 value={price} onChange={(e) => setPrice(e.target.value)}
//                              />
//                         </div>
//                     </div>
//                     <div className="flex flex-wrap gap-x-4">
//                         <div className="one"> 
//                             <label htmlFor="name block">Quantity</label> <br />
//                             <input type="number" 
//                                 className="p-4 mb-3 w-[26rem] border rounded-lg bg-[#101011] text-white"
//                                 value={quantity} onChange={(e) => setQuantity(e.target.value)}
//                              />
//                         </div>
//                         <div className="two"> 
//                             <label htmlFor="name block">Brand</label> <br />
//                             <input type="text" 
//                                 className="p-4 mb-3 w-[26rem] border rounded-lg bg-[#101011] text-white"
//                                 value={brand} onChange={(e) => setBrand(e.target.value)}
//                              />
//                         </div>
//                     </div>

//                     <label htmlFor="" className="my-5">Description</label>
//                     <textarea type='text' className="p-2 mb-3 bg-[#101011] border rounded-lg w-[95%]
//                     text-white" value={description} onChange={(e)=> setDescription(e.target.value)}></textarea>
//                     <div className="flex justify-between">
//                         <div>
//                             <label htmlFor="name block">Count In Stock</label> <br />
//                             <input type="number" className="p-4 mb-3 w-[26rem] border rounded-lg bg-[#101011]
//                              text-white" value={countInStock} onChange={(e)=> setCountInStock(e.target.value)} />
//                         </div>
                        
//                         <div>
//                             <label htmlFor="">Category</label> <br />
//                             <select placeholder="Choose Category" className="p-4 mb-3 w-[26rem] border rounded-lg bg-[#101011]
//                              text-white" onChange={(e)=> setCategory(e.target.value)}>
//                                 {categories?.map((c)=> (
//                                     <option key={c._id} value={c._id}>
//                                         {c.name}
//                                     </option>
//                                 ))}
//                              </select>
//                         </div> 
//                     </div>
//                          <button onClick={handleSubmit} className="py-4 px-10 mt-5 rounded-lg text-lg text-white
//                          font-bold bg-blue-600">Submit</button>
//                 </div>
//             </div>
//         </div>
//     </div>
//   )
// }

// export default ProductList
