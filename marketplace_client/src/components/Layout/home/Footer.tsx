import { Icon } from "@iconify-icon/react/dist/iconify.mjs"
import { Button, Input } from "@nextui-org/react"

const iconList = [
  {
    name: "twitter",
    icon: "mdi:twitter",
  },
  {
    name: "instagram",
    icon: "mdi:instagram",
  },
  {
    name: "discord",
    icon: "ic:baseline-discord",
  },
  {
    name: "facebook",
    icon: "ic:baseline-facebook",
  },
  {
    name: "youtube",
    icon: "mdi:youtube",
  },
  {
    name: "linkedin",
    icon: "mdi:linkedin",
  },
  {
    name: "mail",
    icon: "material-symbols:mail-outline",
  },
]

export default function Footer() {
  return (
    <div className="flex justify-center bg-secondary-800">
      <div className="flex w-full max-w-default gap-16 px-16 py-10 text-white">
        <div className="flex flex-1 flex-col gap-2">
          <div className="text-xl font-bold">Stay in the loop</div>
          <div>
            Join our mailing list to stay in the loop with our newest feature
            releases, NFT drops, and tips and tricks for navigating OpenSea.
          </div>
          <div className="flex items-center gap-2">
            <Input size="lg" placeholder="Your email address" />
            <Button size="lg" color="secondary">
              Sign up
            </Button>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <div className="text-xl font-bold">Join the community</div>
          <div className="flex gap-3">
            {iconList.map((icon) => (
              <Button
                isIconOnly
                size="lg"
                color="secondary"
                key={icon.name}
                startContent={<Icon icon={icon.icon} className="text-3xl" />}
              />
            ))}
          </div>
        </div>
        <div className="flex-1">
          <div className="text-xl font-bold">Need help?</div>
          <Button size="lg" color="secondary">
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  )
}
