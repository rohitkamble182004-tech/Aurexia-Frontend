import Image from "next/image"

type Product = {
  id: string
  name: string
  slug: string
  imageUrl: string
}

type Drop = {
  id: string
  name: string
  slug: string
  products: Product[]
}

async function getHeroDrop(): Promise<Drop | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/storefront/home`,
    { cache: 'no-store' }
  )

  if (!res.ok) return null

  const drops: Drop[] = await res.json()
  return drops[0] ?? null
}

export default async function Hero() {
  const drop = await getHeroDrop()

  if (!drop || drop.products.length === 0) return null

  const heroProduct = drop.products[0]

  return (
    <section className="relative">
<Image
  src={heroProduct.imageUrl}
  alt={heroProduct.name}
  fill
  priority
  className="object-cover"
/>

      <div className="absolute bottom-10 left-10 text-white">
        <h1 className="text-3xl">{drop.name}</h1>
        <p>{heroProduct.name}</p>
      </div>
    </section>
  )
}
