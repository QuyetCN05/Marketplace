import useGetListProductByOrderId from "../services/GetListProducByOrderId"
import "./style/viewOrder.css"
interface EditProductModalProps {
  orderId: number | null
  setViewOrder: (value: number | null) => void
}

const ViewOrderComponent: React.FC<EditProductModalProps> = ({
  orderId,
  setViewOrder,
}) => {
  //   console.log(orderId)
  const listProduct = useGetListProductByOrderId(orderId?.toString() || "")
  const products = listProduct.data?.products || []
  console.log(products)

  return (
    <div className="modal">
      <div className="modal-content">
        <table className="product-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Image</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={index}>
                <td>{product.name}</td>
                <td>
                  <img
                    src={product.imageUrl}
                    alt={`Product ${index}`}
                    className="product-image"
                  />
                </td>
                <td>{product.numberProduct}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex w-full justify-center pt-5">
          <button type="button" onClick={() => setViewOrder(null)}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default ViewOrderComponent
