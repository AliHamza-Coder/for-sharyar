export interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  description: string;
  rating: number;
  image: string;
  title: string;
  Variation_Options: string[];
  Variation_Prices: string[];
  gallery: string[];
}

// Function to generate a slug from product name
export const generateSlug = (title: string) =>
  title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// Fetch all products and format them
export async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch("localhost:3000/api/products");
    const data = await res.json();

    return data.products?.map((item: any) => {
      const galleryImages = item.gallery || [];
      const updatedGallery = item.image ? [item.image, ...galleryImages] : galleryImages;

      return {
        id: item.id,
        name: item.name,
        slug: generateSlug(item.name),
        price: item.price,
        description: item.description,
        rating: item.rating,
        image: item.image,
        title: item.title || "",
        Variation_Options: item.Variation_Options || [],
        Variation_Prices: item.Variation_Prices || [],
        gallery: updatedGallery,
      };
    }) || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

// Fetch a single product by slug
export async function getProduct(slug: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find((product) => product.slug === slug) || null;
}

// Fetch related products (excluding the current product)
export async function getRelatedProducts(currentProductSlug: string): Promise<Product[]> {
  const products = await getProducts();
  return products.filter((product) => product.slug !== currentProductSlug).slice(0, 4);
}

// Fetch featured products (first 4)
export async function featuredProducts(): Promise<Product[]> {
  const products = await getProducts();
  return products.slice(0, 4);
}

