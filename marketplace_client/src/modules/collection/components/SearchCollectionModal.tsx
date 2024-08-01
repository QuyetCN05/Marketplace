import { Icon } from "@iconify-icon/react/dist/iconify.mjs"
import {
  Avatar,
  Button,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react"
import LoadingIcon from "components/common/LoadingIcon"
import Input from "components/core/field/Input"
import debounce from "lodash.debounce"
import { useEffect, useRef, useState } from "react"
import { useInView } from "react-intersection-observer"
import { useNavigate } from "react-router-dom"
import { useGetCollectionList } from "../services/getCollectionList"
import SearchCollectionLoading from "./SearchCollectionLoading"

interface Props {
  onClose: () => void
}

export default function SearchCollectionModal({ onClose }: Props) {
  const navigate = useNavigate()
  const { ref, inView } = useInView()

  const [searchCharacters, setSearchCharacters] = useState<string>()

  const getCollectionList = useGetCollectionList(
    { limit: 6, keyword: searchCharacters },

    !!searchCharacters,
  )

  const debouncedSearch = useRef(
    debounce((value: string) => {
      setSearchCharacters(value)
    }, 500),
  ).current

  useEffect(() => {
    debouncedSearch.cancel()
  }, [debouncedSearch])

  useEffect(() => {
    if (inView) {
      getCollectionList.fetchNextPage()
    }
  }, [getCollectionList.fetchNextPage, inView])

  console.log(getCollectionList.isLoading)

  return (
    <>
      <ModalHeader className="flex flex-col gap-1">
        <Input
          autoFocus
          variant="bordered"
          color="secondary"
          t="input"
          startContent={<Icon icon="icon-park-outline:search" />}
          endContent={
            getCollectionList.isFetching && (
              <div className="flex items-center">
                <LoadingIcon size="sm" />
              </div>
            )
          }
          size="lg"
          placeholder="Search collections..."
          onValueChange={debouncedSearch}
        />
      </ModalHeader>
      <ModalBody className="overflow-hidden">
        <div className="flex-1 space-y-2 overflow-y-auto pr-2">
          {!searchCharacters ? (
            <div className="flex flex-col items-center">
              <Avatar
                src="https://play-lh.googleusercontent.com/mLvvgUXJVZeu-GbqWZfr8ug74V7d8Od9yU2AOvUUptiki9wIH-BJHataFTJI_J0TlQ"
                className="h-28 w-28"
              />
              <div className="font-thin text-gray-500">
                Enter the collection you want to search for.
              </div>
            </div>
          ) : getCollectionList.isFetching && !getCollectionList.data ? (
            <SearchCollectionLoading />
          ) : !!getCollectionList.data &&
            getCollectionList.data.pages[0].data.length > 0 ? (
            <>
              {getCollectionList.data.pages.map((page) =>
                page.data.map((collection) => (
                  <Button
                    key={collection.id}
                    variant="flat"
                    color="default"
                    onClick={() => {
                      onClose()
                      navigate(`/collection/${collection.id}`)
                    }}
                    fullWidth
                    className="flex h-fit justify-between gap-5 px-4 py-4 capitalize"
                  >
                    <div className="flex items-center gap-5">
                      <Avatar
                        size="lg"
                        isBordered
                        radius="sm"
                        src={collection.imageUrl}
                      />
                      <div className="flex flex-col items-start">
                        <div className="line-clamp-1 font-semibold capitalize">
                          {collection.name}
                        </div>
                        <div className="line-clamp-1 capitalize">
                          {collection.totalProducts} items
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-start">
                      <div>Floor Price</div>
                      <div className="font-semibold">
                        {collection.floorPrice.toLocaleString("de-DE")} USD
                      </div>
                    </div>
                  </Button>
                )),
              )}
              {getCollectionList.isFetchingNextPage && (
                <SearchCollectionLoading />
              )}
            </>
          ) : getCollectionList.isFetching ? (
            <SearchCollectionLoading />
          ) : (
            <div className="flex flex-col items-center">
              <div className="font-medium">
                No results for "{searchCharacters}"
              </div>
              <div className="font-thin text-gray-500">
                Try searching for something else.
              </div>
            </div>
          )}
          {getCollectionList.hasNextPage && <div ref={ref}></div>}
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="danger" variant="flat" onPress={onClose}>
          Close
        </Button>
      </ModalFooter>
    </>
  )
}
