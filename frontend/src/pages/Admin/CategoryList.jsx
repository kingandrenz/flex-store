import { toast } from "react-toastify";
import { useCreateCategoryMutation, useDeleteCategoryMutation, useFetchCategoriesQuery, useUpdateCategoryMutation } from "../../redux/api/categoryApiSlice";
import { useState } from "react";
import CategoryForm from "../../components/CategoryForm";
import Modal from '../../components/Modal';
import AdminMenu from "./AdminMenu";

const CategoryList = () => {

    const {data: categories} = useFetchCategoriesQuery();
    const [name, setName] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [updatingeName, setUpdatingeName] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    const [createCategory] = useCreateCategoryMutation();
    const [updateCategory] = useUpdateCategoryMutation();
    const [deleteCategory] = useDeleteCategoryMutation();

    

    const handleCreateCategory = async (e) => {
        e.preventDefault();

        if (!name) {
            toast.error("Category name is required");
            return
        }

        try {
            const result = await createCategory({name}).unwrap();
            if (result.error) {
                toast.error(result.error);
            } else {
                setName('');
                toast.success(`${result.name}  is created`)
            }
        } catch (error) {
            console.error(error);
            toast.error("creating category failed, try again")
        }
    }

    const handleUpdateCategory = async (e) => {
        e.preventDefault();

        if (!updatingeName) {
            toast.error("Category name required!");
            return;
        }

        try {
            const result = await updateCategory({
                categoryId: selectedCategory._id, 
                updatedCategory: {name: updatingeName}
            }).unwrap();

            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success(`${result.name} is Updated succesfully`)
                setSelectedCategory(null);
                setUpdatingeName('');
                setModalVisible(false);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handleDeleteCategory = async () => {
        try {
            const result = await deleteCategory(selectedCategory._id).unwrap();

            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success(`${result.name} deleted succesfully`);
                setSelectedCategory(null);
                setModalVisible(false);
            }
        } catch (error) {
            console.error(error)
            toast.error("Category deletion faild! try again")
        }
    }


  return (
    <div className="flex flex-col ml-[10rem] md:flex-row">
      {/* Admin menue */}
      <AdminMenu />
      <div className="md:w-3/4 p-3">
        <div className="h-12">Manage Categories</div>
        <CategoryForm value={name} setValue={setName} handleSubmit={handleCreateCategory} />
        <br />
        <hr />

        <div className="flex flex-wrap">
            {
                categories?.map((category)=> (
                    <div key={category._id}>
                        <button className="bg-white border-blue-500 text-blue-500 py-2 px-4 border rounded-lg m-g
                         hover:bg-blue-500 hover:text-white focus:outline-none focus:ring-2
                          focus:ring-blue-500 focus:opacity-50" onClick={()=> {{
                            setModalVisible(true)
                            setSelectedCategory(category)
                            setUpdatingeName(category.name)
                          }}}>{category.name}</button>
                    </div>
                ))
            }
        </div>

        <Modal isOpen={modalVisible} onClose={()=> setModalVisible(false)}>
            <CategoryForm value={updatingeName} setValue={(value)=> setUpdatingeName(value)} 
            handleSubmit={handleUpdateCategory} buttonText="Update"
            handleDelete={handleDeleteCategory} />
        </Modal>
        
      </div>
    </div>
  )
}

export default CategoryList
