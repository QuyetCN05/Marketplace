export default function ProductUser({ item }: any) {
  return (
    <>
      <div className="group overflow-hidden rounded-lg bg-white shadow-md">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="max-h-[300px] max-w-[300px] object-contain"
        />
        <div className="p-2">
          <h2 className="text-lg font-semibold">{item.name}</h2>
          {/* <p className="text-gray-500">{item.collection}</p> */}
          {/* <p className="mt-2 text-sm text-gray-700">{item.price}</p> */}
          <p className="text-[rgb(151,151,151)]">Best offer: 0.01 WETH</p>
          <button className="hidden h-8 w-full rounded bg-blue-500 px-4 font-bold text-white hover:bg-blue-700 group-hover:block">
            Add to cart
          </button>
        </div>
      </div>
    </>
  )
}
