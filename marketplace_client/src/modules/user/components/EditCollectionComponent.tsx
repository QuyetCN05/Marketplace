import React from "react"
import "./style/collectionForm.css"

interface EditCollectionModalProps {
  updatedCollection: {
    name: string
    floor_price: number
    total_volume: number
    description: string
  }
  handleInputCollectionChange: (e: any) => void
  handleFormCollectionSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  setEditingCollection: (value: number | null) => void
}

const EditCollectionModal: React.FC<EditCollectionModalProps> = ({
  updatedCollection,
  handleInputCollectionChange,
  handleFormCollectionSubmit,
  setEditingCollection,
}) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <form onSubmit={handleFormCollectionSubmit}>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={updatedCollection.name}
              onChange={handleInputCollectionChange}
            />
          </label>
          <label>
            Floor Price:
            <input
              type="number"
              name="floor_price"
              value={updatedCollection.floor_price}
              onChange={handleInputCollectionChange}
            />
          </label>
          <label>
            Total Volume:
            <input
              type="number"
              name="total_volume"
              value={updatedCollection.total_volume}
              onChange={handleInputCollectionChange}
            />
          </label>
          <label>
            Description:
            <textarea
              name="description"
              value={updatedCollection.description}
              onChange={handleInputCollectionChange}
              className="pl-4"
            />
          </label>
          <button type="submit">Update Collection</button>
          <button type="button" onClick={() => setEditingCollection(null)}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  )
}

export default EditCollectionModal
