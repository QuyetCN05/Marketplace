import { queryClient } from "configs/queryClient"
import { deleteCollection } from "modules/collections/services/deleteCollection"
import { updateCollection } from "modules/collections/services/updateCollection"
import { deleteProduct } from "modules/products/services/deleteProduct"
import { updateProduct } from "modules/products/services/updateProduct"
import { useState } from "react"
import {
  FaBoxOpen,
  FaEdit,
  FaEye,
  FaShoppingCart,
  FaTrash,
  FaUsers,
} from "react-icons/fa"
import { toast } from "sonner"
import { useUser } from "store/user"
import { collectionEdit } from "types/collectionEdit"
import { Order } from "types/order"
import { Product } from "types/product"
import useGetCollectionCreated from "../../collections/services/GetCollectionIsCreated"
import useGetOrderByUser from "../services/GetOrderByUser"
import useGetProductCreated from "../services/GetProductIsCreated"
import EditCollectionComponent from "./EditCollectionComponent"
import EditProductComponent from "./EditProductComponent"
import ViewOrderComponent from "./ViewOrderComponent"
import "./style/App.css"
import "./style/collectionForm.css"

const AdminDashboard = () => {
  const { user } = useUser()

  const listProductCreated = useGetProductCreated(user.id.toString())
  const listCollectionCreated = useGetCollectionCreated(user.id.toString())
  const listOrder = useGetOrderByUser(user.id.toString())
  const productsCreated = listProductCreated.data?.products
  const collectionsCreated = listCollectionCreated.data?.collections
  const orders = listOrder.data?.orders
  const [activeTab, setActiveTab] = useState<string>("collections")



  function convertToVietnamTime(dateString: string): string {
    const date = new Date(dateString);

    // Vietnam is UTC+7
    const vietnamOffset = 7 * 60; // 7 hours converted to minutes
    const localOffset = date.getTimezoneOffset(); // Local offset in minutes

    // Calculate the total offset from UTC to Vietnam time
    const totalOffset = vietnamOffset + localOffset;

    // Adjust the date by the total offset
    const vietnamTime = new Date(date.getTime() + totalOffset * 60 * 1000);

    // Get the components of the date
    const day = String(vietnamTime.getUTCDate()).padStart(2, '0');
    const month = String(vietnamTime.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1
    const year = vietnamTime.getUTCFullYear();

    // Get the components of the time
    const hours = String(vietnamTime.getUTCHours()).padStart(2, '0');
    const minutes = String(vietnamTime.getUTCMinutes()).padStart(2, '0');

    // Format the date and time
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  const [editingCollection, setEditingCollection] = useState<number | null>(
    null,
  )
  const [editingProduct, setEditingProduct] = useState<number | null>(null)
  const [viewOrder, setViewOrder] = useState<number | null>(null)
  const [orderId, setOrderId] = useState<number | null>(null)
  const [updatedCollection, setUpdatedCollection] = useState({
    name: "",
    floor_price: 1,
    total_volume: 1,
    description: "",
  })
  const [updatedProduct, setUpdatedProduct] = useState({
    name: "",
    price: 1,
    quantity: 1,
    description: "",
  })
  const handleEditProductClick = (product: Product) => {
    setEditingProduct(product.id)
    setUpdatedProduct({
      name: product.name,
      price: product.price,
      quantity: product.quantity,
      description: product.description,
    })
  }

  const handleEditCollectionClick = (collection: collectionEdit) => {
    setEditingCollection(collection.id)
    setUpdatedCollection({
      name: collection.name,
      floor_price: collection.floor_price,
      total_volume: collection.total_volume,
      description: collection.description,
    })
  }
  const handleFormCollectionSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault()
    const collectionId = editingCollection?.toString() || ""
    await updateCollection(updatedCollection, collectionId).then(async () => {
      await queryClient
        .refetchQueries({
          queryKey: ["getCollectionCreated"],
        })
        .then(() => {
          toast.success("Collection updated successfully")
        })
    })

    setEditingCollection(null)
  }
  const handleFormProductSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault()
    const productId = editingProduct?.toString() || ""
    await updateProduct(updatedProduct, productId).then(async () => {
      await queryClient
        .refetchQueries({
          queryKey: ["getProductCreated"],
        })
        .then(() => {
          toast.success("Product updated successfully")
        })
    })

    setEditingProduct(null)
  }

  const handleInputCollectionChange = (e: any) => {
    const { name, value } = e.target
    setUpdatedCollection((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }
  const handleInputProductChange = (e: any) => {
    const { name, value } = e.target
    setUpdatedProduct((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleDeleteProduct = async (id: number) => {
    const productId = id.toString()
    await deleteProduct(productId).then(async () => {
      await queryClient
        .refetchQueries({
          queryKey: ["getProductCreated"],
        })
        .then(() => {
          toast.success("Product deleted successfully")
        })
    })
  }
  const handleDeleteCollection = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this collection? When you delete a collection, all products in this collection will be deleted too",
    )
    if (!confirmed) return
    const collectionId = id.toString()
    console.log(collectionId)
    await deleteCollection(user.id.toString(), collectionId).then(
      async () => {},
    )
    await queryClient
      .refetchQueries({
        queryKey: ["getCollectionCreated"],
      })
      .then(() => {
        toast.success("Collection deleted successfully")
      })
    await queryClient.refetchQueries({
      queryKey: ["getProductCreated"],
    })
  }

  const handelViewOrderClick = (order: Order) => {
    setViewOrder(order.id)
    setOrderId(order.id)
  }
  console.log(convertToVietnamTime("2024-07-27 15:36:44.189+00"))

  return (
    <div className="admin-dashboard">
      <div className="dashboard-content">
        <div className="sidebar">
          {/*<h2>Management</h2>*/}
          <ul>
            <li
              onClick={() => setActiveTab("collections")}
              className={activeTab === "collections" ? "active" : ""}
            >
              <FaUsers /> Collections
            </li>
            <li
              onClick={() => setActiveTab("products")}
              className={activeTab === "products" ? "active" : ""}
            >
              <FaBoxOpen /> Products
            </li>
            <li
              onClick={() => setActiveTab("orders")}
              className={activeTab === "orders" ? "active" : ""}
            >
              <FaShoppingCart /> Orders
            </li>
          </ul>
        </div>

        <div className="main-content">
          {activeTab === "collections" && (
            <section className="user-management">
              <h2 className="font-bold">Management Collections</h2>
              <div className="table-container">
                <table className="user-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Floor price</th>
                      <th>Total volume</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {collectionsCreated &&
                      collectionsCreated.map((collection, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{collection.name}</td>
                          <td>{collection.floor_price}</td>
                          <td>{collection.total_volume}</td>
                          <td>
                            <button
                              onClick={() =>
                                handleEditCollectionClick(collection)
                              }
                              className="edit-btn"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteCollection(collection.id)
                              }
                              className="delete-btn"
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {editingCollection && (
                <EditCollectionComponent
                  updatedCollection={updatedCollection}
                  handleInputCollectionChange={handleInputCollectionChange}
                  handleFormCollectionSubmit={handleFormCollectionSubmit}
                  setEditingCollection={setEditingCollection}
                />
              )}
            </section>
          )}

          {activeTab === "products" && (
            <section className="product-management">
              <h2 className="font-bold">Management Products</h2>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productsCreated &&
                      productsCreated.map((product, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{product.name}</td>
                          <td>${product.price}</td>
                          <td>{product.quantity}</td>
                          <td>
                            <button
                              onClick={() => handleEditProductClick(product)}
                              className="edit-btn"
                            >
                              <FaEdit />
                            </button>

                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="delete-btn"
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {editingProduct && (
                <EditProductComponent
                  updatedProduct={updatedProduct}
                  handleInputProductChange={handleInputProductChange}
                  handleFormProductSubmit={handleFormProductSubmit}
                  setEditingProduct={setEditingProduct}
                />
              )}
            </section>
          )}

          {activeTab === "orders" && (
            <section className="order-management">
              <h2 className="font-bold">Order History</h2>
              <div className="table-container">
                <table className="order-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Total price</th>
                      <th>Payment method</th>
                      <th>Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders &&
                      orders.map((order, index) => {
                        return (
                          <tr key={index}>
                            <td>{index + 1}</td>

                            <td>${order.totalPrice}</td>
                            <td>{order.paymentMethod}</td>
                            <td>{convertToVietnamTime(order.createdAt)}</td>
                            <td>
                              <button
                                onClick={() => handelViewOrderClick(order)}
                                className="view-btn"
                              >
                                <FaEye /> View
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                  </tbody>
                </table>
              </div>
              {viewOrder && (
                <ViewOrderComponent
                  orderId={orderId}
                  setViewOrder={setViewOrder}
                />
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
