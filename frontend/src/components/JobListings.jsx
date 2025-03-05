import { Link } from "react-router-dom";

const ProductListings = ({ products }) => {
  return (
    <div className="job-list">
      {products.map((product) => (

        <div className="job-preview" key={product.id}>
          <Link to={`/jobs/${product.id}`}>
            <h2>{product.title}</h2>
          </Link>
          <p>Category: {product.category}</p>
          <p>Supplier: {product.supplier.name}</p>
        </div>
      ))}
    </div>
  );
};

export default ProductListings;
