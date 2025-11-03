import { useParams } from "react-router-dom";
import ProductDetailsBase from "../../pages/products/ProductsDetailsBase";

const ProductDetail = () => {
  const { id } = useParams(); // Get product ID from URL
  return <ProductDetailsBase productId={id} showRecentlyViewed />;
};

export default ProductDetail;