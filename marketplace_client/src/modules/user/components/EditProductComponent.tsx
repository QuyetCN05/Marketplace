import React from "react"
import "./style/collectionForm.css"

interface EditProductModalProps {
  updatedProduct: {
    name: string
    price: number
    quantity: number
    description: string
  }
  handleInputProductChange: (e: any) => void
  handleFormProductSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  setEditingProduct: (value: number | null) => void
}

const EditProductComponent: React.FC<EditProductModalProps> = ({
  updatedProduct,
  handleInputProductChange,
  handleFormProductSubmit,
  setEditingProduct,
}) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <form onSubmit={handleFormProductSubmit}>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={updatedProduct.name}
              onChange={handleInputProductChange}
            />
          </label>
          <label>
            Price:
            <input
              type="number"
              name="price"
              value={updatedProduct.price}
              onChange={handleInputProductChange}
            />
          </label>
          <label>
            Quantity:
            <input
              type="number"
              name="quantity"
              value={updatedProduct.quantity}
              onChange={handleInputProductChange}
            />
          </label>
          <label>
            Description:
            <textarea
              name="description"
              value={updatedProduct.description}
              onChange={handleInputProductChange}
              className="pl-4"
            />
          </label>
          <button type="submit">Update Product</button>
          <button type="button" onClick={() => setEditingProduct(null)}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  )
}

export default EditProductComponent
