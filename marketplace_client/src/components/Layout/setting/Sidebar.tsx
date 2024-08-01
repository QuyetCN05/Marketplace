import { Icon } from "@iconify-icon/react/dist/iconify.mjs"
import { Divider } from "@nextui-org/react"
import clsx from "clsx"
import { Link, useLocation } from "react-router-dom"

enum TitleSidebar {
  PROFILE = "Profile",
  CREATE_COLLECTION = "Create Collection",
  NOTIFICATIONS = "Notifications",
  OFFERS = "Offers",
  ACCOUNT_SUPPORT = "Account Support",
  MANAGEMENT = "Management",
  CREATE_PRODUCT = "Create Product",
}

enum KeySidebar {
  PROFILE = "profile",
  CREATE_COLLECTION = "create-collections",
  CREATE_PRODUCT = "create-products",
  /* NOTIFICATIONS = "#",
  OFFERS = "#",
  ACCOUNT_SUPPORT = "#", */
  MANAGEMENT = "management",
}

enum IconSidebar {
  PROFILE = "mingcute:user-4-line",
  CREATE_COLLECTION = "material-symbols:tab-group-outline-rounded",
  CREATE_PRODUCT = "ant-design:product-outlined",
  /*  NOTIFICATIONS = "mi:notification",
  OFFERS = "ic:outline-local-offer",
  ACCOUNT_SUPPORT = "mdi:shield-outline", */
  MANAGEMENT = "ic:twotone-developer-mode",
}

const sideBar = [
  {
    title: TitleSidebar.PROFILE,
    key: KeySidebar.PROFILE,
    icon: IconSidebar.PROFILE,
  },
  {
    title: TitleSidebar.CREATE_COLLECTION,
    key: KeySidebar.CREATE_COLLECTION,
    icon: IconSidebar.CREATE_COLLECTION,
  },
  {
    title: TitleSidebar.CREATE_PRODUCT,
    key: KeySidebar.CREATE_PRODUCT,
    icon: IconSidebar.CREATE_PRODUCT,
  },
  /* {
    title: TitleSidebar.NOTIFICATIONS,
    key: KeySidebar.NOTIFICATIONS,
    icon: IconSidebar.NOTIFICATIONS,
  },
  {
    title: TitleSidebar.OFFERS,
    key: KeySidebar.OFFERS,
    icon: IconSidebar.OFFERS,
  },
  {
    title: TitleSidebar.ACCOUNT_SUPPORT,
    key: KeySidebar.ACCOUNT_SUPPORT,
    icon: IconSidebar.ACCOUNT_SUPPORT,
  }, */
  {
    title: TitleSidebar.MANAGEMENT,
    key: KeySidebar.MANAGEMENT,
    icon: IconSidebar.MANAGEMENT,
  },
]

export default function Sidebar() {
  const location = useLocation()

  return (
    <div className="flex min-h-full w-full min-w-64 max-w-80">
      <div className="relative w-full px-5 text-default-600">
        <div className="sticky top-[65px]">
          <div className="px-3 py-5 font-bold">Settings</div>
          <div className="flex flex-col">
            {sideBar.map((item, idx) => (
              <Link
                to={item.key}
                key={idx}
                className={clsx(
                  "flex items-center gap-4 rounded-xl p-4 font-bold",
                  "hover:bg-default-100",
                  {
                    "!bg-default-100 text-black": location.pathname
                      .split("/")
                      .includes(item.key),
                  },
                )}
              >
                <Icon icon={item.icon} className="text-2xl" />
                <div>{item.title}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Divider orientation="vertical" />
    </div>
  )
}
