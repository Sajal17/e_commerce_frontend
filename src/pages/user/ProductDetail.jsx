import { useParams } from "react-router-dom";
import ProductDetailsBase from "../../pages/products/ProductsDetailsBase";

const ProductDetail = () => {
  const { id } = useParams();
  return <ProductDetailsBase productId={id} showRecentlyViewed />;
};

export default ProductDetail;